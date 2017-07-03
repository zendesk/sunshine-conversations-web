'use strict';

exports.__esModule = true;
exports.ReactTelephoneInput = undefined;

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.memoize');

var _lodash4 = _interopRequireDefault(_lodash3);

var _reactOnclickoutside = require('react-onclickoutside');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var classNames = require('classnames');
var countryData = require('../constants/country-data');
var allCountries = countryData.allCountries;
var allCountriesIso2Lookup = countryData.allCountriesIso2Lookup;

var isModernBrowser = void 0;

if (typeof document !== 'undefined') {
    isModernBrowser = Boolean(document.createElement('input').setSelectionRange);
} else {
    isModernBrowser = true;
}

var keys = {
    UP: 38,
    DOWN: 40,
    RIGHT: 39,
    LEFT: 37,
    ENTER: 13,
    ESC: 27,
    PLUS: 43,
    A: 65,
    Z: 90,
    SPACE: 32
};

var ReactTelephoneInput = exports.ReactTelephoneInput = function (_Component) {
    (0, _inherits3.default)(ReactTelephoneInput, _Component);

    function ReactTelephoneInput() {
        (0, _classCallCheck3.default)(this, ReactTelephoneInput);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args)));

        _initialiseProps.call(_this);

        var inputNumber = _this.props.initialValue || _this.props.value || '';
        var selectedCountryGuess = _this.guessSelectedCountry(inputNumber.replace(/\D/g, ''));
        var selectedCountryGuessIndex = allCountries.findIndex(function (country) {
            return country === selectedCountryGuess;
        });
        var formattedNumber = _this.formatNumber(inputNumber.replace(/\D/g, ''), selectedCountryGuess ? selectedCountryGuess.format : null);
        var preferredCountries = _this.props.preferredCountries.map(function (iso2) {
            return allCountriesIso2Lookup.hasOwnProperty(iso2) ? allCountries[allCountriesIso2Lookup[iso2]] : null;
        }).filter(function (val) {
            return val !== null;
        });

        _this.state = {
            preferredCountries: preferredCountries,
            selectedCountry: selectedCountryGuess,
            highlightCountryIndex: selectedCountryGuessIndex,
            formattedNumber: formattedNumber,
            showDropDown: false,
            queryString: '',
            freezeSelection: false,
            isValid: false,
            isEmpty: true,
            debouncedQueryStingSearcher: (0, _lodash2.default)(_this.searchCountry, 100)
        };
        return _this;
    }

    ReactTelephoneInput.prototype.getNumber = function getNumber() {
        return this.state.formattedNumber !== '+' ? this.state.formattedNumber : '';
    };

    ReactTelephoneInput.prototype.getValue = function getValue() {
        return this.getNumber();
    };

    ReactTelephoneInput.prototype.componentDidMount = function componentDidMount() {
        document.addEventListener('keydown', this.handleKeydown);

        if (typeof this.props.onChange === 'function') {
            this.props.onChange(this.state.formattedNumber, this.state.selectedCountry);
        }
    };

    ReactTelephoneInput.prototype.componentWillUnmount = function componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeydown);
    };

    ReactTelephoneInput.prototype.scrollTo = function scrollTo(country, middle) {
        if (!country) {
            return;
        }

        var container = _reactDom2.default.findDOMNode(this.refs.flagDropdownList);

        if (!container) {
            return;
        }

        var containerHeight = container.offsetHeight;
        var containerOffset = container.getBoundingClientRect();
        var containerTop = containerOffset.top + document.body.scrollTop;
        var containerBottom = containerTop + containerHeight;

        var element = country;
        var elementOffset = element.getBoundingClientRect();

        var elementHeight = element.offsetHeight;
        var elementTop = elementOffset.top + document.body.scrollTop;
        var elementBottom = elementTop + elementHeight;
        var middleOffset = containerHeight / 2 - elementHeight / 2;

        var newScrollTop = elementTop - containerTop + container.scrollTop;

        if (elementTop < containerTop) {
            // scroll up
            if (middle) {
                newScrollTop -= middleOffset;
            }
            container.scrollTop = newScrollTop;
        } else if (elementBottom > containerBottom) {
            // scroll down
            if (middle) {
                newScrollTop += middleOffset;
            }
            var heightDifference = containerHeight - elementHeight;
            container.scrollTop = newScrollTop - heightDifference;
        }
    };

    ReactTelephoneInput.prototype.formatNumber = function formatNumber(text, pattern) {
        // for all strings with length less than 3, just return it (1, 2 etc.)
        // also return the same text if the selected country has no fixed format
        if (text && text.length < 2 || !pattern || !this.props.autoFormat) {
            return '+' + text;
        }

        var formattedObject = (0, _from2.default)(pattern).reduce(function (acc, character) {
            if (acc.remainingText.length === 0) {
                return acc;
            }

            if (character !== '.') {
                return {
                    formattedText: acc.formattedText + character,
                    remainingText: acc.remainingText
                };
            }

            return {
                formattedText: acc.formattedText + acc.remainingText[0],
                remainingText: acc.remainingText.slice(1)
            };
        }, {
            formattedText: '',
            remainingText: text.split('')
        });

        return formattedObject.formattedText + formattedObject.remainingText.join('');
    };

    // put the cursor to the end of the input (usually after a focus event)
    ReactTelephoneInput.prototype._cursorToEnd = function _cursorToEnd(skipFocus) {
        var input = this.refs.numberInput;
        if (skipFocus) {
            this._fillDialCode();
        } else {
            input.focus();

            if (isModernBrowser) {
                var len = input.value.length;
                input.setSelectionRange(len, len);
            }
        }
    };

    // memoize results based on the first 5/6 characters. That is all that matters


    ReactTelephoneInput.prototype.getElement = function getElement(index) {
        return _reactDom2.default.findDOMNode(this.refs['flag_no_' + index]);
    };

    ReactTelephoneInput.prototype._fillDialCode = function _fillDialCode() {
        // if the input is blank, insert dial code of the selected country
        if (this.refs.numberInput.value === '') {
            this.setState({
                formattedNumber: '+' + this.state.selectedCountry.dialCode
            });
        }
    };

    ReactTelephoneInput.prototype._getHighlightCountryIndex = function _getHighlightCountryIndex(direction) {
        // had to write own function because underscore does not have findIndex. lodash has it
        var highlightCountryIndex = this.state.highlightCountryIndex + direction;

        if (highlightCountryIndex < 0 || highlightCountryIndex >= this.props.onlyCountries.length + this.state.preferredCountries.length) {
            return highlightCountryIndex - direction;
        }

        return highlightCountryIndex;
    };

    // memoize search results... caching all the way


    ReactTelephoneInput.prototype.searchCountry = function searchCountry() {
        var probableCandidate = this._searchCountry(this.state.queryString) || this.props.onlyCountries[0];
        var probableCandidateIndex = this.props.onlyCountries.findIndex(function (country) {
            return country === probableCandidate;
        }) + this.state.preferredCountries.length;

        this.scrollTo(this.getElement(probableCandidateIndex), true);

        this.setState({
            queryString: '',
            highlightCountryIndex: probableCandidateIndex
        });
    };

    ReactTelephoneInput.prototype.getCountryDropDownList = function getCountryDropDownList() {
        var _this2 = this;

        var countryDropDownList = this.state.preferredCountries.concat(this.props.onlyCountries).map(function (country, index) {
            var itemClasses = classNames({
                country: true,
                preferred: country.iso2 === 'us' || country.iso2 === 'gb',
                active: country.iso2 === 'us',
                highlight: _this2.state.highlightCountryIndex === index
            });

            var inputFlagClasses = 'flag ' + country.iso2;

            return _react2.default.createElement(
                'li',
                { ref: 'flag_no_ ' + index,
                    key: 'flag_no_ ' + index,
                    'data-flag-key': 'flag_no_ ' + index,
                    className: itemClasses,
                    'data-dial-code': '1',
                    'data-country-code': country.iso2,
                    onClick: _this2.handleFlagItemClick.bind(_this2, country) },
                _react2.default.createElement('div', { className: inputFlagClasses }),
                _react2.default.createElement(
                    'span',
                    { className: 'country-name' },
                    country.name
                ),
                _react2.default.createElement(
                    'span',
                    { className: 'dial-code' },
                    '+ ' + country.dialCode + ' '
                )
            );
        }, this);

        var dashedLi = _react2.default.createElement('li', { key: 'dashes',
            className: 'divider' });

        // let's insert a dashed line in between preffered countries and the rest
        countryDropDownList.splice(this.state.preferredCountries.length, 0, dashedLi);

        var dropDownClasses = classNames({
            'country-list': true,
            'hide': !this.state.showDropDown
        });

        return _react2.default.createElement(
            'ul',
            { ref: 'flagDropdownList',
                className: dropDownClasses },
            countryDropDownList
        );
    };

    ReactTelephoneInput.prototype.render = function render() {
        var arrowClasses = classNames({
            'arrow': true,
            'up': this.state.showDropDown
        });

        var inputClasses = classNames({
            'form-control': true,
            'invalid-number': !this.state.isValid,
            'empty': this.state.isEmpty
        });

        var flagViewClasses = classNames({
            'flag-dropdown': true,
            'open-dropdown': this.state.showDropDown
        });

        var inputFlagClasses = 'flag ' + this.state.selectedCountry.iso2;

        return _react2.default.createElement(
            'div',
            { className: 'react-tel-input' },
            _react2.default.createElement('input', { onChange: this.handleInput,
                onClick: this.handleInputClick,
                onFocus: this.handleInputFocus,
                onBlur: this.handleInputBlur,
                onKeyDown: this.handleInputKeyDown,
                value: this.state.formattedNumber,
                ref: 'numberInput',
                type: 'tel',
                className: inputClasses,
                autoComplete: 'tel',
                placeholder: '+1 212-555-2368' }),
            _react2.default.createElement(
                'div',
                { ref: 'flagDropDownButton',
                    className: flagViewClasses,
                    onKeyDown: this.handleKeydown },
                _react2.default.createElement(
                    'div',
                    { ref: 'selectedFlag',
                        onClick: this.handleFlagDropdownClick,
                        className: 'selected-flag',
                        title: this.state.selectedCountry.name + ': + ' + this.state.selectedCountry.dialCode },
                    _react2.default.createElement(
                        'div',
                        { className: inputFlagClasses },
                        _react2.default.createElement('div', { className: arrowClasses })
                    )
                )
            ),
            this.state.showDropDown ? this.getCountryDropDownList() : ''
        );
    };

    return ReactTelephoneInput;
}(_react.Component);

ReactTelephoneInput.propTypes = {
    value: _react.PropTypes.string,
    initialValue: _react.PropTypes.string,
    autoFormat: _react.PropTypes.bool,
    defaultCountry: _react.PropTypes.string,
    onlyCountries: _react.PropTypes.arrayOf(_react.PropTypes.object),
    preferredCountries: _react.PropTypes.arrayOf(_react.PropTypes.string),
    classNames: _react.PropTypes.string,
    onChange: _react.PropTypes.func,
    onEnterKeyPress: _react.PropTypes.func,
    onBlur: _react.PropTypes.func,
    onFocus: _react.PropTypes.func,
    onValid: _react.PropTypes.func,
    onInvalid: _react.PropTypes.func
};
ReactTelephoneInput.defaultProps = {
    value: '',
    initialValue: '',
    autoFormat: true,
    onlyCountries: allCountries,
    defaultCountry: allCountries[0].iso2,
    onEnterKeyPress: function onEnterKeyPress() {},
    preferredCountries: []
};

var _initialiseProps = function _initialiseProps() {
    var _this3 = this;

    this.displayName = 'ReactTelephoneInput';
    this.mixins = [_reactOnclickoutside.onClickOutside];

    this.checkValidity = function (inputNumber) {
        var countries = countryData.allCountries;
        var strippedNumber = inputNumber.replace(/\D/g, '');
        var currentlyValid = _this3.state.isValid;
        var isEmpty = inputNumber.length === 0;

        var isValid = countries.some(function (country) {
            return strippedNumber.startsWith(country.dialCode);
        });

        if (currentlyValid !== isValid) {
            isValid ? _this3.props.onValid && _this3.props.onValid() : _this3.props.onInvalid && _this3.props.onInvalid();
        }

        _this3.setState({
            isValid: isValid,
            isEmpty: isEmpty
        });
    };

    this.guessSelectedCountry = (0, _lodash4.default)(function (inputNumber) {
        var bestGuess = void 0;
        var secondBestGuess = allCountries.find(function (country) {
            return country.iso2 === _this3.props.defaultCountry;
        }) || _this3.props.onlyCountries[0];

        if (inputNumber.trim() !== '') {
            bestGuess = _this3.props.onlyCountries.reduce(function (selectedCountry, country) {
                if (inputNumber.startsWith(country.dialCode)) {
                    if (country.dialCode.length > selectedCountry.dialCode.length) {
                        return country;
                    }
                    if (country.dialCode.length === selectedCountry.dialCode.length && country.priority < selectedCountry.priority) {
                        return country;
                    }
                }

                return selectedCountry;
            }, {
                dialCode: '',
                priority: 10001
            }, _this3);
        } else {
            return secondBestGuess;
        }

        if (!bestGuess.name) {
            return secondBestGuess;
        }

        return bestGuess;
    });

    this.handleFlagDropdownClick = function () {
        // need to put the highlight on the current selected country if the dropdown is going to open up
        _this3.setState({
            showDropDown: !_this3.state.showDropDown,
            highlightCountry: _this3.props.onlyCountries.find(function (country) {
                return country === _this3.state.selectedCountry;
            }),
            highlightCountryIndex: _this3.state.preferredCountries.concat(_this3.props.onlyCountries).findIndex(function (country) {
                return country === _this3.state.selectedCountry;
            })
        }, function () {
            // only need to scrool if the dropdown list is alive
            if (_this3.state.showDropDown) {
                _this3.scrollTo(_this3.getElement(_this3.state.highlightCountryIndex + _this3.state.preferredCountries.length));
            }
        });
    };

    this.handleInput = function (event) {
        var formattedNumber = '+';
        var newSelectedCountry = _this3.state.selectedCountry;
        var freezeSelection = _this3.state.freezeSelection;

        // if the input is the same as before, must be some special key like enter etc.
        if (event.target.value === _this3.state.formattedNumber) {
            return;
        }

        // ie hack
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }

        if (event.target.value.length > 0) {
            // before entering the number in new format, lets check if the dial code now matches some other country
            var inputNumber = event.target.value.replace(/\D/g, '');

            // we don't need to send the whole number to guess the country... only the first 6 characters are enough
            // the guess country function can then use memoization much more effectively since the set of input it gets has drastically reduced
            if (!_this3.state.freezeSelection || _this3.state.selectedCountry.dialCode.length > inputNumber.length) {
                newSelectedCountry = _this3.guessSelectedCountry(inputNumber.substring(0, 6));
                freezeSelection = false;
            }
            // let us remove all non numerals from the input
            formattedNumber = _this3.formatNumber(inputNumber, newSelectedCountry.format);
        }

        var caretPosition = event.target.selectionStart;
        var oldFormattedText = _this3.state.formattedNumber;
        var diff = formattedNumber.length - oldFormattedText.length;

        _this3.setState({
            formattedNumber: formattedNumber,
            freezeSelection: freezeSelection,
            selectedCountry: newSelectedCountry.dialCode.length > 0 ? newSelectedCountry : _this3.state.selectedCountry
        }, function () {
            if (isModernBrowser) {
                if (diff > 0) {
                    caretPosition = caretPosition - diff;
                }

                if (caretPosition > 0 && oldFormattedText.length >= formattedNumber.length) {
                    this.refs.numberInput.setSelectionRange(caretPosition, caretPosition);
                }
            }

            if (this.props.onChange) {
                this.props.onChange(this.state.formattedNumber, this.state.selectedCountry);
            }
        });

        _this3.checkValidity(formattedNumber);
    };

    this.handleInputClick = function () {
        _this3.setState({
            showDropDown: false
        });
        _this3._cursorToEnd();
    };

    this.handleFlagItemClick = function (country) {
        var currentSelectedCountry = _this3.state.selectedCountry;
        var nextSelectedCountry = _this3.props.onlyCountries.find(function (nextCountry) {
            return nextCountry === country;
        });

        // tiny optimization
        if (currentSelectedCountry.iso2 !== nextSelectedCountry.iso2) {
            var newNumber = void 0;
            if (!_this3.state.formattedNumber || _this3.state.formattedNumber === '+') {
                newNumber = nextSelectedCountry.dialCode;
            } else {
                // TODO - the below replacement is a bug. It will replace stuff from middle too
                newNumber = _this3.state.formattedNumber.replace(currentSelectedCountry.dialCode, nextSelectedCountry.dialCode);
            }

            var formattedNumber = _this3.formatNumber(newNumber.replace(/\D/g, ''), nextSelectedCountry.format);

            _this3.setState({
                showDropDown: false,
                selectedCountry: nextSelectedCountry,
                freezeSelection: true,
                formattedNumber: formattedNumber
            }, function () {
                this._cursorToEnd();
                if (this.props.onChange) {
                    this.props.onChange(formattedNumber, nextSelectedCountry);
                }
            });

            _this3.checkValidity(formattedNumber);
        } else {
            _this3.setState({
                showDropDown: false
            });
        }
    };

    this.handleInputFocus = function () {
        // trigger parent component's onFocus handler
        if (typeof _this3.props.onFocus === 'function') {
            _this3.props.onFocus(_this3.state.formattedNumer, _this3.state.selectedCountry);
        }

        _this3._fillDialCode();
        _this3._cursorToEnd();
    };

    this._searchCountry = (0, _lodash4.default)(function (queryString) {
        if (!queryString || queryString.length === 0) {
            return null;
        }
        // don't include the preferred countries in search
        var probableCountries = this.props.onlyCountries.filter(function (country) {
            return country.name.toLowerCase().startsWith(queryString.toLowerCase());
        }, this);
        return probableCountries[0];
    });

    this.handleKeydown = function (event) {
        if (!_this3.state.showDropDown) {
            return;
        }

        // ie hack
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }

        var self = _this3;
        function _moveHighlight(direction) {
            self.setState({
                highlightCountryIndex: self._getHighlightCountryIndex(direction)
            }, function () {
                self.scrollTo(self.getElement(self.state.highlightCountryIndex), true);
            });
        }

        switch (event.which) {
            case keys.DOWN:
                _moveHighlight(1);
                break;
            case keys.UP:
                _moveHighlight(-1);
                break;
            case keys.ENTER:
                _this3.handleFlagItemClick(_this3.props.onlyCountries[_this3.state.highlightCountryIndex], event);
                break;
            case keys.ESC:
                _this3.setState({
                    showDropDown: false
                }, _this3._cursorToEnd);
                break;
            default:
                if (event.which >= keys.A && event.which <= keys.Z || event.which === keys.SPACE) {
                    _this3.setState({
                        queryString: _this3.state.queryString + String.fromCharCode(event.which)
                    }, _this3.state.debouncedQueryStingSearcher);
                }
        }
    };

    this.handleInputKeyDown = function (event) {
        if (event.which === keys.ENTER) {
            _this3.props.onEnterKeyPress(event);
        }
    };

    this.handleClickOutside = function () {
        if (_this3.state.showDropDown) {
            _this3.setState({
                showDropDown: false
            });
        }
    };

    this.handleInputBlur = function () {
        if (typeof _this3.props.onBlur === 'function') {
            _this3.props.onBlur(_this3.state.formattedNumber, _this3.state.selectedCountry);
        }
        _this3._cursorToEnd(true);
    };
};