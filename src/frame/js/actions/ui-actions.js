import { computeWidgetSize } from '../utils/ui';

export const UPDATE_UI_TEXT = 'UPDATE_UI_TEXT';
export const RESET_UI = 'RESET_UI';
export const UPDATE_WIDGET_SIZE = 'UPDATE_WIDGET_SIZE';

export function updateText(props) {
    return {
        type: UPDATE_UI_TEXT,
        text: props
    };
}

export function resetUI() {
    return {
        type: RESET_UI
    };
}

export function updateWidgetSize() {
    return (dispatch) => {
        dispatch({
            type: UPDATE_WIDGET_SIZE,
            size: computeWidgetSize()
        });
    };
}
