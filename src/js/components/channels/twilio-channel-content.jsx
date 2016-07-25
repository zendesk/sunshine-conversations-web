import React, { Component } from 'react';
import { updateTwilioAttributes, resetTwilioAttributes } from '../../services/integrations-service';

import { ReactTelephoneInput } from '../../lib/react-telephone-input';

import { connect } from 'react-redux';
import isMobile from 'ismobilejs';

export class TwilioChannelContentComponent extends Component {

    linkTwilioNumber = () => {
        const {state: {formattedNumber}} = this.refs.telInput;
        updateTwilioAttributes({
            number: formattedNumber,
            linkState: 'pending'
        });
    }

    onRetry = () => {
        updateTwilioAttributes({
            linkState: 'linked'
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
        let iconStyle = {};
        if (this.props.settings.linkColor) {
            iconStyle = {
                color: `#${this.props.settings.linkColor}`
            };
        }

        const linkButton = this.props.numberValid ? <button className='btn btn-sk-primary'
                                                            onClick={ this.linkTwilioNumber }>
                                                        Continue
                                                    </button> : '';
        const unlinkedComponent = <div>
                                      <ReactTelephoneInput ref='telInput'
                                                           defaultCountry='ca'
                                                           onChange={ this.handleInputChange }
                                                           onValid={ this.onNumberValid }
                                                           onInvalid={ this.onNumberInvalid }
                                                           preferredCountries={ ['ca', 'us'] }
                                                           onBlur={ this.handleInputBlur } />
                                      { linkButton }
                                  </div>;
        const pendingComponent = <div>
                                     <div className='twilio-linking pending-state'>
                                         <i className='fa fa-phone'
                                            style={ iconStyle }></i>
                                         <span className='phone-number'>{ this.props.number } - Pending</span>
                                         <a onClick={ this.onRetry }>Retry</a>
                                     </div>
                                 </div>;

        const sendTextUrl = `sms://${this.props.phoneNumber}`;

        const mobileLinkedComponent = <div>
                                          <div className='twilio-linking unconfirmed-state'>
                                              <i className='fa fa-phone'
                                                 style={ iconStyle }></i>
                                              <span className='phone-number'>{ this.props.number }</span>
                                              <a onClick={ this.onChangeNumber }>Change my number</a>
                                          </div>
                                          <a href={ sendTextUrl }>
                                              <button className='btn btn-sk-primary twilio-linking'
                                                      onClick={ this.onStartTexting }> Start Texting </button>
                                          </a>
                                      </div>;
        const desktopLinkedComponent = <div>
                                           <div className='twilio-linking linked-state'>
                                               <i className='fa fa-phone'
                                                  style={ iconStyle }></i>
                                               <span className='phone-number'>{ this.props.number }</span>
                                               <a onClick={ this.onChangeNumber }>Change my number</a>
                                           </div>
                                           <a href={ sendTextUrl }>
                                               <button className='btn btn-sk-primary twilio-linking'
                                                       onClick={ this.onSendText }> Send me a text </button>
                                           </a>
                                       </div>;
        const linkedComponent = isMobile.any ? mobileLinkedComponent : desktopLinkedComponent;
        if (this.props.linkState === 'pending') {
            return pendingComponent;
        } else if (this.props.linkState === 'linked') {
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
