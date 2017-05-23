import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import isMobile from 'ismobilejs';

import { updateTwilioAttributes, resetTwilioAttributes, linkTwilioChannel, unlinkTwilioChannel, pingTwilioChannel } from '../../services/integrations';
import { ReactTelephoneInput } from '../../lib/react-telephone-input';

export class TwilioChannelContentComponent extends Component {

    static propTypes = {
        linkColor: PropTypes.string,
        phoneNumber: PropTypes.string.isRequired,
        linkState: PropTypes.oneOf(['unlinked', 'pending', 'linked']),
        smoochId: PropTypes.string.isRequired,
        text: PropTypes.object.isRequired,
        channelState: PropTypes.object.isRequired
    };

    linkTwilioNumber = () => {
        const { dispatch, channelState:{appUserNumber} } = this.props;
        dispatch(linkTwilioChannel(this.props.smoochId, {
            type: 'twilio',
            phoneNumber: appUserNumber.replace(/[()\-\s]/g, '')
        }));
    }

    unlinkChannel = () => {
        const { dispatch } = this.props;
        dispatch(unlinkTwilioChannel(this.props.smoochId));
    }

    handleInputChange = (telNumber) => {
        const { dispatch } = this.props;
        dispatch(updateTwilioAttributes({
            appUserNumber: telNumber
        }));
    }

    onStartTexting = () => {
        const { dispatch } = this.props;
        dispatch(updateTwilioAttributes({
            linkState: 'linked'
        }));
    }

    onSendText = () => {
        const { dispatch } = this.props;
        dispatch(pingTwilioChannel(this.props.smoochId));
    }

    onNumberValid = () => {
        const { dispatch } = this.props;
        dispatch(updateTwilioAttributes({
            appUserNumberValid: true,
            hasError: false
        }));
    }

    onNumberInvalid = () => {
        const { dispatch } = this.props;
        dispatch(updateTwilioAttributes({
            appUserNumberValid: false
        }));
    }

    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(resetTwilioAttributes());
    }

    render() {
        const {phoneNumber, linkColor, text, channelState} = this.props;
        const {appUserNumber, appUserNumberValid, errorMessage, hasError, linkState} = channelState;
        const {smsInvalidNumberError, smsLinkPending, smsStartTexting, smsCancel, smsChangeNumber, smsSendText, smsContinue} = text;

        let iconStyle = {};
        if (linkColor) {
            iconStyle = {
                color: `#${linkColor}`
            };
        }

        const linkButton = appUserNumberValid ? <button className='btn btn-sk-primary'
                                                        onClick={ this.linkTwilioNumber }>
                                                    { smsContinue }
                                                </button> : '';

        const onEnterKeyPress = appUserNumberValid ? this.linkTwilioNumber : () => {
            // Do nothing on enter if the number is invalid
        };

        const invalidNumberMessage = appUserNumber && !appUserNumberValid ? smsInvalidNumberError : '';

        const warningMessage = invalidNumberMessage || hasError ? <div className='warning-message'>
                                                                      { invalidNumberMessage ? invalidNumberMessage : errorMessage }
                                                                  </div> : '';

        const unlinkedComponent = <div className='twilio-linking unlinked-state'>
                                      <ReactTelephoneInput ref={ (c) => this._telInput = c }
                                                           defaultCountry='us'
                                                           onChange={ this.handleInputChange }
                                                           onValid={ this.onNumberValid }
                                                           onInvalid={ this.onNumberInvalid }
                                                           preferredCountries={ ['us', 'ca'] }
                                                           onEnterKeyPress={ onEnterKeyPress }
                                                           onBlur={ this.handleInputBlur } />
                                      { warningMessage }
                                      { linkButton }
                                  </div>;

        const pendingComponent = <div className='twilio-linking pending-state'>
                                     <i className='fa fa-phone'
                                        style={ iconStyle }></i>
                                     <span className='phone-number'>{ appUserNumber } - { smsLinkPending }</span>
                                     <a onClick={ this.unlinkChannel }>
                                         { smsCancel }
                                     </a>
                                 </div>;

        const sendTextUrl = `sms://${phoneNumber}`;
        const linkStyle = {
            color: 'white'
        };
        const linkedComponentButton = isMobile.phone ? <a href={ sendTextUrl }
                                                          className='btn btn-sk-primary twilio-linking'
                                                          onClick={ this.onStartTexting }
                                                          style={ linkStyle }>
                                                           { smsStartTexting }
                                                       </a> :
            <button className='btn btn-sk-primary twilio-linking'
                    onClick={ this.onSendText }>
                { smsSendText }
            </button>;

        const linkedComponent = <div>
                                    <div className='twilio-linking linked-state'>
                                        <i className='fa fa-phone'
                                           style={ iconStyle }></i>
                                        <span className='phone-number'>{ appUserNumber }</span>
                                        <a onClick={ this.unlinkChannel }>
                                            { smsChangeNumber }
                                        </a>
                                    </div>
                                    { linkedComponentButton }
                                </div>;
        if (linkState === 'pending') {
            return pendingComponent;
        } else if (linkState === 'linked') {
            return linkedComponent;
        } else {
            return unlinkedComponent;
        }
    }
}

export const TwilioChannelContent = connect(({app, ui: {text}}) => {
    return {
        linkColor: app.settings.web.linkColor,
        text: {
            smsInvalidNumberError: text.smsInvalidNumberError,
            smsLinkPending: text.smsLinkPending,
            smsStartTexting: text.smsStartTexting,
            smsCancel: text.smsCancel,
            smsChangeNumber: text.smsChangeNumber,
            smsSendText: text.smsSendText,
            smsContinue: text.smsContinue
        }
    };
})(TwilioChannelContentComponent);
