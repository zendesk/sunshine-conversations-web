import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash.debounce';
import memoize from 'lodash.memoize';
import { onClickOutside } from 'react-onclickoutside';

const classNames = require('classnames');
const countryData = require('../constants/country-data');
const allCountries = countryData.allCountries;
const allCountriesIso2Lookup = countryData.allCountriesIso2Lookup;

let isModernBrowser;

if (typeof document !== 'undefined') {
    isModernBrowser = Boolean(document.createElement('input').setSelectionRange);
} else {
    isModernBrowser = true;
}

const keys = {
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

export class ReactTelephoneInput extends Component {
    displayName = 'ReactTelephoneInput';

    mixins = [onClickOutside];

    static propTypes = {
        value: PropTypes.string,
        initialValue: PropTypes.string,
        autoFormat: PropTypes.bool,
        defaultCountry: PropTypes.string,
        onlyCountries: PropTypes.arrayOf(PropTypes.object),
        preferredCountries: PropTypes.arrayOf(PropTypes.string),
        classNames: PropTypes.string,
        onChange: PropTypes.func,
        onEnterKeyPress: PropTypes.func,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
        onValid: PropTypes.func,
        onInvalid: PropTypes.func
    };

    static defaultProps = {
        value: '',
        initialValue: '',
        autoFormat: true,
        onlyCountries: allCountries,
        defaultCountry: allCountries[0].iso2,
        onEnterKeyPress: () => {},
        preferredCountries: []
    };

    constructor(...args) {
        super(...args);

        const inputNumber = this.props.initialValue || this.props.value || '';
        const selectedCountryGuess = this.guessSelectedCountry(inputNumber.replace(/\D/g, ''));
        const selectedCountryGuessIndex = allCountries.findIndex((country) => {
            return country === selectedCountryGuess;
        });
        const formattedNumber = this.formatNumber(inputNumber.replace(/\D/g, ''), selectedCountryGuess ? selectedCountryGuess.format : null);
        const preferredCountries = this.props.preferredCountries
            .map(function(iso2) {
                return allCountriesIso2Lookup.hasOwnProperty(iso2) ? allCountries[allCountriesIso2Lookup[iso2]] : null;
            })
            .filter(function(val) {
                return val !== null;
            });

        this.state = {
            preferredCountries: preferredCountries,
            selectedCountry: selectedCountryGuess,
            highlightCountryIndex: selectedCountryGuessIndex,
            formattedNumber: formattedNumber,
            showDropDown: false,
            queryString: '',
            freezeSelection: false,
            isValid: false,
            isEmpty: true,
            debouncedQueryStingSearcher: debounce(this.searchCountry, 100)
        };
    }

    getNumber() {
        return this.state.formattedNumber !== '+' ? this.state.formattedNumber : '';
    }

    getValue() {
        return this.getNumber();
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeydown);

        if (typeof this.props.onChange === 'function') {
            this.props.onChange(this.state.formattedNumber, this.state.selectedCountry);
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeydown);
    }

    scrollTo(country, middle) {
        if (!country) {
            return;
        }

        const container = ReactDOM.findDOMNode(this.refs.flagDropdownList);

        if (!container) {
            return;
        }

        const containerHeight = container.offsetHeight;
        const containerOffset = container.getBoundingClientRect();
        const containerTop = containerOffset.top + document.body.scrollTop;
        const containerBottom = containerTop + containerHeight;

        const element = country;
        const elementOffset = element.getBoundingClientRect();

        const elementHeight = element.offsetHeight;
        const elementTop = elementOffset.top + document.body.scrollTop;
        const elementBottom = elementTop + elementHeight;
        const middleOffset = containerHeight / 2 - elementHeight / 2;

        let newScrollTop = elementTop - containerTop + container.scrollTop;

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
            const heightDifference = containerHeight - elementHeight;
            container.scrollTop = newScrollTop - heightDifference;
        }
    }

    formatNumber(text, pattern) {
        // for all strings with length less than 3, just return it (1, 2 etc.)
        // also return the same text if the selected country has no fixed format
        if (text && text.length < 2 || !pattern || !this.props.autoFormat) {
            return '+' + text;
        }

        const formattedObject = Array.from(pattern)
            .reduce((acc, character) => {
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
    }

    checkValidity = (inputNumber) => {
        const countries = countryData.allCountries;
        const strippedNumber = inputNumber.replace(/\D/g, '');
        const currentlyValid = this.state.isValid;
        const isEmpty = inputNumber.length === 0;

        const isValid = countries.some((country) => {
            return strippedNumber.startsWith(country.dialCode);
        });

        if (currentlyValid !== isValid) {
            isValid ? this.props.onValid && this.props.onValid() : this.props.onInvalid && this.props.onInvalid();
        }

        this.setState({
            isValid,
            isEmpty
        });
    }

    // put the cursor to the end of the input (usually after a focus event)
    _cursorToEnd(skipFocus) {
        const input = this.refs.numberInput;
        if (skipFocus) {
            this._fillDialCode();
        } else {
            input.focus();

            if (isModernBrowser) {
                const len = input.value.length;
                input.setSelectionRange(len, len);
            }
        }
    }

    // memoize results based on the first 5/6 characters. That is all that matters
    guessSelectedCountry = memoize((inputNumber) => {
        let bestGuess;
        const secondBestGuess = allCountries.find((country) => {
            return country.iso2 === this.props.defaultCountry;
        }) || this.props.onlyCountries[0];

        if (inputNumber.trim() !== '') {
            bestGuess = this.props.onlyCountries.reduce((selectedCountry, country) => {
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
            }, this);
        } else {
            return secondBestGuess;
        }

        if (!bestGuess.name) {
            return secondBestGuess;
        }

        return bestGuess;
    });

    getElement(index) {
        return ReactDOM.findDOMNode(this.refs['flag_no_' + index]);
    }

    handleFlagDropdownClick = () => {
        // need to put the highlight on the current selected country if the dropdown is going to open up
        this.setState({
            showDropDown: !this.state.showDropDown,
            highlightCountry: this.props.onlyCountries
                .find((country) => {
                    return country === this.state.selectedCountry;
                }),
            highlightCountryIndex: this.state.preferredCountries
                .concat(this.props.onlyCountries)
                .findIndex((country) => {
                    return country === this.state.selectedCountry;
                })
        }, () => {
            // only need to scrool if the dropdown list is alive
            if (this.state.showDropDown) {
                this.scrollTo(this.getElement(this.state.highlightCountryIndex + this.state.preferredCountries.length));
            }
        });
    }

    handleInput = (event) => {
        let formattedNumber = '+';
        let newSelectedCountry = this.state.selectedCountry;
        let freezeSelection = this.state.freezeSelection;

        // if the input is the same as before, must be some special key like enter etc.
        if (event.target.value === this.state.formattedNumber) {
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
            const inputNumber = event.target.value.replace(/\D/g, '');

            // we don't need to send the whole number to guess the country... only the first 6 characters are enough
            // the guess country function can then use memoization much more effectively since the set of input it gets has drastically reduced
            if (!this.state.freezeSelection || this.state.selectedCountry.dialCode.length > inputNumber.length) {
                newSelectedCountry = this.guessSelectedCountry(inputNumber.substring(0, 6));
                freezeSelection = false;
            }
            // let us remove all non numerals from the input
            formattedNumber = this.formatNumber(inputNumber, newSelectedCountry.format);
        }

        let caretPosition = event.target.selectionStart;
        const oldFormattedText = this.state.formattedNumber;
        const diff = formattedNumber.length - oldFormattedText.length;

        this.setState({
            formattedNumber: formattedNumber,
            freezeSelection: freezeSelection,
            selectedCountry: newSelectedCountry.dialCode.length > 0 ? newSelectedCountry : this.state.selectedCountry
        }, function() {
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

        this.checkValidity(formattedNumber);
    }

    handleInputClick = () => {
        this.setState({
            showDropDown: false
        });
        this._cursorToEnd();
    }

    handleFlagItemClick = (country) => {
        const currentSelectedCountry = this.state.selectedCountry;
        const nextSelectedCountry = this.props.onlyCountries.find((nextCountry) => {
            return nextCountry === country;
        });

        // tiny optimization
        if (currentSelectedCountry.iso2 !== nextSelectedCountry.iso2) {
            let newNumber;
            if (!this.state.formattedNumber || this.state.formattedNumber === '+') {
                newNumber = nextSelectedCountry.dialCode;
            } else {
                // TODO - the below replacement is a bug. It will replace stuff from middle too
                newNumber = this.state.formattedNumber.replace(currentSelectedCountry.dialCode, nextSelectedCountry.dialCode);
            }

            const formattedNumber = this.formatNumber(newNumber.replace(/\D/g, ''), nextSelectedCountry.format);

            this.setState({
                showDropDown: false,
                selectedCountry: nextSelectedCountry,
                freezeSelection: true,
                formattedNumber: formattedNumber
            }, function() {
                this._cursorToEnd();
                if (this.props.onChange) {
                    this.props.onChange(formattedNumber, nextSelectedCountry);
                }
            });

            this.checkValidity(formattedNumber);
        } else {
            this.setState({
                showDropDown: false
            });
        }
    }

    handleInputFocus = () => {
        // trigger parent component's onFocus handler
        if (typeof this.props.onFocus === 'function') {
            this.props.onFocus(this.state.formattedNumer, this.state.selectedCountry);
        }

        this._fillDialCode();
        this._cursorToEnd();
    }

    _fillDialCode() {
        // if the input is blank, insert dial code of the selected country
        if (this.refs.numberInput.value === '') {
            this.setState({
                formattedNumber: '+' + this.state.selectedCountry.dialCode
            });
        }
    }

    _getHighlightCountryIndex(direction) {
        // had to write own function because underscore does not have findIndex. lodash has it
        const highlightCountryIndex = this.state.highlightCountryIndex + direction;

        if (highlightCountryIndex < 0 || highlightCountryIndex >= this.props.onlyCountries.length + this.state.preferredCountries.length) {
            return highlightCountryIndex - direction;
        }

        return highlightCountryIndex;
    }

    // memoize search results... caching all the way
    _searchCountry = memoize(function(queryString) {
        if (!queryString || queryString.length === 0) {
            return null;
        }
        // don't include the preferred countries in search
        const probableCountries = this.props.onlyCountries.filter((country) => {
            return country.name.toLowerCase().startsWith(queryString.toLowerCase());
        }, this);
        return probableCountries[0];
    });

    searchCountry() {
        const probableCandidate = this._searchCountry(this.state.queryString) || this.props.onlyCountries[0];
        const probableCandidateIndex = this.props.onlyCountries.findIndex((country) => {
                return country === probableCandidate;
            }) + this.state.preferredCountries.length;

        this.scrollTo(this.getElement(probableCandidateIndex), true);

        this.setState({
            queryString: '',
            highlightCountryIndex: probableCandidateIndex
        });
    }

    handleKeydown = (event) => {
        if (!this.state.showDropDown) {
            return;
        }

        // ie hack
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }

        const self = this;
        function _moveHighlight(direction) {
            self.setState({
                highlightCountryIndex: self._getHighlightCountryIndex(direction)
            }, function() {
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
                this.handleFlagItemClick(this.props.onlyCountries[this.state.highlightCountryIndex], event);
                break;
            case keys.ESC:
                this.setState({
                    showDropDown: false
                }, this._cursorToEnd);
                break;
            default:
                if (event.which >= keys.A && event.which <= keys.Z || event.which === keys.SPACE) {
                    this.setState({
                        queryString: this.state.queryString + String.fromCharCode(event.which)
                    }, this.state.debouncedQueryStingSearcher);
                }
        }
    }

    handleInputKeyDown = (event) => {
        if (event.which === keys.ENTER) {
            this.props.onEnterKeyPress(event);
        }
    }

    handleClickOutside = () => {
        if (this.state.showDropDown) {
            this.setState({
                showDropDown: false
            });
        }
    }

    getCountryDropDownList() {
        const countryDropDownList = this.state.preferredCountries
            .concat(this.props.onlyCountries)
            .map((country, index) => {
                const itemClasses = classNames({
                    country: true,
                    preferred: country.iso2 === 'us' || country.iso2 === 'gb',
                    active: country.iso2 === 'us',
                    highlight: this.state.highlightCountryIndex === index
                });

                const inputFlagClasses = 'flag ' + country.iso2;

                return <li ref={ `flag_no_ ${index}` }
                           key={ `flag_no_ ${index}` }
                           data-flag-key={ `flag_no_ ${index}` }
                           className={ itemClasses }
                           data-dial-code={ '1' }
                           data-country-code={ country.iso2 }
                           onClick={ this.handleFlagItemClick.bind(this, country) }>
                           <div className={ inputFlagClasses } />
                           <span className='country-name'>{ country.name }</span>
                           <span className='dial-code'>{ `+ ${country.dialCode} ` }</span>
                       </li>;
            }, this);

        const dashedLi = <li key='dashes'
                             className='divider' />;

        // let's insert a dashed line in between preffered countries and the rest
        countryDropDownList.splice(this.state.preferredCountries.length, 0, dashedLi);

        const dropDownClasses = classNames({
            'country-list': true,
            'hide': !this.state.showDropDown
        });

        return <ul ref='flagDropdownList'
                   className={ dropDownClasses }>
                   { countryDropDownList }
               </ul>;
    }

    handleInputBlur = () => {
        if (typeof this.props.onBlur === 'function') {
            this.props.onBlur(this.state.formattedNumber, this.state.selectedCountry);
        }
        this._cursorToEnd(true);
    }

    render() {
        const arrowClasses = classNames({
            'arrow': true,
            'up': this.state.showDropDown
        });

        const inputClasses = classNames({
            'form-control': true,
            'invalid-number': !this.state.isValid,
            'empty': this.state.isEmpty
        });

        const flagViewClasses = classNames({
            'flag-dropdown': true,
            'open-dropdown': this.state.showDropDown
        });

        const inputFlagClasses = 'flag ' + this.state.selectedCountry.iso2;

        return <div className={ 'react-tel-input' }>
                   <input onChange={ this.handleInput }
                          onClick={ this.handleInputClick }
                          onFocus={ this.handleInputFocus }
                          onBlur={ this.handleInputBlur }
                          onKeyDown={ this.handleInputKeyDown }
                          value={ this.state.formattedNumber }
                          ref={ 'numberInput' }
                          type={ 'tel' }
                          className={ inputClasses }
                          autoComplete={ 'tel' }
                          placeholder={ '+1 212-555-2368' }>
                   </input>
                   <div ref={ 'flagDropDownButton' }
                        className={ flagViewClasses }
                        onKeyDown={ this.handleKeydown }>
                       <div ref={ 'selectedFlag' }
                            onClick={ this.handleFlagDropdownClick }
                            className={ 'selected-flag' }
                            title={ this.state.selectedCountry.name + ': + ' + this.state.selectedCountry.dialCode }>
                           <div className={ inputFlagClasses }>
                               <div className={ arrowClasses } />
                           </div>
                       </div>
                   </div>
                   { this.state.showDropDown ? this.getCountryDropDownList() : '' }
               </div>;
    }
}
