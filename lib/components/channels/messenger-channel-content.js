'use strict';

exports.__esModule = true;
exports.MessengerChannelContent = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactMessengerPlugin = require('react-messenger-plugin');

var _reactMessengerPlugin2 = _interopRequireDefault(_reactMessengerPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MessengerChannelContent = exports.MessengerChannelContent = function (_Component) {
    (0, _inherits3.default)(MessengerChannelContent, _Component);

    function MessengerChannelContent() {
        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, MessengerChannelContent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
            sdkBlocked: false
        }, _this.facebookScriptDidLoad = function () {
            // __globalCallbacks is one of the key added to FB when it's properly loaded.
            if (!global.FB || !global.FB.__globalCallbacks) {
                console.warn('Facebook SDK was blocked.');
                _this.setState({
                    sdkBlocked: true
                });
            }
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    MessengerChannelContent.prototype.render = function render() {
        var _props = this.props;
        var appId = _props.appId;
        var pageId = _props.pageId;
        var smoochId = _props.smoochId;


        return this.state.sdkBlocked ? _react2.default.createElement(
            'p',
            null,
            _react2.default.createElement(
                'a',
                { href: 'https://m.me/' + pageId,
                    target: '_blank' },
                'https://m.me/' + pageId
            )
        ) : _react2.default.createElement(_reactMessengerPlugin2.default, { appId: appId,
            pageId: pageId,
            passthroughParams: smoochId,
            asyncScriptOnLoad: this.facebookScriptDidLoad,
            size: 'large' });
    };

    return MessengerChannelContent;
}(_react.Component);

MessengerChannelContent.propTypes = {
    appId: _react.PropTypes.string.isRequired,
    pageId: _react.PropTypes.string.isRequired,
    smoochId: _react.PropTypes.string.isRequired
};