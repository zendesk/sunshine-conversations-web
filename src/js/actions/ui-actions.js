export const UPDATE_UI_TEXT = 'UPDATE_UI_TEXT';
export const RESET_UI = 'RESET_UI';

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
