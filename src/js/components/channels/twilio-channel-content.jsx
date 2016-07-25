import React, { Component } from 'react';
import { updateTwilioAttributes, resetTwilioAttributes } from '../../services/integrations-service';

import { ReactTelephoneInput } from '../../lib/react-telephone-input';

import { connect } from 'react-redux';
import isMobile from 'ismobilejs';

export class TwilioChannelContentComponent extends Component {

    linkTwilioNumber = () => {
        updateTwilioAttributes({
            number: this.props.number,
            linkState: 'pending'
        });
    }

    onRetry = () => {
        updateTwilioAttributes({
            linkState: 'unlinked'
        });
    }

    handleInputChange = (telNumber) => {
        updateTwilioAttributes({
            number: telNumber
        });
    }

    onChangeNumber = () => {
        updateTwilioAttributes({
            linkState: 'unlinked',
            number: '',
            numberValid: false
        });
    }

    onStartTexting = () => {
        updateTwilioAttributes({
            linkState: 'linked'
        });
    }

    onSendText = () => {
        updateTwilioAttributes({
            linkState: 'linked'
        });
    }

    onNumberValid = () => {
        updateTwilioAttributes({
            numberValid: true
        });
    }

    onNumberInvalid = () => {
        updateTwilioAttributes({
            numberValid: false
        });
    }

    componentWillUnmount() {
        resetTwilioAttributes();
    }

    render() {
        const {number, numberValid, phoneNumber, linkState, settings: {linkColor}} = this.props;
        let iconStyle = {};
        if (linkColor) {
            iconStyle = {
                color: `#${linkColor}`
            };
        }

        const linkButton = numberValid ? <button className='btn btn-sk-primary'
                                                 onClick={ this.linkTwilioNumber }>
                                             Continue
                                         </button> : '';
        const unlinkedComponent = <div>
                                      <ReactTelephoneInput ref={ (c) => this._telInput = c }
                                                           defaultCountry='ca'
                                                           onChange={ this.handleInputChange }
                                                           onValid={ this.onNumberValid }
                                                           onInvalid={ this.onNumberInvalid }
                                                           preferredCountries={ ['ca', 'us'] }
                                                           onBlur={ this.handleInputBlur } />
                                      { linkButton }
                                  </div>;
        const pendingComponent = <div className='twilio-linking pending-state'>
                                     <i className='fa fa-phone'
                                        style={ iconStyle }></i>
                                     <span className='phone-number'>{ number } - Pending</span>
                                     <a onClick={ this.onRetry }>Retry</a>
                                 </div>;

        const sendTextUrl = `sms://${phoneNumber}`;
        const linkedComponentButton = isMobile.phone ? <button className='btn btn-sk-primary twilio-linking'
                                                               onClick={ this.onStartTexting }>
                                                           Start Texting
                                                       </button> :
            <button className='btn btn-sk-primary twilio-linking'
                    onClick={ this.onSendText }>
                Send me a text
            </button>;

        const linkedComponent = <div>
                                    <div className='twilio-linking linked-state'>
                                        <i className='fa fa-phone'
                                           style={ iconStyle }></i>
                                        <span className='phone-number'>{ number }</span>
                                        <a onClick={ this.onChangeNumber }>Change my number</a>
                                    </div>
                                    <a href={ sendTextUrl }>
                                        { linkedComponentButton }
                                    </a>
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

export const TwilioChannelContent = connect((state) => {
    return {
        ...state.integrations.twilio,
        settings: state.app.settings.web
    };
})(TwilioChannelContentComponent);
