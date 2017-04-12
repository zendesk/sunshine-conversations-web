'use strict';

exports.__esModule = true;
exports.ImageUpload = exports.ImageUploadComponent = undefined;

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactRedux = require('react-redux');

var _lodash = require('lodash.bindall');

var _lodash2 = _interopRequireDefault(_lodash);

var _conversation = require('../services/conversation');

var _events = require('../utils/events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ImageUploadComponent = exports.ImageUploadComponent = function (_Component) {
    (0, _inherits3.default)(ImageUploadComponent, _Component);

    function ImageUploadComponent() {
        (0, _classCallCheck3.default)(this, ImageUploadComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args)));

        _this.state = {
            imageButtonHovered: false
        };

        (0, _lodash2.default)(_this, 'onImageChange', 'onMouseOver', 'onMouseOut');
        return _this;
    }

    ImageUploadComponent.prototype.onImageChange = function onImageChange(e) {
        var _this2 = this;

        e.preventDefault();
        var dispatch = this.props.dispatch;

        var files = this._fileInputNode.files;
        // we only allow one file in the input, but let's handle it
        // as if we supported multiple ones
        return _promise2.default.all((0, _from2.default)(files).map(function (file) {
            // catch it to prevent an unhandled promise exception
            return dispatch((0, _conversation.uploadImage)(file)).catch(function () {});
        })).then(function () {
            // if the file input is not reset, a user can't pick the same
            // file twice in a row.
            _this2._formNode.reset();
        });
    };

    ImageUploadComponent.prototype.onMouseOver = function onMouseOver() {
        this.setState({
            imageButtonHovered: true
        });
    };

    ImageUploadComponent.prototype.onMouseOut = function onMouseOut() {
        this.setState({
            imageButtonHovered: false
        });
    };

    ImageUploadComponent.prototype.render = function render() {
        var _this3 = this;

        var styles = {
            form: {
                flex: '0 1 34px'
            },
            icon: {}
        };

        if (this.props.color && this.state.imageButtonHovered) {
            styles.icon.color = '#' + this.props.color;
        }
        return _react2.default.createElement(
            'form',
            { ref: function ref(c) {
                    return _this3._formNode = (0, _reactDom.findDOMNode)(c);
                },
                onSubmit: _events.preventDefault,
                style: styles.form },
            _react2.default.createElement(
                'label',
                { className: 'btn btn-sk-link image-upload',
                    htmlFor: 'sk-img-upload',
                    onMouseOver: this.onMouseOver,
                    onMouseOut: this.onMouseOut,
                    style: styles.icon,
                    onClick: function onClick(e) {
                        e.preventDefault();
                        _this3._fileInputNode.click();
                    } },
                _react2.default.createElement('i', { className: 'fa fa-camera' })
            ),
            _react2.default.createElement('input', { type: 'file',
                id: 'sk-img-upload',
                accept: 'image/*',
                onChange: this.onImageChange,
                ref: function ref(c) {
                    return _this3._fileInputNode = (0, _reactDom.findDOMNode)(c);
                } })
        );
    };

    return ImageUploadComponent;
}(_react.Component);

var ImageUpload = exports.ImageUpload = (0, _reactRedux.connect)(null, null, null, {
    withRef: true
})(ImageUploadComponent);