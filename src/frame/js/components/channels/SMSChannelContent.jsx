import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isMobile from 'ismobilejs';

import { updateSMSAttributes, resetSMSAttributes, linkSMSChannel, unlinkSMSChannel, pingSMSChannel } from '../../actions/integrations';
import { ReactTelephoneInput } from '../../lib/react-telephone-input';

export class SMSChannelContentComponent extends Component {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        linkColor: PropTypes.string,
        phoneNumber: PropTypes.string,
        originator: PropTypes.string,
        linkState: PropTypes.oneOf(['unlinked', 'pending', 'linked']),
        smoochId: PropTypes.string.isRequired,
        text: PropTypes.object.isRequired,
        channelState: PropTypes.object.isRequired,
        type: PropTypes.oneOf(['twilio', 'messagebird'])
    };

    linkPhoneNumber = () => {
        const {dispatch, channelState:{appUserNumber}, type} = this.props;
        dispatch(linkSMSChannel(this.props.smoochId, {
            type,
            phoneNumber: appUserNumber.replace(/[()\-\s]/g, '')
        }));
    }

    unlinkChannel = () => {
        const {dispatch, type} = this.props;
        dispatch(unlinkSMSChannel(this.props.smoochId, type));
    }

    handleInputChange = (telNumber) => {
        const {dispatch, type} = this.props;
        dispatch(updateSMSAttributes({
            appUserNumber: telNumber
        }, type));
    }

    onStartTexting = () => {
        const {dispatch, type} = this.props;
        dispatch(updateSMSAttributes({
            linkState: 'linked'
        }, type));
    }

    onSendText = () => {
        const {dispatch, type} = this.props;
        dispatch(pingSMSChannel(this.props.smoochId, type));
    }

    onNumberValid = () => {
        const {dispatch, type} = this.props;
        dispatch(updateSMSAttributes({
            appUserNumberValid: true,
            hasError: false
        }, type));
    }

    onNumberInvalid = () => {
        const {dispatch, type} = this.props;
        dispatch(updateSMSAttributes({
            appUserNumberValid: false
        }, type));
    }

    componentWillUnmount() {
        const {dispatch, type} = this.props;
        dispatch(resetSMSAttributes(type));
    }

    render() {
        const {originator, phoneNumber, linkColor, text, channelState} = this.props;
        const {appUserNumber, appUserNumberValid, errorMessage, hasError, linkState} = channelState;
        const {smsInvalidNumberError, smsLinkPending, smsStartTexting, smsCancel, smsChangeNumber, smsSendText, smsContinue} = text;

        let iconStyle = {};
        if (linkColor) {
            iconStyle = {
                color: `#${linkColor}`
            };
        }

        const linkButton = appUserNumberValid ? <button className='btn btn-sk-primary'
                                                        onClick={ this.linkPhoneNumber }>
                                                    { smsContinue }
                                                </button> : '';

        const onEnterKeyPress = appUserNumberValid ? this.linkPhoneNumber : () => {
            // Do nothing on enter if the number is invalid
        };

        const invalidNumberMessage = appUserNumber && !appUserNumberValid ? smsInvalidNumberError : '';

        const warningMessage = invalidNumberMessage || hasError ? <div className='warning-message'>
                                                                      { invalidNumberMessage ? invalidNumberMessage : errorMessage }
                                                                  </div> : '';

        const unlinkedComponent = <div className='sms-linking unlinked-state'>
                                      <ReactTelephoneInput ref={ (c) => this._telInput = c }
                                                           defaultCountry='us'
                                                           isValid={ false }
                                                           onChange={ this.handleInputChange }
                                                           onValid={ this.onNumberValid }
                                                           onInvalid={ this.onNumberInvalid }
                                                           preferredCountries={ ['us', 'ca'] }
                                                           onEnterKeyPress={ onEnterKeyPress }
                                                           onBlur={ this.handleInputBlur } />
                                      { warningMessage }
                                      { linkButton }
                                  </div>;

        const pendingComponent = <div className='sms-linking pending-state'>
                                     <i className='fa fa-phone'
                                        style={ iconStyle }></i>
                                     <span className='phone-number'>{ appUserNumber } - { smsLinkPending }</span>
                                     <a onClick={ this.unlinkChannel }>
                                         { smsCancel }
                                     </a>
                                 </div>;

        const sendTextUrl = `sms://${phoneNumber || originator}`;
        const linkStyle = {
            color: 'white'
        };
        const linkedComponentButton = isMobile.phone ? <a href={ sendTextUrl }
                                                          className='btn btn-sk-primary sms-linking'
                                                          onClick={ this.onStartTexting }
                                                          style={ linkStyle }>
                                                           { smsStartTexting }
                                                       </a> :
            <button className='btn btn-sk-primary sms-linking'
                    onClick={ this.onSendText }>
                { smsSendText }
            </button>;

        const linkedComponent = <div>
                                    <div className='sms-linking linked-state'>
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

export default connect(({config, ui: {text}}) => {
    return {
        linkColor: config.style.linkColor,
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
})(SMSChannelContentComponent);
