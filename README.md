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

## Usage

### Script Tag

Add the following code towards the end of the `head` section on your page and replace `<integration-id>` with your integration id at the end of the script.

<!-- prettier-ignore -->
```html
<script>
    !function(e,n,t,r){
        function o(){try{var e;if((e="string"==typeof this.response?JSON.parse(this.response):this.response).url){var t=n.getElementsByTagName("script")[0],r=n.createElement("script");r.async=!0,r.src=e.url,t.parentNode.insertBefore(r,t)}}catch(e){}}var s,p,a,i=[],c=[];e[t]={init:function(){s=arguments;var e={then:function(n){return c.push({type:"t",next:n}),e},catch:function(n){return c.push({type:"c",next:n}),e}};return e},on:function(){i.push(arguments)},render:function(){p=arguments},destroy:function(){a=arguments}},e.__onWebMessengerHostReady__=function(n){if(delete e.__onWebMessengerHostReady__,e[t]=n,s)for(var r=n.init.apply(n,s),o=0;o<c.length;o++){var u=c[o];r="t"===u.type?r.then(u.next):r.catch(u.next)}p&&n.render.apply(n,p),a&&n.destroy.apply(n,a);for(o=0;o<i.length;o++)n.on.apply(n,i[o])};var u=new XMLHttpRequest;u.addEventListener("load",o),u.open("GET","https://"+r+".webloader.smooch.io/",!0),u.responseType="json",u.send()
    }(window,document,"Smooch","<integration-id>");
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
| appId                            | Yes       | -                             | Your app id (deprecated in favour of `integrationId`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| integrationId                    | No        | -                             | Your integration id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| userId                           | Yes       | -                             | Optional. User's id, which can be passed in `init()` as an alternative to `login()` (see [below](#authenticating-the-user-init-vs-login))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| jwt                              | Yes       | -                             | Optional. User's authentication token, which can be passed in `init()` as an alternative to `login()` (see [below](#authenticating-the-user-init-vs-login))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| authCode                         | Yes       | -                             | An auth code for linking to an existing conversation (see more details [here](https://docs.smooch.io/rest/#get-auth-code))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| locale                           | Yes       | `en-US`                       | Locale used for date formatting using the `<language>-<COUNTRY>` format. Language codes can be found [here](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) and country codes [here](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2). <br /> **Note 1 : ** The country part is optional, and if a country is either not recognized or supported, it will fallback to using the generic language. If the language isn't supported, it will fallback to `en-US`. <br /> **Note 2:** this is _only_ used for date formatting and doesn't provide built-in translations for Web Messenger. Refer to the [documentation](https://docs.smooch.io/guide/web-messenger/#strings-customization) for how to handle translations. |
| soundNotificationEnabled         | Yes       | `true`                        | Enables the sound notification for new messages                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| imageUploadEnabled               | Yes       | `true`                        | Enables the image upload feature. (deprecated: use menuItems.imageUpload; if this option is `false`, it will disable `menuItems.imageUpload` and `menuItems.fileUpload`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| fixedIntroPane                   | Yes       | `false`                       | When enabled, the introduction pane will be pinned at the top of the conversation instead of scrolling with it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
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

##### `customColors`

| Option            | Optional? | Default value | Description                                                                                                                           |
| ----------------- | --------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| brandColor        | Yes       | `65758e`      | This color will be used in the messenger header and the button or tab in idle state. Must be a 3 or 6-character hexadecimal color.    |
| conversationColor | Yes       | `0099ff`      | This color will be used for customer messages, quick replies and actions in the footer. Must be a 3 or 6-character hexadecimal color. |
| actionColor       | Yes       | `0099ff`      | This color will be used for call-to-actions inside your messages. Must be a 3 or 6-character hexadecimal color.                       |

##### `customText`

The list of localizable strings. These strings can be modified. _If an option is not given a custom string, the default value will be used._

| Option                                   | Default value                                                                                                                                                                                                        |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| actionPaymentCompleted                   | Payment Completed                                                                                                                                                                                                    |
| actionPaymentError                       | An error occurred while processing the card. `<br>` Please try again or use a different card.                                                                                                                        |
| actionPostbackError                      | An error occurred while processing your action. Please try again.                                                                                                                                                    |
| clickToRetry                             | Message not delivered. Click to retry.                                                                                                                                                                               |
| clickToRetryForm                         | Form not submitted. Click anywhere on the form to retry.                                                                                                                                                             |
| connectNotificationText                  | Give us a way to reach out:                                                                                                                                                                                          |
| connectNotificationSingleText            | Be notified when you get a reply.                                                                                                                                                                                    |
| connectNotificationSingleButtonText      | Turn on `<name>` notifications                                                                                                                                                                                       |
| connectNotificationOthersText            | others                                                                                                                                                                                                               |
| conversationTimestampHeaderFormat        | MMMM D YYYY, h:mm A                                                                                                                                                                                                  |
| couldNotConnect                          | Couldn't connect. You can {retry}.                                                                                                                                                                                   |
| couldNotConnectInner                     | retry connecting now                                                                                                                                                                                                 |
| couldNotConnectWithRetry                 | Couldn't connect. We'll keep retrying, or you can {retry}.                                                                                                                                                           |
| couldNotConnectWithRetryInner            | try now                                                                                                                                                                                                              |
| emailChangeAddress                       | Change my email                                                                                                                                                                                                      |
| emailDescription                         | To be notified by email when you get a reply, enter your email address.                                                                                                                                              |
| emailFieldLabel                          | Your email                                                                                                                                                                                                           |
| emailFieldPlaceholder                    | Your email address                                                                                                                                                                                                   |
| emailFormButton                          | Continue                                                                                                                                                                                                             |
| fetchHistory                             | Load more                                                                                                                                                                                                            |
| fetchingHistory                          | Retrieving history...                                                                                                                                                                                                |
| fileTooLargeError                        | Max file size limit exceeded ({size})                                                                                                                                                                                |
| fileTypeError                            | Unsupported file type.                                                                                                                                                                                               |
| formErrorInvalidEmail                    | Email is invalid                                                                                                                                                                                                     |
| formErrorNoLongerThan                    | Must contain no more than ({characters}) characters                                                                                                                                                                  |
| formErrorNoShorterThan                   | Must contain at least ({characters}) characters                                                                                                                                                                      |
| formErrorUnknown                         | This doesn't look quite right                                                                                                                                                                                        |
| formFieldSelectPlaceholderFallback       | Choose one...                                                                                                                                                                                                        |
| frontendEmailChannelDescription          | To talk to us using email just send a message to our email address and we\'ll reply shortly:                                                                                                                         |
| headerText                               | How can we help?                                                                                                                                                                                                     |
| imageClickToReload                       | Click to reload image.                                                                                                                                                                                               |
| imageClickToView                         | Click to view {size} image.                                                                                                                                                                                          |
| imagePreviewNotAvailable                 | Preview not available.                                                                                                                                                                                               |
| inputPlaceholder                         | Type a message...                                                                                                                                                                                                    |
| inputPlaceholderBlocked                  | Complete the form above...                                                                                                                                                                                           |
| introAppText                             | Message us below or from your favorite app.                                                                                                                                                                          |
| introductionText                         | We\'re here to talk, so ask us anything!                                                                                                                                                                             |
| lineChannelDescription                   | To talk to us using LINE, scan this QR code using the LINE app and send us a message.                                                                                                                                |
| linkError                                | An error occurred when attempting to generate a link for this channel. Please try again.                                                                                                                             |
| locationNotSupported                     | Your browser does not support location services or it’s been disabled. Please type your location instead.                                                                                                            |
| locationSecurityRestriction              | This website cannot access your location. Please type your location instead.                                                                                                                                         |
| locationSendingFailed                    | Could not send location                                                                                                                                                                                              |
| locationServicesDenied                   | This website cannot access your location. Allow access in your settings or type your location instead.                                                                                                               |
| messageError                             | An error occured while sending your message. Please try again.                                                                                                                                                       |
| messageIndicatorTitlePlural              | (`{count}`) New messages                                                                                                                                                                                             |
| messageIndicatorTitleSingular            | (`{count}`) New message                                                                                                                                                                                              |
| messageRelativeTimeDay                   | `{value}`d ago                                                                                                                                                                                                       |
| messageRelativeTimeHour                  | `{value}`h ago                                                                                                                                                                                                       |
| messageRelativeTimeJustNow               | Just now                                                                                                                                                                                                             |
| messageRelativeTimeMinute                | `{value}`m ago                                                                                                                                                                                                       |
| messageTimestampFormat                   | h:mm A                                                                                                                                                                                                               |
| messageSending                           | Sending...                                                                                                                                                                                                           |
| messageDelivered                         | Delivered                                                                                                                                                                                                            |
| messengerChannelDescription              | Connect your Facebook Messenger account to be notified when you get a reply and continue the conversation on Facebook Messenger.                                                                                     |
| notificationSettingsChannelsDescription  | You can also talk to us from your favorite app or service.                                                                                                                                                           |
| notificationSettingsChannelsTitle        | Other Channels                                                                                                                                                                                                       |
| notificationSettingsConnected            | Connected                                                                                                                                                                                                            |
| notificationSettingsConnectedAs          | Connected as `{username}`                                                                                                                                                                                            |
| prechatCaptureGreetingText               | Hi there 👋\nTo start off, we\'d like to know a little bit more about you:                                                                                                                                           |
| prechatCaptureNameLabel                  | Your name                                                                                                                                                                                                            |
| prechatCaptureNamePlaceholder            | Type your name...                                                                                                                                                                                                    |
| prechatCaptureEmailLabel                 | Email                                                                                                                                                                                                                |
| prechatCaptureEmailPlaceholder           | name@company.com                                                                                                                                                                                                     |
| prechatCaptureConfirmationText           | Thanks for that! What can we help you with?                                                                                                                                                                          |
| prechatCaptureMailgunLinkingConfirmation | You\'ll be notified here and by email at {email} once we reply.                                                                                                                                                      |
| sendButtonText                           | Send                                                                                                                                                                                                                 |
| settingsHeaderText                       | Settings                                                                                                                                                                                                             |
| shareLocation                            | Share location                                                                                                                                                                                                       |
| smsBadRequestError                       | We were unable to communicate with this number. Try again or use a different one.                                                                                                                                    |
| smsCancel                                | Cancel                                                                                                                                                                                                               |
| smsChangeNumber                          | Change my number                                                                                                                                                                                                     |
| smsChannelDescription                    | Connect your SMS number to be notified when you get a reply and continue the conversation over SMS.                                                                                                                  |
| smsChannelPendingDescription             | Check your messages at `{number}` to confirm your phone number.                                                                                                                                                      |
| smsContinue                              | Continue                                                                                                                                                                                                             |
| smsInvalidNumberError                    | Your phone number isn\'t valid. Please try again.                                                                                                                                                                    |
| smsLinkCancelled                         | Link to `{appUserNumber}` was cancelled.                                                                                                                                                                             |
| smsLinkPending                           | Pending                                                                                                                                                                                                              |
| smsPingChannelError                      | There was an error sending a message to your number.                                                                                                                                                                 |
| smsSendText                              | Send me a text                                                                                                                                                                                                       |
| smsStartTexting                          | Start Texting                                                                                                                                                                                                        |
| smsTooManyRequestsError                  | A connection for that number was requested recently. Please try again in {minutes} minutes.                                                                                                                          |
| smsTooManyRequestsOneMinuteError         | A connection for that number was requested recently. Please try again in 1 minute.                                                                                                                                   |
| smsUnhandledError                        | Something went wrong. Please try again.                                                                                                                                                                              |
| tapToRetry                               | Message not delivered. Tap to retry.                                                                                                                                                                                 |
| tapToRetryForm                           | Form not submitted. Tap anywhere on the form to retry.                                                                                                                                                               |
| telegramChannelDescription               | Connect your Telegram account to be notified when you get a reply and continue the conversation on Telegram                                                                                                          |
| unsupportedMessageType                   | Unsupported message type.                                                                                                                                                                                            |
| unsupportedActionType                    | Unsupported action type.                                                                                                                                                                                             |
| uploadDocument                           | Upload document.                                                                                                                                                                                                     |
| uploadInvalidError                       | Invalid file.                                                                                                                                                                                                        |
| uploadPhoto                              | Upload photo.                                                                                                                                                                                                        |
| uploadVirusError                         | A virus was detected in your file and it has been rejected                                                                                                                                                           |
| viberChannelDescription                  | Connect your Viber account to be notified when you get a reply and continue the conversation on Viber. To get started, scan the QR code using the Viber app.                                                         |
| viberChannelDescriptionMobile            | Connect your Viber account to be notified when you get a reply and continue the conversation on Viber. To get started, install the Viber app and tap Connect.                                                        |
| viberQRCodeError                         | An error occurred while fetching your Viber QR code. Please try again.                                                                                                                                               |
| wechatChannelDescription                 | Connect your WeChat account to be notified when you get a reply and continue the conversation on WeChat. To get started, scan this QR code using the WeChat app.                                                     |
| wechatChannelDescriptionMobile           | Connect your WeChat account to be notified when you get a reply and continue the conversation on WeChat. To get started, save this QR code image and upload it `<a href=\'weixin://dl/scan\'>`QR code scanner`</a>`. |
| wechatQRCodeError                        | An error occurred while fetching your WeChat QR code. Please try again.                                                                                                                                              |
| whatsappChannelDescriptionDesktop        | Sync your account to WhatsApp by scanning the QR code or clicking the link below.\nThen, send the pre-populated message to validate the sync request. (Your code: {{code}}).                                         |
| whatsappChannelDescriptionMobile         | Sync your account to WhatsApp by clicking the link below.\nThen, send the pre-populated message to validate the sync request. (Your code: {{code}}).                                                                 |
| whatsappLinkingError                     | An error occurred while fetching your WhatsApp linking information. Please try again.                                                                                                                                |

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
| enabled            | Yes       | `false`       | Enables the prechat capture experience.                                                                                                                                           |
| enableEmailLinking | Yes       | `true`        | Automatically links the user's email to the app's Mailgun integration if it exists. If the property `fields` is defined, the first field of type `email` will be used.            |
| fields             | Yes       | -             | Overrides the default Prechat Capture [fields](https://docs.smooch.io/rest/#field) to define a [custom form](https://docs.smooch.io/guide/web-messenger/#custom-prechat-capture). |

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
    userId: 'user_id',
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

    fixedIntroPane: false,

    prechatCapture: {
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
        connectNotificationText: 'Give us a way to reach out:',
        connectNotificationSingleText: 'Be notified when you get a reply.',
        connectNotificationSingleButtonText: 'Turn on <name> notifications',
        connectNotificationOthersText: 'others',
        conversationTimestampHeaderFormat: 'MMMM D YYYY, h:mm A',
        couldNotConnect: "Couldn't connect. You can {retry}. ",
        couldNotConnectInner: 'retry connecting now',
        couldNotConnectWithRetry: "Couldn't connect. We'll keep retrying, or you can {retry}.",
        couldNotConnectWithRetryInner: 'try now',
        emailChangeAddress: 'Change my email',
        emailDescription: 'To be notified by email when you get a reply, enter your email address.',
        emailFieldLabel: 'Your email',
        emailFieldPlaceholder: 'Your email address',
        emailFormButton: 'Continue',
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
        introductionText: "We're here to talk, so ask us anything!",
        lineChannelDescription: 'To talk to us using LINE, scan this QR code using the LINE app and send us a message.',
        linkError: 'An error occurred when attempting to generate a link for this channel. Please try again.',
        locationNotSupported:
            'Your browser does not support location services or it’s been disabled. Please type your location instead.',
        locationSecurityRestriction: 'This website cannot access your location. Please type your location instead.',
        locationSendingFailed: 'Could not send location',
        locationServicesDenied:
            'This website cannot access your location. Allow access in your settings or type your location instead.',
        messageError: 'An error occured while sending your message. Please try again.',
        messageIndicatorTitlePlural: '({count}) New messages',
        messageIndicatorTitleSingular: '({count}) New message',
        messageRelativeTimeDay: '{value}d ago',
        messageRelativeTimeHour: '{value}h ago',
        messageRelativeTimeJustNow: 'Just now',
        messageRelativeTimeMinute: '{value}m ago',
        messageTimestampFormat: 'h:mm A',
        messageSending: 'Sending...',
        messageDelivered: 'Delivered',
        messengerChannelDescription:
            'Connect your Facebook Messenger account to be notified when you get a reply and continue the conversation on Facebook Messenger.',
        notificationSettingsChannelsDescription: 'You can also talk to us from your favorite app or service.',
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
        shareLocation: 'Share location',
        smsBadRequestError: 'We were unable to communicate with this number. Try again or use a different one.',
        smsCancel: 'Cancel',
        smsChangeNumber: 'Change my number',
        smsChannelDescription:
            'Connect your SMS number to be notified when you get a reply and continue the conversation over SMS.',
        smsChannelPendingDescription: 'Check your messages at {number} to confirm your phone number.',
        smsContinue: 'Continue',
        smsInvalidNumberError: "Your phone number isn't valid. Please try again.",
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
        tapToRetry: 'Message not delivered. Tap to retry.',
        tapToRetryForm: 'Form not submitted. Tap anywhere on the form to retry.',
        telegramChannelDescription:
            'Connect your Telegram account to be notified when you get a reply and continue the conversation on Telegram',
        unsupportedMessageType: 'Unsupported message type.',
        unsupportedActionType: 'Unsupported action type.',
        uploadDocument: 'Upload document',
        uploadInvalidError: 'Invalid file',
        uploadPhoto: 'Upload photo',
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

#### login(userId , jwt)

Logs a user in the Web Messenger, retrieving the conversation the user already had on other browsers and/or devices. Note that you don't need to call this after `init` if you passed the user id and jwt already, it's done internally. This returns a promise that resolves when the Web Messenger is ready again.

```javascript
Smooch.login('some-id', 'some-jwt');
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

Sends a message on the user's behalf. An optional `conversationdId` argument can be provided to target a specific conversation, otherwise the currently loaded conversation will be targeted.

```javascript
Smooch.sendMessage({
    type: 'text',
    text: 'hello',
});

// OR

Smooch.sendMessage('hello');

// OR

Smooch.sendMessage('hello', '<conversation-id>');
```

#### startTyping(conversationId)

Sends an event indicating the appUser has started typing. When called, a `stopTyping` timer will be created and will call `stopTyping()` after 10s, unless `stopTyping()` has been called manually. Everytime `startTyping()` is called the timer is reset. If `startTyping()` is called repeatedly, an event will only be sent if the time since the last sent event is greater then 10s.

If **conversationId** is not provided, the currently loaded conversation will be used.

```javascript
Smooch.startTyping();

// OR

Smooch.startTyping('<conversation-id>');
```

#### stopTyping(conversationId)

Sends an event indicating the appUser has stoped typing.

If **conversationId** is not provided, the currently loaded conversation will be used.

```javascript
Smooch.stopTyping();

// OR

Smooch.stopTyping('<conversation-id>');
```

#### triggerPostback(actionId, conversationId)

Trigger a [postback](https://docs.smooch.io/rest/#postback) action on the user's behalf. An optional `conversationdId` argument can be provided to target a specific conversation, otherwise the currently loaded conversation will be targeted.

The `actionId` is the `_id` property of the targeted action.

If you have the `_id` of the targetted `postback` action, you can pass it directly to `triggerPostback`.

If **conversationId** is not provided, the currently loaded conversation will be used.

```javascript
const actionId = '5a747faa065bbe4e7804f2a4';
Smooch.triggerPostback(actionId);

// OR

const actionId = '5a747faa065bbe4e7804f2a4';
Smooch.triggerPostback(actionId, '62565b5c2b4039adff80b7fd');
```

Otherwise, you can get the `_id` of an action by using `Smooch.getConversationById()`, e.g.

```javascript
Smooch.getConversationById().then((conversation) => console.log(conversation.messages));

// [
//     {
//         "text": "Do you want to continue?",
//         "actions": [
//             {
//                 "payload": "text:continue",
//                 "text": "Continue conversation",
//                 "_id": "5a7c65211aaa9b61f69c95e3",
//                 "type": "postback"
//             }
//         ],
//         "type": "text",
//         "role": "appMaker",
//         "_id": "5a7c65211aaa9b61f69c95e2",
//         // ...
//     }
// ]

// Indicate to Smooch that the user has clicked on the "Continue conversation" postback action.
Smooch.triggerPostback(conversation.messages[0].actions[0]._id);
```

#### updateUser(user)

Updates user information

```javascript
Smooch.updateUser({
    givenName: 'Updated',
    surname: 'Name',
    email: 'updated@email.com',
    properties: {
        justGotUpdated: true,
    },
});
```

#### getUser()

Returns the current user.

```javascript
var user = Smooch.getUser();
```

#### getConversationById(conversationId)

Returns a `Promise<object>` whose payload is a conversation if it exists.
if **conversationId** is not given, the current loaded conversation will be returned.

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
    _id: '<conversation-id>',
    unreadCount: 0,
    lastUpdatedAt: 1581010017.596,
    type: 'sdkGroup',
    participants: [
        {
            _id: '<participant-id>',
            appUserId: '<appUser-id>',
            unreadCount: 0,
            lastRead: 1581010017.596,
        },
    ],
    metadata: {},
    messages: [
        {
            role: 'appUser',
            authorId: '6ac41c8b32e704f3cdb9052d',
            name: 'Some user',
            _id: '5e6022c9cb55158bfd53f845',
            type: 'text',
            received: 1583358665.139,
            text: 'Hello',
            source: {
                type: 'web',
                id: 'c38ae913af7c4ef3800b339ee529c579',
                integrationId: '5d8274d4aa780a5483f0ee56',
            },
        },
    ],
};
```

#### getConversations(offset)

Returns a list of up to 10 conversations for the current user. An optional `offset` argument can be specified for paging purposes. This method is asynchronous. Note that the `messages` property in each conversation may only have the most recent message in the conversation.

See [Smooch.getConversationById](#getconversationbyidconversationid) for the definition of a conversation

```javascript
Smooch.getConversations(5).then((conversations) => {
    // Your code after receiving the current user's conversations
});
```

#### getConversation()

Returns the active conversation if it exists

See [Smooch.getConversationById](#getconversationbyidconversationid) for the conversation definition

```javascript
var conversation = Smooch.getConversation();
```

#### loadConversation(conversationId)

Loads a conversation into the current session

```javascript
Smooch.loadConversation('<conversation-id>');
```

#### startConversation()

Creates a user and conversation on the server, allowing the business to reach out proactively to the user via the public API.

Creating a conversation via this method will count as an active user conversation (AUC) whether messages are exchanged or not, which may incur cost based on your plan. It is strongly recommended to only call this method in the case where a message is likely to be sent.

This method is called automatically when starting a conversation via the `sendMessage` method, or when a user sends a message via the conversation view.

If a conversation already exists for the current user, this call is a no-op.

```javascript
Smooch.startConversation();
```

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

```javascript
const delegate = {
    beforeDisplay(message, data) {
        if (data.conversation._id === '<my-conversation-id>') {
            message.name = 'Acme Blank';
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

// Data object
data = {
    conversation: {
        _id: '<conversation-id>',
        unreadCount: 0,
        lastUpdatedAt: 1581010017.596,
        type: 'sdkGroup',
        participants: [
            {
                _id: '<participant-id>',
                appUserId: '<appUser-id>',
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
            if (data.conversation._id === '<conversation-id>' && message.metadata && message.metadata.isHidden) {
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
            if (data.conversation._id === '<conversation-id>') {
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
            if (data.conversation._id === '<conversation-id>') {
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
    console.log(`A participant was added to conversation ${data.conversation._id}: `, participant);
});
```

#### participant:removed

```javascript
// This event triggers when a participant is removed from a conversation
Smooch.on('participant:removed', function (participant, data) {
    console.log(`A participant was removed from conversation ${data.conversation._id}: `, participant);
});
```

#### conversation:added

```javascript
// This event triggers when a conversation is added
Smooch.on('conversation:added', function (participants, data) {
    console.log(`Conversation ${data.conversation._id} was added with following participants: `, participants);
});
```

#### conversation:read

```javascript
// This event triggers when a participant in a sdkGroup chat reads a message
Smooch.on('conversation:read', function (payload, data) {
    if (data.role === 'appMaker') {
        console.log(`Conversation ${data.conversation._id} was read by appMaker`);
    } else if (data.role === 'appUser') {
        console.log(`Conversation ${data.conversation._id} was read by appUserId: ${payload.appUserId}`);
    }
});

// Data object, if the conversation was read by the appMaker, the appUser property will not exist
payload = {
    appUserId: '<appUser-id>',
    lastRead: 1581010017.596,
    role: 'appUser',
};

data = {
    conversation: {
        _id: '<conversation-id>',
    },
};
```

#### conversation:removed

```javascript
// This event triggers when a conversation is removed
Smooch.on('conversation:removed', function (data) {
    console.log(`Conversation ${data.conversation._id} was removed`);
});

// data object
data = {
    conversation: {
        _id: '<conversation-id>',
    },
};
```

#### message:received

```javascript
// This event triggers when the user receives a message
Smooch.on('message:received', function (message, data) {
    console.log(`The user received a message in conversation ${data.conversation._id}: `, message);
});

// data object
data = {
    conversation: {
        _id: '<conversation-id>',
    },
};
```

#### message:sent

```javascript
// This event triggers when the user sends a message
Smooch.on('message:sent', function (message, data) {
    console.log(`The user sent a message in conversation ${data.conversation._id}: `, message);
});

// data object
data = {
    conversation: {
        _id: '<conversation-id>',
    },
};
```

#### message

```javascript
// This event triggers when a message was added to the conversation
Smooch.on('message', function (message, data) {
    console.log(`A message was added in the conversation ${data.conversation._id}: `, message);
});

// data object
data = {
    conversation: {
        _id: '<conversation-id>',
    },
};
```

#### unreadCount

```javascript
// This event triggers when the number of unread messages changes
Smooch.on('unreadCount', function (unreadCount, data) {
    console.log(`the number of unread messages was updated for conversation ${data.conversation._id}:`, unreadCount);
});

// data object
data = {
    conversation: {
        _id: '<conversation-id>',
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
// or when the connection has been re-established after a `disconnect` event.
Smooch.on('connected', function (data) {
    console.log('Connected with conversation', data.conversation._id);
});
```

#### disconnected

```javascript
// This event triggers when an active connection is lost
// While disconnected, the client will not be able to recieve messages
Smooch.on('disconnected', function (data) {
    console.log('Disconnected with conversation', data.conversation._id);
});

// data object
data = {
    conversation: {
        _id: '<conversation-id>',
    },
};
```

#### typing:start

```javascript
// This event triggers when appMaker starts typing. The associated conversation is passed in the argument.
Smooch.on('typing:start', function (data) {
    console.log(`${data.name} started typing!`, data.conversation._id);
});

// If the name and avatarUrl for the typing user is known it will be available as properties in the data object

// Data object
data = {
    conversation: {
        _id: '<conversation-id>',
    },
    avatarUrl: 'http://path.com/to/avatar-url-of-user',
    name: 'Name of Typing User',
};
```

#### typing:stop

```javascript
// This event triggers when appMaker stops typing. The associated conversation is passed in the argument.
Smooch.on('typing:stop', function (data) {
    console.log(`${data.name} stopped typing!`, data.conversation._id);
});

// data object
data = {
    conversation: {
        _id: '<conversation-id>',
    },
};
```

### Embedded mode

As describe above, to activate the embedded mode, you need to pass `embedded: true` when calling `Smooch.init`. By doing so, you are disabling the auto-rendering mechanism and you will need to call `Smooch.render` manually. This method accepts a DOM element which will be used as the container where the widget will be rendered.

```javascript
Smooch.init({
    integrationId: '<integration-id>',
    embedded: true,
});

Smooch.render(document.getElementById('chat-container'));
```

The embedded widget will take full width and height of the container. You must give it a height, otherwise, the widget will collapse.

### Authenticating the user: init() vs login()

For [authenticated user scenarios](https://docs.smooch.io/guide/authenticating-users/), a user's credentials can be passed in to either `init()` or `login()`. The question remains: when should you use which?

When `init()` is called without a `userId` and `jwt`, the UI will be initialized in an anonymous user context, and the user will be able to send messages as an anonymous user. After `init()` has completed, `login()` may be called to authenticate the user and resume any existing conversation. This is useful if you want your users to be able to send messages before they've logged in to your website. Once a user does login and the browser is issued a valid `jwt`, `login()` may be called so that the user may continue the conversation in an authenticated session.

If however your use case requires that all users be logged in before they may send messages, then you should consider passing `userId` and `jwt` directly to the `init()` call upfront.

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
-   WeChat: https://mp.weixin.qq.com

Note that your CSP configuration should also include any domains used to host images or files sent in messages.
If you require `blob:` to be excluded for `img-src`, you must disable the image upload feature via the [init settings](#initoptions).

## Acknowledgements

https://github.com/lipis/flag-icon-css
