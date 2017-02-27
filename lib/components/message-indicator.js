'use strict';

exports.__esModule = true;
exports.MessageIndicator = exports.MessageIndicatorComponent = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reactDocumentTitle = require('react-document-title');

var _reactDocumentTitle2 = _interopRequireDefault(_reactDocumentTitle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BLINKING_INTERVAL = 1500;

var MessageIndicatorComponent = exports.MessageIndicatorComponent = function (_Component) {
    (0, _inherits3.default)(MessageIndicatorComponent, _Component);

    function MessageIndicatorComponent() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, MessageIndicatorComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
            initialDocumentTitle: global.document ? document.title : '',
            currentTitle: global.document ? document.title : '',
            lastSetTitle: ''
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    MessageIndicatorComponent.prototype.blinkTitle = function blinkTitle() {
        var _this2 = this;

        if (!this.blinkInterval) {
            var fn = function fn() {
                var _props = _this2.props,
                    messageIndicatorTitleSingular = _props.messageIndicatorTitleSingular,
                    messageIndicatorTitlePlural = _props.messageIndicatorTitlePlural,
                    unreadCount = _props.unreadCount;
                var _state = _this2.state,
                    currentTitle = _state.currentTitle,
                    lastSetTitle = _state.lastSetTitle;
                var initialDocumentTitle = _this2.state.initialDocumentTitle;


                var title = document.title;

                if (title !== initialDocumentTitle && title !== lastSetTitle) {
                    // document title changed for something we don't control, this is the new initial title
                    _this2.setState({
                        initialDocumentTitle: title
                    });

                    initialDocumentTitle = title;
                }

                if (currentTitle === initialDocumentTitle && unreadCount > 0) {

                    var newTitle = unreadCount === 1 ? messageIndicatorTitleSingular : messageIndicatorTitlePlural;

                    _this2.setState({
                        currentTitle: newTitle.replace('{count}', unreadCount),
                        lastSetTitle: newTitle.replace('{count}', unreadCount)
                    });
                } else {
                    _this2.setState({
                        currentTitle: initialDocumentTitle
                    });
                }
            };
            this.blinkInterval = setInterval(fn, BLINKING_INTERVAL);
        }
    };

    MessageIndicatorComponent.prototype.cancelBlinking = function cancelBlinking() {
        var _state2 = this.state,
            currentTitle = _state2.currentTitle,
            initialDocumentTitle = _state2.initialDocumentTitle;

        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
            delete this.blinkInterval;
        }

        if (currentTitle !== initialDocumentTitle) {
            this.setState({
                currentTitle: initialDocumentTitle
            });
        }
    };

    MessageIndicatorComponent.prototype.componentWillReceiveProps = function componentWillReceiveProps(_ref) {
        var unreadCount = _ref.unreadCount;

        if (unreadCount > 0) {
            this.blinkTitle();
        } else {
            this.cancelBlinking();
        }
    };

    MessageIndicatorComponent.prototype.componentDidMount = function componentDidMount() {
        var unreadCount = this.props.unreadCount;

        if (unreadCount > 0) {
            this.blinkTitle();
        }
    };

    MessageIndicatorComponent.prototype.componentWillUnmount = function componentWillUnmount() {
        this.cancelBlinking();

        // do it manually because `DocumentTitle` will be unmounted
        document.title = this.state.initialDocumentTitle;
    };

    MessageIndicatorComponent.prototype.render = function render() {
        return _react2.default.createElement(_reactDocumentTitle2.default, { title: this.state.currentTitle });
    };

    return MessageIndicatorComponent;
}(_react.Component);

MessageIndicatorComponent.propTypes = {
    unreadCount: _react.PropTypes.number.isRequired,
    messageIndicatorTitleSingular: _react.PropTypes.string.isRequired,
    messageIndicatorTitlePlural: _react.PropTypes.string.isRequired
};
var MessageIndicator = exports.MessageIndicator = (0, _reactRedux.connect)(function (_ref2) {
    var text = _ref2.ui.text,
        unreadCount = _ref2.conversation.unreadCount;

    return {
        unreadCount: unreadCount,
        messageIndicatorTitleSingular: text.messageIndicatorTitleSingular,
        messageIndicatorTitlePlural: text.messageIndicatorTitlePlural
    };
})(MessageIndicatorComponent);