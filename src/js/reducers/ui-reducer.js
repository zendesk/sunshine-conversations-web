import { UPDATE_UI_TEXT, RESET_UI } from '../actions/ui-actions';
import { RESET } from '../actions/common-actions';

const INITIAL_STATE = {
    text: {
        headerText: 'How can we help?',
        inputPlaceholder: 'Type a message...',
        sendButtonText: 'Send',
        introductionText: 'We\'re here to talk, so ask us anything!',
        introAppText: 'Message us below or from your favorite app.',
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
        invalidFileError: 'Only images are supported. Choose a file with a supported extension (jpg, jpeg, png, gif, or bmp).',
        messageIndicatorTitleSingular: '({count}) New message',
        messageIndicatorTitlePlural: '({count}) New messages',
        connectNotificationText: 'Be notified inside your other apps when you get a reply.',
        notificationSettingsChannelsTitle: 'Other Channels',
        notificationSettingsChannelsDescription: 'You can also talk to us from your favorite app or service.',
        notificationSettingsConnectedAs: 'Connected as {username}',
        viberQRCodeError: 'An error occurred while fetching your Viber QR code. Please try again.',
        wechatQRCodeError: 'An error occurred while fetching your WeChat QR code. Please try again.',
        messengerChannelDescription: 'Connect your Facebook Messenger account to be notified when you get a reply and carry the conversation on Facebook Messenger.',
        frontendEmailChannelDescription: 'To talk to us using email just send a message to our email address and we\'ll reply shortly:',
        smsChannelDescription: 'Connect your SMS number to text with us and receive notifications over SMS.',
        smsChannelPendingDescription: 'Check your messages at {number} to confirm your phone number.',
        telegramChannelDescription: 'To talk to us using Telegram, add our bot:',
        wechatChannelDescriptionMobile: 'To send us a message from WeChat, save this QR code image and upload it in the <a href=\'weixin://dl/scan\'>QR code scanner</a>.',
        wechatChannelDescription: 'To send us a message from WeChat, scan this QR code using the WeChat app.',
        lineChannelDescription: 'To talk to us using LINE, scan this QR code using the LINE app and send us a message.',
        viberChannelDescription: 'To send us a message from Viber, scan this QR code using the Viber app.',
        smsInvalidNumberError: 'Your phone number isn\'t valid. Please try again.',
        smsTooManyRequestsError: 'A connection for that number was requested recently. Please try again in {minutes} minutes.',
        smsTooManyRequestsOneMinuteError: 'A connection for that number was requested recently. Please try again in 1 minute.',
        smsBadRequestError: 'We were unable to communicate with this number. Try again or use a different one.',
        smsUnhandledError: 'Something went wrong. Please try again.',
        smsPingChannelError: 'There was an error sending a message to your number.',
        smsLinkCancelled: 'Link to {appUserNumber} was cancelled.',
        smsLinkPending: 'Pending',
        smsStartTexting: 'Start Texting',
        smsChangeNumber: 'Change my number',
        smsSendText: 'Send me a text',
        smsContinue: 'Continue',
        smsCancel: 'Cancel',
        fetchingHistory: 'Retrieving history...',
        fetchHistory: 'Load more'
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
