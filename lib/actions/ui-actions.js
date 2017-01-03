'use strict';

exports.__esModule = true;
exports.updateText = updateText;
exports.resetUI = resetUI;
var UPDATE_UI_TEXT = exports.UPDATE_UI_TEXT = 'UPDATE_UI_TEXT';
var RESET_UI = exports.RESET_UI = 'RESET_UI';

function updateText(props) {
    return {
        type: UPDATE_UI_TEXT,
        text: props
    };
}

function resetUI() {
    return {
        type: RESET_UI
    };
}