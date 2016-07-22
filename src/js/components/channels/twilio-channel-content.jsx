import React, { Component } from 'react';

import { ReactTelephoneInput } from '../../lib/react-telephone-input';

export class TwilioChannelContent extends Component {
    state = {
        numberValid: false
    }


    onNumberValid = () => {
        this.setState({
            numberValid: true
        });
    }

    onNumberInvalid = () => {
        this.setState({
            numberValid: false
        });
    }

    render() {
        return <div>
                   <ReactTelephoneInput ref='telInput'
                                        defaultCountry='ca'
                                        onChange={ this.handleInputChange }
                                        onValid={ this.onNumberValid }
                                        onInvalid={ this.onNumberInvalid }
                                        preferredCountries={ ['ca', 'us'] }
                                        onBlur={ this.handleInputBlur } />
               </div>;
    }
}
