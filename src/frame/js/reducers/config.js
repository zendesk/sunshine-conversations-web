import { SET_CONFIG, RESET_CONFIG } from '../actions/config';
import { RESET } from '../actions/common';

const INITIAL_STATE = {
    configBaseUrl: null,
    apiBaseUrl: null,
    soundNotificationEnabled: true,
    imageUploadEnabled: true,
    integrations: [],
    app: {}
};

export default function ConfigReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
        case RESET_CONFIG:
            return Object.assign({}, INITIAL_STATE);
        case SET_CONFIG:
            return {
                ...state,
                [action.key]: action.value
            };

        default:
            return state;
    }
}
