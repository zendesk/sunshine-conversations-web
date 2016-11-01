import React, { Component, PropTypes } from 'react';
import { LoadingComponent } from '../../components/loading';
import { fetchViberQRCode } from '../../services/integrations-service';


export class ViberChannelContent extends Component {
    static contextTypes = {
        ui: PropTypes.object
    };

    static propTypes = {
        channelState: PropTypes.object.isRequired
    };

    render() {
        const {channelState = {}} = this.props;
        const {ui: {text}} = this.context;

        if (channelState.hasError) {
            return <a className={ 'sk-error-link' }
                      onClick={ fetchViberQRCode }>
                       { text.viberQRCodeError }
                   </a>;
        }

        if (channelState.qrCode) {
            return <img style={ { width: '40%' } }
                        src={ channelState.qrCode } />;
        }

        const loadingStyle = {
            height: 40,
            width: 40,
            margin: 'auto'
        };

        return <LoadingComponent dark={ true }
                                 style={ loadingStyle } />;
    }
}
