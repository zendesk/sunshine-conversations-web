# [Smooch Web Messenger](https://smooch.io)

[![npm version](https://badge.fury.io/js/smooch.svg)](http://badge.fury.io/js/smooch)

Smooch is the best way to have personal, rich conversations with people on your website or customers on any device. Our features, integrations and developer-friendly APIs empower companies to connect with their customers in a whole new way.

The Smooch Web Messenger will add [live web messaging](https://smooch.io/live-web-chat/) to your website or web app. Customers will be able to talk to you from your website, while you manage conversations using your favorite business systems.

-   Let your customers talk to you the way they want by seamlessly [moving web chat conversations](https://smooch.io/cross-channel-messaging/) to any messaging app.
-   Sync conversations across every device and channel your customers use.
-   Build better relationships with messaging that feels and looks tailored to your website.
-   Delight your customers with the most engaging conversational experience using [rich messaging](https://smooch.io/rich-messaging/).
-   Maximize development productivity with a single codebase across platforms and [add more channels](https://smooch.io/cross-channel-messaging/) anytime.
-   Bring every conversation into your existing business systems. No new tool to learn. [See all integrations](https://smooch.io/integrations/).
-   Allow [multiple users to participate in a conversation](https://docs.smooch.io/guide/multi-party-conversations/) with each other along with the business actor.

## **Note:** this document is for version `5.0.0`. If you are upgrading please see the release notes [here](https://github.com/zendesk/sunshine-conversations-web/releases/tag/5.0.0).

## Usage

### Script Tag

Add the following code towards the end of the `<head>` section on your page and replace `<integration-id>` with your integration id at the end of the script. You may replace `"5"` with any version from `4.0.0` onwards, or with a major version (i.e.: `"4"` or `"5"`) to load that specific version of the Web SDK. If a version is included without specifying the patch, the latest version of the specified major release will be loaded. If an invalid version is passed an error will be thrown and the Web SDK will fail to load.

<!-- prettier-ignore -->
```html
<script>
    !function(o,p,s,e,c){var i,a,h,u=[],d=[];function t(){var t="You must provide a supported major version.";try{if(!c)throw new Error(t);var e,n="https://cdn.smooch.io/",r="smooch";if((e="string"==typeof this.response?JSON.parse(this.response):this.response).url){var o=p.getElementsByTagName("script")[0],s=p.createElement("script");s.async=!0;var i=c.match(/([0-9]+)\.?([0-9]+)?\.?([0-9]+)?/),a=i&&i[1];if(i&&i[3])s.src=n+r+"."+c+".min.js";else{if(!(4<=a&&e["v"+a]))throw new Error(t);s.src=e["v"+a]}o.parentNode.insertBefore(s,o)}}catch(e){e.message===t&&console.error(e)}}o[s]={init:function(){i=arguments;var t={then:function(e){return d.push({type:"t",next:e}),t},catch:function(e){return d.push({type:"c",next:e}),t}};return t},on:function(){u.push(arguments)},render:function(){a=arguments},destroy:function(){h=arguments}},o.__onWebMessengerHostReady__=function(e){if(delete o.__onWebMessengerHostReady__,o[s]=e,i)for(var t=e.init.apply(e,i),n=0;n<d.length;n++){var r=d[n];t="t"===r.type?t.then(r.next):t.catch(r.next)}a&&e.render.apply(e,a),h&&e.destroy.apply(e,h);for(n=0;n<u.length;n++)e.on.apply(e,u[n])};var n=new XMLHttpRequest;n.addEventListener("load",t),n.open("GET","https://"+e+".webloader.smooch.io/",!0),n.responseType="json",n.send()}(window,document,"Smooch","<integration-id>","5");
</script>
```

then initialize the Web Messenger by placing this snippet towards the end of the `body` section of your page.

```html
<script>
    Smooch.init({ integrationId: '<integration-id>' }).then(function () {
        // Your code after init is complete
    });
</script>
```

### Browserify and Webpack

Install from npm

```
npm install --save smooch
```

Require and init

```javascript
var Smooch = require('smooch');

Smooch.init({ integrationId: '<integration-id>' }).then(function () {
    // Your code after init is complete
});
```

## Browser support

Web Messenger supports all popular browsers.

#### Desktop versions

-   Chrome: Latest and one major version behind
-   Edge: Latest and one major version behind
-   Firefox: Latest and one major version behind
-   Internet Explorer: 11+
-   Safari: Latest and one major version behind

#### Mobile versions

-   Stock browser on Android 4.1+
-   Safari on iOS 8+

#### Other browsers

Web Messenger is likely compatible with other and older browsers but we only test against the versions above.

## API

### Individual functions

#### init(options)

Initializes the Smooch widget in the web page using the specified options. It returns a promise that will resolve when the Web Messenger is ready. Note that except `on` and `off`, all methods needs to be called after a successful `init`.

##### Options

| Option                           | Optional? | Default value                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------------------- | --------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| integrationId                    | No        | -                             | Your integration id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| externalId                       | Yes       | -                             | Optional. User's external id, which can be passed in `init()` as an alternative to `login()` (see [below](#authenticating-the-user-init-vs-login))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| jwt                              | Yes       | -                             | Optional. User's authentication token, which can be passed in `init()` as an alternative to `login()` (see [below](#authenticating-the-user-init-vs-login))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| authCode                         | Yes       | -                             | An auth code for linking to an existing conversation (see more details [here](https://docs.smooch.io/rest/#get-auth-code))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| locale                           | Yes       | `en-US`                       | Locale used for date formatting using the `<language>-<COUNTRY>` format. Language codes can be found [here](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) and country codes [here](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2). <br /> **Note 1 : ** The country part is optional, and if a country is either not recognized or supported, it will fallback to using the generic language. If the language isn't supported, it will fallback to `en-US`. <br /> **Note 2:** this is _only_ used for date formatting and doesn't provide built-in translations for Web Messenger. Refer to the [documentation](https://docs.smooch.io/guide/web-messenger/#strings-customization) for how to handle translations. |
| soundNotificationEnabled         | Yes       | `true`                        | Enables the sound notification for new messages                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| imageUploadEnabled               | Yes       | `true`                        | Enables the image upload feature. (deprecated: use menuItems.imageUpload; if this option is `false`, it will disable `menuItems.imageUpload` and `menuItems.fileUpload`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| fixedHeader                      | Yes       | `false`                       | When enabled, the introduction pane will be pinned at the top of the conversation instead of scrolling with it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| embedded                         | Yes       | False                         | Tells the widget it will be embedded. (see Embedded section below)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| displayStyle                     | Yes       | `button`                      | Choose how the messenger will appear on your website. Must be either `button` or `tab`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| buttonIconUrl                    | Yes       | -                             | When the `displayStyle` is `button`, you have the option of selecting your own button icon. The image must be at least 200 x 200 pixels and must be in either JPG, PNG, or GIF format.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| buttonWidth                      | Yes       | `58px`                        | When the `displayStyle` is `button`, you have the option of specifying the button width.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| buttonHeight                     | Yes       | `58px`                        | When the `displayStyle` is `button`, you have the option of specifying the button height.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| businessName                     | Yes       | -                             | A custom business name.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| businessIconUrl                  | Yes       | -                             | A custom business icon url. The image must be at least 200 x 200 pixels and must be in either JPG, PNG, or GIF format.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| backgroundImageUrl               | Yes       | -                             | A background image url for the conversation. Image will be tiled to fit the window.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| integrationOrder                 | Yes       | -                             | Array of integration IDs. When set, only integrations from this list will be displayed. If an empty array is used, no integrations will be displayed. _Note_: Listing an integration in the array doesn't guarantee that it will be displayed in the Web Messenger.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| customColors                     | Yes       | [See below.](#customcolors)   | Colors used in the Web Messenger UI.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| customText                       | Yes       | See the example below         | Strings used in the Web Messenger UI. You can use these to either customize the text or translate it. _Note_: Some strings include variables (surrounded by `{}`) which must remain in your customized text.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| menuItems                        | Yes       | [See below.](#menuitems)      | Choose menu items.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| notificationChannelPromptEnabled | Yes       | `true`                        | Enables displaying a prompt to new users after their first message to suggest linking their chat instance with their other 3rd-party apps.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| browserStorage                   | Yes       | `localStorage`                | Choose the storage type to use for storing user identity in the browser. Must be either `localStorage` or `sessionStorage`. [Learn more](https://docs.smooch.io/guide/web-messenger/#browser-storage)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| delegate                         | Yes       | `undefined`                   | Sets a delegate on the conversation. See the [delegate](#delegate) section for more details.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| prechatCapture                   | Yes       | [See below.](#prechatcapture) | Enables automatically capturing a user's name and email via a form before the start of a conversation. Disables the chat input until the form has been submitted.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| canUserSeeConversationList       | Yes       | `true`                        | Allows users to view their list of conversations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

##### `customColors`

| Option            | Optional? | Default value | Description                                                                                                                           |
| ----------------- | --------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| brandColor        | Yes       | `65758e`      | This color will be used in the messenger header and the button or tab in idle state. Must be a 3 or 6-character hexadecimal color.    |
| conversationColor | Yes       | `0099ff`      | This color will be used for customer messages, quick replies and actions in the footer. Must be a 3 or 6-character hexadecimal color. |
| actionColor       | Yes       | `0099ff`      | This color will be used for call-to-actions inside your messages. Must be a 3 or 6-character hexadecimal color.                       |

##### `customText`

The list of localizable strings. These strings can be modified. _If an option is not given a custom string, the default value will be used._

| Option                                     | Default value                                                                                                                                                                                                        |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| actionPaymentCompleted                     | Payment Completed                                                                                                                                                                                                    |
| actionPaymentError                         | An error occurred while processing the card. `<br>` Please try again or use a different card.                                                                                                                        |
| actionPostbackError                        | An error occurred while processing your action. Please try again.                                                                                                                                                    |
| clickToRetry                               | Message not delivered. Click to retry.                                                                                                                                                                               |
| clickToRetryForm                           | Form not submitted. Click anywhere on the form to retry.                                                                                                                                                             |
| connectNotificationText                    | Sync your conversation and continue messaging us through your favorite app.                                                                                                                                          |
| connectNotificationSingleText              | Be notified when you get a reply.                                                                                                                                                                                    |
| conversationListHeaderText                 | My conversations                                                                                                                                                                                                     |
| conversationListRelativeTimeJustNow        | Just now                                                                                                                                                                                                             |
| conversationListRelativeTimeMinute         | 1 minute ago                                                                                                                                                                                                         |
| conversationListRelativeTimeMinutes        | {value} minutes ago                                                                                                                                                                                                  |
| conversationListRelativeTimeHour           | 1 hour ago                                                                                                                                                                                                           |
| conversationListRelativeTimeHours          | {value} hours ago                                                                                                                                                                                                    |
| conversationListRelativeTimeYesterday      | Yesterday                                                                                                                                                                                                            |
| conversationListTimestampFormat            | MM/DD/YY                                                                                                                                                                                                             |
| conversationListPreviewAnonymousText       | Someone                                                                                                                                                                                                              |
| conversationListPreviewCarouselText        | {user} sent a message                                                                                                                                                                                                |
| conversationListPreviewFileText            | {user} sent a file                                                                                                                                                                                                   |
| conversationListPreviewFormText            | {user} sent a form                                                                                                                                                                                                   |
| conversationListPreviewFormResponseText    | {user} filled a form                                                                                                                                                                                                 |
| conversationListPreviewImageText           | {user} sent an image                                                                                                                                                                                                 |
| conversationListPreviewLocationRequestText | {user} sent a location request                                                                                                                                                                                       |
| conversationListPreviewUserText            | You                                                                                                                                                                                                                  |
| conversationTimestampHeaderFormat          | MMMM D YYYY, h:mm A                                                                                                                                                                                                  |
| couldNotConnect                            | Offline. You will not receive messages.                                                                                                                                                                              |
| couldNotConnectRetry                       | Reconnecting...                                                                                                                                                                                                      |
| couldNotConnectRetrySuccess                | You're back online!                                                                                                                                                                                                  |
| couldNotLoadConversations                  | Couldn’t load conversations.                                                                                                                                                                                         |
| emailChangeAddress                         | Change my email                                                                                                                                                                                                      |
| emailDescription                           | To be notified by email when you get a reply, enter your email address.                                                                                                                                              |
| emailFieldLabel                            | Email                                                                                                                                                                                                                |
| emailFieldPlaceholder                      | Your email address                                                                                                                                                                                                   |
| emailFormButton                            | Submit                                                                                                                                                                                                               |
| emailLinkingErrorMessage                   | Please submit a valid email address.                                                                                                                                                                                 |
| fetchHistory                               | Load more                                                                                                                                                                                                            |
| fetchingHistory                            | Retrieving history...                                                                                                                                                                                                |
| fileTooLargeError                          | Max file size limit exceeded ({size})                                                                                                                                                                                |
| fileTypeError                              | Unsupported file type.                                                                                                                                                                                               |
| formErrorInvalidEmail                      | Email is invalid                                                                                                                                                                                                     |
| formErrorNoLongerThan                      | Must contain no more than ({characters}) characters                                                                                                                                                                  |
| formErrorNoShorterThan                     | Must contain at least ({characters}) characters                                                                                                                                                                      |
| formErrorUnknown                           | This doesn't look quite right                                                                                                                                                                                        |
| formFieldSelectPlaceholderFallback         | Choose one...                                                                                                                                                                                                        |
| frontendEmailChannelDescription            | To talk to us using email just send a message to our email address and we\'ll reply shortly:                                                                                                                         |
| headerText                                 | How can we help?                                                                                                                                                                                                     |
| imageClickToReload                         | Click to reload image.                                                                                                                                                                                               |
| imageClickToView                           | Click to view {size} image.                                                                                                                                                                                          |
| imagePreviewNotAvailable                   | Preview not available.                                                                                                                                                                                               |
| inputPlaceholder                           | Type a message...                                                                                                                                                                                                    |
| inputPlaceholderBlocked                    | Complete the form above...                                                                                                                                                                                           |
| introAppText                               | Message us below or from your favorite app.                                                                                                                                                                          |
| lineChannelDescription                     | To talk to us using LINE, scan this QR code using the LINE app and send us a message.                                                                                                                                |
| linkError                                  | An error occurred when attempting to generate a link for this channel. Please try again.                                                                                                                             |
| linkChannelPageHeader                      | Sync your conversation                                                                                                                                                                                               |
| locationNotSupported                       | Your browser does not support location services or it’s been disabled. Please type your location instead.                                                                                                            |
| locationSecurityRestriction                | This website cannot access your location. Please type your location instead.                                                                                                                                         |
| locationSendingFailed                      | Could not send location                                                                                                                                                                                              |
| locationServicesDenied                     | This website cannot access your location. Allow access in your settings or type your location instead.                                                                                                               |
| messageError                               | An error occured while sending your message. Please try again.                                                                                                                                                       |
| messageIndicatorTitlePlural                | (`{count}`) New messages                                                                                                                                                                                             |
| messageIndicatorTitleSingular              | (`{count}`) New message                                                                                                                                                                                              |
| messageRelativeTimeDay                     | `{value}`d ago                                                                                                                                                                                                       |
| messageRelativeTimeHour                    | `{value}`h ago                                                                                                                                                                                                       |
| messageRelativeTimeJustNow                 | Just now                                                                                                                                                                                                             |
| messageRelativeTimeMinute                  | `{value}`m ago                                                                                                                                                                                                       |
| messageTimestampFormat                     | h:mm A                                                                                                                                                                                                               |
| messageDelivered                           | Delivered                                                                                                                                                                                                            |
| messageSeen                                | Seen                                                                                                                                                                                                                 |
| messageSending                             | Sending...                                                                                                                                                                                                           |
| messageTooLongError                        | Max message size limit exceeded ({size}).                                                                                                                                                                            |
| messengerChannelDescription                | Connect your Facebook Messenger account to be notified when you get a reply and continue the conversation on Facebook Messenger.                                                                                     |
| newConversationButtonText                  | New Conversation                                                                                                                                                                                                     |
| notificationSettingsChannelsDescription    | Sync this conversation by connecting to your favorite messaging app to continue the conversation your way.                                                                                                           |
| notificationSettingsChannelsTitle          | Other Channels                                                                                                                                                                                                       |
| notificationSettingsConnected              | Connected                                                                                                                                                                                                            |
| notificationSettingsConnectedAs            | Connected as `{username}`                                                                                                                                                                                            |
| prechatCaptureGreetingText                 | Hi there 👋\nTo start off, we\'d like to know a little bit more about you:                                                                                                                                           |
| prechatCaptureNameLabel                    | Your name                                                                                                                                                                                                            |
| prechatCaptureNamePlaceholder              | Type your name...                                                                                                                                                                                                    |
| prechatCaptureEmailLabel                   | Email                                                                                                                                                                                                                |
| prechatCaptureEmailPlaceholder             | name@company.com                                                                                                                                                                                                     |
| prechatCaptureConfirmationText             | Thanks for that! What can we help you with?                                                                                                                                                                          |
| prechatCaptureMailgunLinkingConfirmation   | You\'ll be notified here and by email at {email} once we reply.                                                                                                                                                      |
| sendButtonText                             | Send                                                                                                                                                                                                                 |
| settingsHeaderText                         | Settings                                                                                                                                                                                                             |
| shareLocation                              | Location                                                                                                                                                                                                             |
| smsBadRequestError                         | We were unable to communicate with this number. Try again or use a different one.                                                                                                                                    |
| smsCancel                                  | Cancel                                                                                                                                                                                                               |
| smsChangeNumber                            | Change my number                                                                                                                                                                                                     |
| smsChannelDescription                      | Connect your SMS number to be notified when you get a reply and continue the conversation over SMS.                                                                                                                  |
| smsChannelPendingDescription               | Check your messages at `{number}` to confirm your phone number.                                                                                                                                                      |
| smsContinue                                | Send                                                                                                                                                                                                                 |
| smsInvalidNumberError                      | Please submit a valid phone number.                                                                                                                                                                                  |
| smsLinkCancelled                           | Link to `{appUserNumber}` was cancelled.                                                                                                                                                                             |
| smsLinkPending                             | Pending                                                                                                                                                                                                              |
| smsPingChannelError                        | There was an error sending a message to your number.                                                                                                                                                                 |
| smsSendText                                | Send me a text                                                                                                                                                                                                       |
| smsStartTexting                            | Start Texting                                                                                                                                                                                                        |
| smsTooManyRequestsError                    | A connection for that number was requested recently. Please try again in {minutes} minutes.                                                                                                                          |
| smsTooManyRequestsOneMinuteError           | A connection for that number was requested recently. Please try again in 1 minute.                                                                                                                                   |
| smsUnhandledError                          | Something went wrong. Please try again.                                                                                                                                                                              |
| syncConversation                           | Sync conversation                                                                                                                                                                                                    |
| tapToRetry                                 | Message not delivered. Tap to retry.                                                                                                                                                                                 |
| tapToRetryForm                             | Form not submitted. Tap anywhere on the form to retry.                                                                                                                                                               |
| telegramChannelDescription                 | Connect your Telegram account to be notified when you get a reply and continue the conversation on Telegram                                                                                                          |
| unsupportedMessageType                     | Unsupported message type.                                                                                                                                                                                            |
| unsupportedActionType                      | Unsupported action type.                                                                                                                                                                                             |
| uploadDocument                             | File                                                                                                                                                                                                                 |
| uploadInvalidError                         | Invalid file.                                                                                                                                                                                                        |
| uploadPhoto                                | Image                                                                                                                                                                                                                |
| uploadVirusError                           | A virus was detected in your file and it has been rejected                                                                                                                                                           |
| viberChannelDescription                    | Connect your Viber account to be notified when you get a reply and continue the conversation on Viber. To get started, scan the QR code using the Viber app.                                                         |
| viberChannelDescriptionMobile              | Connect your Viber account to be notified when you get a reply and continue the conversation on Viber. To get started, install the Viber app and tap Connect.                                                        |
| viberQRCodeError                           | An error occurred while fetching your Viber QR code. Please try again.                                                                                                                                               |
| wechatChannelDescription                   | Connect your WeChat account to be notified when you get a reply and continue the conversation on WeChat. To get started, scan this QR code using the WeChat app.                                                     |
| wechatChannelDescriptionMobile             | Connect your WeChat account to be notified when you get a reply and continue the conversation on WeChat. To get started, save this QR code image and upload it `<a href=\'weixin://dl/scan\'>`QR code scanner`</a>`. |
| wechatQRCodeError                          | An error occurred while fetching your WeChat QR code. Please try again.                                                                                                                                              |
| whatsappChannelDescriptionDesktop          | Sync your account to WhatsApp by scanning the QR code or clicking the link below.\nThen, send the pre-populated message to validate the sync request. (Your code: {{code}}).                                         |
| whatsappChannelDescriptionMobile           | Sync your account to WhatsApp by clicking the link below.\nThen, send the pre-populated message to validate the sync request. (Your code: {{code}}).                                                                 |
| whatsappLinkingError                       | An error occurred while fetching your WhatsApp linking information. Please try again.                                                                                                                                |

[See below](#example) for an example.

##### `menuItems`

| Option        | Optional? | Default value | Description                           |
| ------------- | --------- | ------------- | ------------------------------------- |
| imageUpload   | Yes       | `true`        | Enables the image upload menu item.   |
| fileUpload    | Yes       | `true`        | Enables the file upload menu item.    |
| shareLocation | Yes       | `true`        | Enables the share location menu item. |

[See below](#example) for an example.

##### `prechatCapture`

| Option             | Optional? | Default value | Description                                                                                                                                                                       |
| ------------------ | --------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| avatarUrl          | Yes       | `undefined`   | Sets the URL of the avatar to use for the automatic reply to the prechat capture messages.                                                                                        |
| enabled            | Yes       | `false`       | Enables the prechat capture experience.                                                                                                                                           |
| enableEmailLinking | Yes       | `true`        | Automatically links the user's email to the app's Mailgun integration if it exists. If the property `fields` is defined, the first field of type `email` will be used.            |
| fields             | Yes       | -             | Overrides the default Prechat Capture [fields](https://docs.smooch.io/rest/#field) to define a [custom form](https://docs.smooch.io/guide/web-messenger/#custom-prechat-capture). |

[beforeSend delegate](#beforesend) will apply to the user's submitted message.

[See below](#example) for an example.

`prechatCapture` uses the following [`customText`](#customText) options:

| Option                                   | Description                                                                   |
| ---------------------------------------- | ----------------------------------------------------------------------------- |
| prechatCaptureGreetingText               | Text for the initial greeting message.                                        |
| prechatCaptureNameLabel                  | Label displayed for the default form's first field.                           |
| prechatCaptureNamePlaceholder            | Placeholder for the default form's first field.                               |
| prechatCaptureEmailLabel                 | Label displayed for the default form's second field.                          |
| prechatCaptureEmailPlaceholder           | Placeholder for the default form's second field.                              |
| prechatCaptureConfirmationText           | Text for the confirmation message sent when the form is completed.            |
| prechatCaptureMailgunLinkingConfirmation | Text for the notification message when a user has linked their email address. |

##### Example

```javascript
var skPromise = Smooch.init({
    integrationId: '<integration-id>',
    // For authenticated mode
    jwt: 'your_jwt',
    externalId: 'user_external_id',
    locale: 'en-US',

    customColors: {
        brandColor: '65758e',
        conversationColor: '65758e',
        actionColor: '65758e',
    },

    menuItems: {
        imageUpload: true,
        fileUpload: true,
        shareLocation: true,
    },

    fixedHeader: false,

    prechatCapture: {
        avatarUrl: 'http://domain.com/images/avatar.png',
        enabled: true,
        enableEmailLinking: true,
        fields: [
            {
                type: 'email',
                name: 'email',
                label: 'Email',
                placeholder: 'your@email.com',
            },
            {
                type: 'text',
                name: 'company-website',
                label: 'Company website',
                placeholder: 'mycompany.com',
            },
            {
                type: 'select',
                name: 'company-size',
                label: 'Company size',
                placeholder: 'Choose a number...',
                options: [
                    {
                        name: '1-10',
                        label: '1-10 employees',
                    },
                    {
                        name: '11-50',
                        label: '11-50 employees',
                    },
                    {
                        name: '51+',
                        label: '51+ employees',
                    },
                ],
            },
        ],
    },

    customText: {
        actionPaymentCompleted: 'Payment Completed',
        actionPaymentError:
            'An error occurred while processing the card. <br> Please try again or use a different card.',
        actionPostbackError: 'An error occurred while processing your action. Please try again.',
        clickToRetry: 'Message not delivered. Click to retry.',
        clickToRetryForm: 'Form not submitted. Click anywhere on the form to retry.',
        connectNotificationText: 'Sync your conversation and continue messaging us through your favorite app.',
        connectNotificationSingleText: 'Be notified when you get a reply.',
        conversationListHeaderText: 'My conversations',
        conversationListPreviewAnonymousText: 'Someone',
        conversationListPreviewCarouselText: '{user} sent a message',
        conversationListPreviewFileText: '{user} sent a file',
        conversationListPreviewFormText: '{user} sent a form',
        conversationListPreviewFormResponseText: '{user} filled a form',
        conversationListPreviewImageText: '{user} sent an image',
        conversationListPreviewLocationRequestText: '{user} sent a location request',
        conversationListPreviewUserText: 'You',
        conversationListRelativeTimeJustNow: 'Just now',
        conversationListRelativeTimeMinute: '1 minute ago',
        conversationListRelativeTimeMinutes: '{value} minutes ago',
        conversationListRelativeTimeHour: '1 hour ago',
        conversationListRelativeTimeHours: '{value} hours ago',
        conversationListRelativeTimeYesterday: 'Yesterday',
        conversationListTimestampFormat: 'MM/DD/YY',
        conversationTimestampHeaderFormat: 'MMMM D YYYY, h:mm A',
        couldNotConnect: 'Offline. You will not receive messages.',
        couldNotConnectRetry: 'Reconnecting...',
        couldNotConnectRetrySuccess: "You're back online!",
        couldNotLoadConversations: 'Couldn’t load conversations.',
        emailChangeAddress: 'Change my email',
        emailDescription: 'To be notified by email when you get a reply, enter your email address.',
        emailFieldLabel: 'Email',
        emailFieldPlaceholder: 'Your email address',
        emailFormButton: 'Submit',
        emailLinkingErrorMessage: 'Please submit a valid email address.',
        fetchHistory: 'Load more',
        fetchingHistory: 'Retrieving history...',
        fileTooLargeError: 'Max file size limit exceeded ({size})',
        fileTypeError: 'Unsupported file type.',
        formErrorInvalidEmail: 'Email is invalid',
        formErrorNoLongerThan: 'Must contain no more than ({characters}) characters',
        formErrorNoShorterThan: 'Must contain at least ({characters}) characters',
        formErrorUnknown: "This doesn't look quite right",
        formFieldSelectPlaceholderFallback: 'Choose one...',
        frontendEmailChannelDescription:
            "To talk to us using email just send a message to our email address and we'll reply shortly:",
        headerText: 'How can we help?',
        imageClickToReload: 'Click to reload image.',
        imageClickToView: 'Click to view {size} image.',
        imagePreviewNotAvailable: 'Preview not available.',
        inputPlaceholder: 'Type a message...',
        inputPlaceholderBlocked: 'Complete the form above...',
        introAppText: 'Message us below or from your favorite app.',
        lineChannelDescription: 'To talk to us using LINE, scan this QR code using the LINE app and send us a message.',
        linkError: 'An error occurred when attempting to generate a link for this channel. Please try again.',
        linkChannelPageHeader: 'Sync your conversation',
        locationNotSupported:
            'Your browser does not support location services or it’s been disabled. Please type your location instead.',
        locationSecurityRestriction: 'This website cannot access your location. Please type your location instead.',
        locationSendingFailed: 'Could not send location',
        locationServicesDenied:
            'This website cannot access your location. Allow access in your settings or type your location instead.',
        messageIndicatorTitlePlural: '({count}) New messages',
        messageIndicatorTitleSingular: '({count}) New message',
        messageRelativeTimeDay: '{value}d ago',
        messageRelativeTimeHour: '{value}h ago',
        messageRelativeTimeJustNow: 'Just now',
        messageRelativeTimeMinute: '{value}m ago',
        messageTimestampFormat: 'h:mm A',
        messageDelivered: 'Delivered',
        messageSeen: 'Seen',
        messageSending: 'Sending...',
        messengerChannelDescription:
            'Connect your Facebook Messenger account to be notified when you get a reply and continue the conversation on Facebook Messenger.',
        newConversationButtonText: 'New Conversation',
        notificationSettingsChannelsDescription:
            'Sync this conversation by connecting to your favorite messaging app to continue the conversation your way.',
        notificationSettingsChannelsTitle: 'Other Channels',
        notificationSettingsConnected: 'Connected',
        notificationSettingsConnectedAs: 'Connected as {username}',
        prechatCaptureGreetingText: "Hi there 👋\nTo start off, we'd like to know a little bit more about you:",
        prechatCaptureNameLabel: 'Your name',
        prechatCaptureNamePlaceholder: 'Type your name...',
        prechatCaptureEmailLabel: 'Email',
        prechatCaptureEmailPlaceholder: 'name@company.com',
        prechatCaptureConfirmationText: 'Thanks for that! What can we help you with?',
        prechatCaptureMailgunLinkingConfirmation: "You'll be notified here and by email at {email} once we reply.",
        sendButtonText: 'Send',
        settingsHeaderText: 'Settings',
        shareLocation: 'Location',
        smsBadRequestError: 'We were unable to communicate with this number. Try again or use a different one.',
        smsCancel: 'Cancel',
        smsChangeNumber: 'Change my number',
        smsChannelDescription:
            'Connect your SMS number to be notified when you get a reply and continue the conversation over SMS.',
        smsChannelPendingDescription: 'Check your messages at {number} to confirm your phone number.',
        smsContinue: 'Send',
        smsInvalidNumberError: 'Please submit a valid phone number.',
        smsLinkCancelled: 'Link to {appUserNumber} was cancelled.',
        smsLinkPending: 'Pending',
        smsPingChannelError: 'There was an error sending a message to your number.',
        smsSendText: 'Send me a text',
        smsStartTexting: 'Start Texting',
        smsTooManyRequestsError:
            'A connection for that number was requested recently. Please try again in {minutes} minutes.',
        smsTooManyRequestsOneMinuteError:
            'A connection for that number was requested recently. Please try again in 1 minute.',
        smsUnhandledError: 'Something went wrong. Please try again.',
        syncConversation: 'Sync conversation',
        tapToRetry: 'Message not delivered. Tap to retry.',
        tapToRetryForm: 'Form not submitted. Tap anywhere on the form to retry.',
        telegramChannelDescription:
            'Connect your Telegram account to be notified when you get a reply and continue the conversation on Telegram',
        unsupportedMessageType: 'Unsupported message type.',
        unsupportedActionType: 'Unsupported action type.',
        uploadDocument: 'File',
        uploadInvalidError: 'Invalid file',
        uploadPhoto: 'Image',
        uploadVirusError: 'A virus was detected in your file and it has been rejected',
        viberChannelDescription:
            'Connect your Viber account to be notified when you get a reply and continue the conversation on Viber. To get started, scan the QR code using the Viber app.',
        viberChannelDescriptionMobile:
            'Connect your Viber account to be notified when you get a reply and continue the conversation on Viber. To get started, install the Viber app and tap Connect.',
        viberQRCodeError: 'An error occurred while fetching your Viber QR code. Please try again.',
        wechatChannelDescription:
            'Connect your WeChat account to be notified when you get a reply and continue the conversation on WeChat. To get started, scan this QR code using the WeChat app.',
        wechatChannelDescriptionMobile:
            "Connect your WeChat account to be notified when you get a reply and continue the conversation on WeChat. To get started, save this QR code image and upload it in the <a href='weixin://dl/scan'>QR code scanner</a>.",
        wechatQRCodeError: 'An error occurred while fetching your WeChat QR code. Please try again.',
        whatsappChannelDescriptionDesktop:
            'Sync your account to WhatsApp by scanning the QR code or clicking the link below.\nThen, send the pre-populated message to validate the sync request. (Your code: {{code}}).',
        whatsappChannelDescriptionMobile:
            'Sync your account to WhatsApp by clicking the link below.\nThen, send the pre-populated message to validate the sync request. (Your code: {{code}}).',
        whatsappLinkingError: 'An error occurred while fetching your WhatsApp linking information. Please try again.',
    },
}).then(function () {
    // Your code after init is complete
});

skPromise.then(function () {
    // do something
});

// pass it around...

skPromise.then(function () {
    //do something else
});
```

#### open()

Opens the conversation widget (noop when embedded)

```javascript
Smooch.open();
```

#### close()

Closes the conversation widget (noop when embedded)

```javascript
Smooch.close();
```

#### isOpened()

Tells if the widget is currently opened or closed.

```javascript
Smooch.isOpened();
```

#### login(externalId, jwt)

Logs a user in the Web Messenger, retrieving the conversations the user already had on other browser sessions and/or devices. Note that you don't need to call this after `init` if you already passed the external id and jwt as arguments in the call to `init`, in which case it's done internally as part of the initialization sequence. This returns a `Promise` that resolves when the Web Messenger is ready again.

```javascript
Smooch.login('external-id', 'some-jwt');
```

#### logout()

Logs out the current user and reinitialize the widget with an anonymous user. This returns a promise that resolves when the Web Messenger is ready again.

```javascript
Smooch.logout();
```

#### destroy()

Destroys the Web Messenger and makes it disappear. The Web Messenger has to be reinitialized with `init` to be working again because it also clears up the integration id from the Web Messenger. It will also unbind all listeners you might have with `Smooch.on`.

```javascript
Smooch.destroy();
```

#### sendMessage(message, conversationId)

Sends a message to the targeted conversation on the user's behalf.

```javascript
Smooch.sendMessage(
    {
        type: 'text',
        text: 'hello',
    },
    '<conversation-id>',
);

// OR

Smooch.sendMessage('hello', '<conversation-id>');
```

#### startTyping(conversationId)

Sends an event indicating that the user has started typing.

Typing updates are automatically throttled, so you may call this method as often as necessary. The typing stop event will automatically fire 10 seconds after the most recent call to this method.

If **conversationId** is not provided, the currently loaded conversation will be used.

```javascript
Smooch.startTyping();

// OR

Smooch.startTyping('<conversation-id>');
```

#### stopTyping(conversationId)

Sends an event indicating that the user has stopped typing.

If **conversationId** is not provided, the currently loaded conversation will be used.

```javascript
Smooch.stopTyping();

// OR

Smooch.stopTyping('<conversation-id>');
```

#### triggerPostback(actionId, conversationId)

Trigger a [postback](https://docs.smooch.io/rest/#postback) action to the targeted conversation on the user's behalf.

The `actionId` is the `id` property of the targeted action.

If you have the `id` of the targetted `postback` action, you can pass it directly to `triggerPostback`.

```javascript
const actionId = '5a747faa065bbe4e7804f2a4';
Smooch.triggerPostback(actionId, '<conversation-id>');
```

Otherwise, you can get the `id` of an action by using `Smooch.getConversationById()`, e.g.

```javascript
Smooch.getConversationById('62565b5c2b4039adff80b7fd').then((conversation) => console.log(conversation.messages));

// [
//     {
//         "text": "Do you want to continue?",
//         "actions": [
//             {
//                 "payload": "text:continue",
//                 "text": "Continue conversation",
//                 id": "5a7c65211aaa9b61f69c95e3",
//                 "type": "postback"
//             }
//         ],
//         "type": "text",
//         "role": "business",
//         id": "5a7c65211aaa9b61f69c95e2",
//         // ...
//     }
// ]

// Indicate to Smooch that the user has clicked on the "Continue conversation" postback action.
Smooch.triggerPostback(conversation.messages[0].actions[0].id);
```

#### updateUser(user)

Updates the current user's information. If no user has been created yet, the Web Messenger will store the information and apply it to the user model when it is created.

```javascript
Smooch.updateUser({
    givenName: 'Updated',
    surname: 'Name',
    email: 'updated@email.com',
    avatarUrl: 'https://pictureurl.com/avatar_icon.png',
    metadata: {
        justGotUpdated: true,
    },
});
```

#### getUser()

Returns the current user.

```javascript
var user = Smooch.getUser();

// user object payload

user = {
    id: 'e70b153989345b0e178174b1',
    externalId: 'username',
    signedUpAt: '2019-09-26T14:48:58.167Z',
    hasPaymendInfo: false,
    metadata: {},
    surname: 'Surname',
    givenName: 'Given Name',
    email: 'email@domain.com',
    avatarUrl: 'https://pictureurl.com/avatar_icon.png',
};
```

#### getConversationById(conversationId)

Returns a `Promise<object>` whose payload is a conversation if it exists. If **conversationId** is not given, the current loaded conversation will be returned.

```javascript
Smooch.getConversationById('62565b5c2b4039adff80b7fd').then((conversation) => {
    console.log(conversation);
});

// or

Smooch.getConversationById().then((currentConversation) => {
    console.log(currentConversation);
});

// Data object
conversation = {
    id: '5aa4d7efdb32b10340db0223',
    lastUpdatedAt: 1581010017.596,
    businessLastRead: 1581010017.596,
    description: 'Conversation description',
    displayName: 'Conversation name',
    iconUrl: 'https://pictureurl.com/conversation_icon.png',
    type: 'sdkGroup',
    participants: [
        {
            id: '5f0cb8222c884d031ec05dd9',
            userId: 'e70b153989345b0e178174b1',
            unreadCount: 0,
            lastRead: 1581010017.596,
        },
    ],
    metadata: {},
    messages: [
        {
            role: 'user',
            userId: 'e70b153989345b0e178174b1',
            displayName: 'Some user',
            id: '5e6022c9cb55158bfd53f845',
            type: 'text',
            received: 1583358665.139,
            text: 'Hello',
            source: {
                type: 'web',
                id: 'c38ae913af7c4ef3800b339ee529c579',
                integrationId: '5d8274d4aa780a5483f0ee56',
            },
        },
        {
            role: 'business',
            displayName: 'Business display name',
            id: '5f0cb834bc8ea9e41b2af269',
            type: 'text',
            received: 1594669108.896,
            text: 'Greetings!',
            source: {
                type: 'slack',
            },
        },
    ],
};
```

#### getConversations()

Returns a list of conversations for the current user that were fetched during app initialization as well as the paginated results.

Note:

-   The `messages` property in each conversation may only have the most recent message in the conversation. The full message list will be available either when the conversation was loaded to the view or [Smooch.getConversationById](#getconversationbyidconversationid) gets called.
-   In the event that the client reconnects due to a network issue, the list may only contain the `10` most recent conversations for the user. All the additional conversations that were fetched as a result of pagination will be discarded.

See [Smooch.getConversationById](#getconversationbyidconversationid) for the definition of a conversation

```javascript
var conversations = Smooch.getConversations();
// Your code after receiving the current user's loaded conversations
```

#### getDisplayedConversation()

Returns the conversation being viewed by the user if it exists or `null` if the current user is in the conversations list view.

See [Smooch.getConversationById](#getconversationbyidconversationid) for the conversation definition

```javascript
var conversation = Smooch.getDisplayedConversation();
```

#### getMoreConversations()

Fetches and returns the next 10 most active conversations of the current user. This call also appends the conversations to the conversation list view.

See [Smooch.getConversationById](#getconversationbyidconversationid) for the conversation definition

```javascript
Smooch.getMoreConversations().then((nextConversations) => {
    // Your code after receiving the next set of conversations for the user
});
```

#### hasMoreConversations()

Returns a `boolean` indicating whether the user has more conversations that can be fetched for the conversation list view.

```javascript
var hasMore = Smooch.hasMoreConversations();

if (hasMore) {
    console.log('More conversations available to fetch...');
} else {
    console.log('There are no more conversations remaining for the user');
}
```

#### loadConversation(conversationId)

Loads a conversation into the current session

```javascript
Smooch.loadConversation('<conversation-id>');
```

#### updateConversation(conversationId, options)

Updates the targeted conversation.

```javascript
Smooch.updateConversation('<conversation-id>', {
    displayName: 'display name',
    iconUrl: 'https://www.example.png',
    description: 'description',
    metadata: {
        any: 'info',
    },
}).then((updatedConversation) => {
    // Your code after receiving the current user's updated conversation
});
```

where the fields are optional and could be set to `null` in the case integrators want to unset the value of the fields.

#### createConversation(options)

Creates a conversation on behalf of current user. If the user does not exist, it first creates the user and then a conversation associated with it.

All the options are optional.

```javascript
Smooch.createConversation({
    displayName: "Friday's Order",
    iconUrl: 'https://www.zen-tacos.com/tacos.png',
    description: 'Order #13377430',
    metadata: {
        isFirstTimeCustomer: true,
    },
    messages: [
        {
            text: 'Hi there! Your order is being prepared: 2 burritos, 4 tacos, 8 churros',
            type: 'text',
        },
    ],
}).then((conversation) => {
    // Your code after receiving the current user's new conversation
});
```

To create more than one conversation using this method, or to allow your user to create more conversations via the conversation list's `New Conversation` button, you must:

-   have the [Multi-Conversations feature](https://docs.smooch.io/rest/#operation/updateApp) enabled on your account
-   [update your Web Messenger integration](https://docs.smooch.io/rest/#update-integration) and set `canUserCreateMoreConversations` to `true`

Note that this API does not allow creating [`sdkGroup` conversations](https://docs.smooch.io/guide/multi-party-conversations/#new-platform-capabilities). This type of conversation must be created by using the public API.

#### markAllAsRead(conversationId)

Marks all unread messages as read.

If **conversationId** is not provided, the currently loaded conversation will have its messages marked as read.

```javascript
Smooch.markAllAsRead();

// or

Smooch.markAllAsRead('<conversation-id>');
```

#### showNotificationChannelPrompt()

Displays a prompt to the user suggesting the linking of the current chat instance with other 3rd-party apps.

```javascript
Smooch.showNotificationChannelPrompt();
```

#### setPredefinedMessage(message)

Prefills the user's chat input with a predefined message.

```javascript
Smooch.setPredefinedMessage(message);
```

#### setDelegate(delegate)

Sets a delegate on the conversation. Smooch must be initialized before calling this method. See the [delegate](#delegate) section for more details.

```javascript
Smooch.setDelegate(delegate);
```

### Delegate

Smooch allows you to set a delegate to receive callbacks when important changes happen in the conversation.
To set a delegate, pass the `delegate` parameter in to [init options](#options), or use the [setDelegate](#setdelegatedelegate) method. The `delegate` object may optionally contain `beforeDisplay`, `beforeSend`, `beforePostbackSend` and `onInvalidAuth` delegate functions.

Passing `delegate` as part of `init` options is the preferred method. The `setDelegate` method can be used to change or remove delegate behaviors after a conversation has been initialized.

A `data` object is passed down with all the delegate events except `onInvalidAuth`. This is a read-only object containing a truncated version of the conversation associated with the event.

`beforeSend` delegate will apply to the `formResponse` message sent when a [Prechat Capture](https://docs.smooch.io/guide/web-messenger/#prechat-capture) form is completed.

```javascript
const delegate = {
    beforeDisplay(message, data) {
        if (data.conversation.id === '<my-conversation-id>') {
            message.displayName = 'Acme Blank';
        }

        return message;
    },
    beforeSend(message, data) {
        return message;
    },
    beforePostbackSend(postback, data) {
        return postback;
    },
    onInvalidAuth() {
        return new Promise((resolve) => resolve('<my-new-auth-token>'));
    },
};

// Passing delegate as an init parameter
Smooch.init({
    integrationId: '<integration-id>',
    delegate,
});

// Using setDelegate
Smooch.init({ integrationId: '<integration-id>' }).then(() => {
    Smooch.setDelegate(delegate);
});

// Message object for beforeDisplay and beforeSend delegates

message = {
    id: '5f0cb8226a5b27e41834f8f8',
    displayName: 'username',
    role: 'user',
    userId: 'e70b153989345b0e178174b1',
    avatarUrl: 'https://imageurl.com/avatar.png',
    type: 'text',
    received: 1594669090.954,
    source: {
        type: 'web',
        id: 'e91e070a9c4e4eb7b73fb0a376b340c7',
        integrationId: '5d72af033fbb2c05c87d5d94',
    },
    metadata: {
        isHidden: true,
    },
};

// Data object
data = {
    conversation: {
        id: '<conversation-id>',
        lastUpdatedAt: 1581010017.596,
        type: 'sdkGroup',
        participants: [
            {
                id: '<participant-id>',
                userId: '<user-id>',
                unreadCount: 0,
                lastRead: 1581010017.596,
            },
        ],
        metadata: {},
    },
};
```

#### beforeDisplay

The `beforeDisplay` delegate allows a message to be hidden or modified before it is displayed in the conversation. This delegate should return a falsy value such as `null` to hide the message. It can also return a modified message object in order to change what the user will see rendered in their conversation history. Note that this change affects the client side rendering only; the server side copy of this message can not be modified by this delegate.

Learn more about filtering and transforming messages in [our guide](https://docs.smooch.io/guide/web-messenger#filtering-and-transforming-messages).

```javascript
Smooch.init({
    integrationId: '<integration-id>',
    delegate: {
        beforeDisplay(message, data) {
            if (data.conversation.id === '<conversation-id>' && message.metadata && message.metadata.isHidden) {
                return null;
            }

            return message;
        },
    },
});
```

#### beforeSend

The `beforeSend` delegate method allows you to modify properties of a message before sending it to Smooch.
The modified message must be returned for it to take effect.

A common usage of this method is to [add message metadata](https://docs.smooch.io/guide/using-metadata/#sdks-and-metadata).

Note that when a file or an image is uploaded, only the message `metadata` may be updated. Other message properties such as `type` or `text` won't be considered.

```javascript
Smooch.init({
    integrationId: '<integration-id>'
    delegate: {
        beforeSend(message, data) {
            if (data.conversation.id === '<conversation-id>') {
                message.metadata = {
                    any: 'info'
                };
            }

            return message;
        }
    }
});
```

#### beforePostbackSend

The `beforePostbackSend` delegate method allows you to modify properties of a postback before sending it to Smooch.
The modified postback must be returned for it to take effect.

A common usage of this method is to [add postback metadata](https://docs.smooch.io/guide/web-messenger#transforming-postback).

```javascript
Smooch.init({
    integrationId: '<integration-id>',
    delegate: {
        beforePostbackSend(postback, data) {
            if (data.conversation.id === '<conversation-id>') {
                postback.metadata = {
                    any: 'info',
                };
            }

            return postback;
        },
    },
});
```

#### onInvalidAuth

The `onInvalidAuth` delegate notifies the delegate of a failed request due to invalid credentials and allows the implementer to set a new auth token in order to retry the request. The delegate must return a new JWT token as a `string` or `Promise<string>` that will resolve into the JWT.

```javascript
Smooch.init({
    integrationId: '<integration-id>',
    delegate: {
        onInvalidAuth() {
            return '<my-new-auth-token>';
        },
    },
});
```

### Events

If you want to make sure your events are triggered, try to bind them before calling `Smooch.init`.

To bind an event, use `Smooch.on(<event name>, <handler>);`. To unbind events, you can either call `Smooch.off(<event name>, handler)` to remove one specific handler, call `Smooch.off(<event name>)` to remove all handlers for an event, or call `Smooch.off()` to unbind all handlers.

#### ready

```javascript
// This event triggers when init completes successfully... Be sure to bind before calling init!
Smooch.on('ready', function(){
    console.log('the init has completed!');
});

Smooch.init(...).then(function() {
    // init also returns a promise, so you can alternatively specify a .then() callback
});
```

#### destroy

```javascript
// This event triggers when the widget is destroyed.
Smooch.on('destroy', function () {
    console.log('the widget is destroyed!');
});

Smooch.destroy();
```

#### participant:added

```javascript
// This event triggers when a participant is added to a conversation
Smooch.on('participant:added', function (participant, data) {
    console.log(`A participant was added to conversation ${data.conversation.id}: `, participant);
});
```

#### participant:removed

```javascript
// This event triggers when a participant is removed from a conversation
Smooch.on('participant:removed', function (participant, data) {
    console.log(`A participant was removed from conversation ${data.conversation.id}: `, participant);
});
```

#### conversation:added

```javascript
// This event triggers when a conversation is added
Smooch.on('conversation:added', function (participants, data) {
    console.log(`Conversation ${data.conversation.id} was added with following participants: `, participants);
});
```

#### conversation:read

```javascript
// This event triggers when a participant in a sdkGroup chat reads a message
Smooch.on('conversation:read', function (payload, data) {
    if (payload.role === 'business') {
        console.log(`Conversation ${data.conversation.id} was read by the business`);
    } else if (payload.role === 'user') {
        console.log(`Conversation ${data.conversation.id} was read by userId: ${payload.userId}`);
    }
});

// Payload and data objects. If the conversation was read by the business, the userId property will not exist
payload = {
    userId: '<user-id>',
    lastRead: 1581010017.596,
    role: 'user',
};

data = {
    conversation: {
        id: '<conversation-id>',
    },
};
```

#### conversation:removed

```javascript
// This event triggers when a conversation is removed
Smooch.on('conversation:removed', function (data) {
    console.log(`Conversation ${data.conversation.id} was removed`);
});

// data object
data = {
    conversation: {
        id: '<conversation-id>',
    },
};
```

#### message:received

```javascript
// This event triggers when the user receives a message
Smooch.on('message:received', function (message, data) {
    console.log(`The user received a message in conversation ${data.conversation.id}: `, message);
});

// data object
data = {
    conversation: {
        id: '<conversation-id>',
    },
};
```

#### message:sent

```javascript
// This event triggers when the user sends a message
Smooch.on('message:sent', function (message, data) {
    console.log(`The user sent a message in conversation ${data.conversation.id}: `, message);
});

// data object
data = {
    conversation: {
        id: '<conversation-id>',
    },
};
```

#### message

```javascript
// This event triggers when a message was added to the conversation
Smooch.on('message', function (message, data) {
    console.log(`A message was added in the conversation ${data.conversation.id}: `, message);
});

// data object
data = {
    conversation: {
        id: '<conversation-id>',
    },
};
```

#### unreadCount

```javascript
// This event triggers when the number of unread messages changes
Smooch.on('unreadCount', function (unreadCount, data) {
    console.log(`the number of unread messages was updated for conversation ${data.conversation.id}:`, unreadCount);
});

// data object
data = {
    conversation: {
        id: '<conversation-id>',
    },
};
```

#### widget:opened

```javascript
// This event triggers when the widget is opened
Smooch.on('widget:opened', function () {
    console.log('Widget is opened!');
});
```

#### widget:closed

```javascript
// This event triggers when the widget is closed
Smooch.on('widget:closed', function () {
    console.log('Widget is closed!');
});
```

#### log:debug

```javascript
// This event triggers when the codes emits debug information
Smooch.on('log:debug', function (e) {
    console.log('Timestamp:', e.timestamp); // (Float) Date.now() when it was emitted
    console.log('Message:', e.message); // (String) Message being logged
    console.log('Data:', e.data); // (Object) Extra details to be logged
});
```

#### connected

```javascript
// This event triggers when an active connection has been established for the first time,
// or when the connection has been re-established after a `disconnected` or `reconnecting` event.
Smooch.on('connected', function (data) {
    console.log('Connected with conversation', data.conversation.id);
});
```

#### disconnected

```javascript
// This event triggers when an active connection is lost
// While disconnected, the client will not be able to receive messages or load a conversation
Smooch.on('disconnected', function (data) {
    console.log('Disconnected with conversation', data.conversation.id);
});

// data object
data = {
    conversation: {
        id: '<conversation-id>',
    },
};
```

#### reconnecting

```javascript
// This event triggers when an active connection is lost and there is an attempt to reconnect
// While reconnecting, the client will not be able to receive messages or load a conversation
Smooch.on('reconnecting', function (data) {
    console.log('Reconnecting with conversation', data.conversation.id);
});

// data object
data = {
    conversation: {
        id: '<conversation-id>',
    },
};
```

#### typing:start

```javascript
// This event triggers when the business starts typing. The associated conversation is passed in the argument.
Smooch.on('typing:start', function (data) {
    console.log(`${data.name} started typing!`, data.conversation.id);
});

// If the name and avatarUrl for the typing user is known it will be available as properties in the data object

// Data object
data = {
    conversation: {
        id: '<conversation-id>',
    },
    avatarUrl: 'http://path.com/to/avatar-url-of-user',
    name: 'Name of Typing User',
};
```

#### typing:stop

```javascript
// This event triggers when the business stops typing. The associated conversation is passed in the argument.
Smooch.on('typing:stop', function (data) {
    console.log(`${data.name} stopped typing!`, data.conversation.id);
});

// data object
data = {
    conversation: {
        id: '<conversation-id>',
    },
};
```

### Embedded mode

As describe above, to activate the embedded mode, you need to pass `embedded: true` when calling `Smooch.init`. By doing so, you are disabling the auto-rendering mechanism and you will need to call `Smooch.render` manually. This method accepts a DOM element which will be used as the container where the widget will be rendered.

```javascript
Smooch.init({
    integrationId: '<integration-id>',
    embedded: true,
}).then(() => {
    Smooch.render(document.getElementById('chat-container'));
});
```

The embedded widget will take full width and height of the container. You must give it a height, otherwise, the widget will collapse.

### Authenticating the user: init() vs login()

For [authenticated user scenarios](https://docs.smooch.io/guide/authenticating-users/), a user's credentials can be passed in to either `init()` or `login()`. The question remains: when should you use which?

When `init()` is called without an `externalId` and `jwt`, the UI will be initialized in an anonymous user context, and the user will be able to send messages as an anonymous user. After `init()` has completed, `login()` may be called to authenticate the user and resume any existing conversation. This is useful if you want your users to be able to send messages before they've logged in to your website. Once a user does login and the browser is issued a valid `jwt`, `login()` may be called so that the user may continue the conversation in an authenticated session. Note that this may trigger a [merge event](https://docs.smooch.io/guide/merging-users/#merging-because-of-a-login-event) if the anonymous user already exists in Sunshine Conversations at the time of calling `login()`.

If however your use case requires that all users be logged in before they may send messages, then you should consider passing `externalId` and `jwt` directly to the `init()` call upfront.

## Content Security Policy

If your deployment requires [CSP compatibility](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), add the following meta tag to your configuration.

```html
<meta
    http-equiv="Content-Security-Policy"
    content="
    connect-src
        wss://*.smooch.io
        https://*.smooch.io;
    font-src
        https://*.smooch.io;
    script-src
        https://*.smooch.io;
    style-src
        https://*.smooch.io;
    img-src
        blob:
        https://*.smooch.io;"
/>
```

Note that an equivalent configuration can be done [server side](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy).

According to the channels you use, other domains may need to be added (these are used to display QR codes to link the Web Messenger conversation):

-   LINE: https://qr-official.line.me
-   Stripe: https://*.stripe.com
-   WeChat: https://mp.weixin.qq.com
-   WhatsApp: https://wa.me

Note that your CSP configuration should also include any domains used to host images or files sent in messages.
If you require `blob:` to be excluded for `img-src`, you must disable the image upload feature via the [init settings](#initoptions).

## Acknowledgements

https://github.com/lipis/flag-icon-css
