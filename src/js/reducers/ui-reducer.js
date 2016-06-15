import { UPDATE_UI_TEXT, RESET_UI } from '../actions/ui-actions';
import { RESET } from '../actions/common-actions';

const INITIAL_STATE = {
    text: {
        headerText: 'How can we help?',
        inputPlaceholder: 'Type a message...',
        sendButtonText: 'Send',
        introText: 'We\'re here to talk, so ask us anything!',
        introAppText: 'Type your message below or message us using your favorite app.',
        settingsText: 'You can leave us your email so that we can get back to you this way.',
        settingsReadOnlyText: 'We\'ll get back to you at this email address if we missed you.',
        settingsInputPlaceholder: 'Your email address',
        settingsSaveButtonText: 'Save',
        settingsHeaderText: 'Settings',
        settingsNotificationText: 'In case we\'re slow to respond you can <a href data-ui-settings-link>leave us your email</a>.',
        actionPaymentError: 'An error occurred while processing the card. <br> Please try again or use a different card.',
        actionPaymentCompleted: 'Payment Completed',
        actionPostbackError: 'An error occurred while processing your action. Please try again.',
        messageError: 'An error occured while sending your message. Please try again.',
        invalidFileError: 'Sorry, but only images are supported currently. Please choose a file with a supported extension (jpg, jpeg, png, gif, or bmp).',
        messageIndicatorTitleSingular: '({count}) New message',
        messageIndicatorTitlePlural: '({count}) New messages',
        connectNotificationText: 'Be notified inside your other apps when you get a reply.'
    }
};


export function UIReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
            return Object.assign({}, INITIAL_STATE);
        case UPDATE_UI_TEXT:
            return Object.assign({}, state, {
                text: Object.assign({}, state.text, action.text)
            });

        case RESET_UI:
            return Object.assign({}, INITIAL_STATE);
        default:
            return state;
    }
}
