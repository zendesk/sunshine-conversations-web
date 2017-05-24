import isMobile from 'ismobilejs';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { LoadingComponent } from '../../components/loading';
import { fetchViberQRCode } from '../../services/integrations';

import { TransferRequestChannelContent } from './transfer-request-channel-content';

class ViberChannelContentComponent extends Component {
    static propTypes = {
        channelState: PropTypes.object.isRequired,
        ui: PropTypes.object.isRequired
    };

    render() {
        const {uri, channelState, ui: {text}} = this.props;
        if (isMobile.any) {
            const url = `viber://pa?chatURI=${uri}&context=${channelState.transferRequestCode}`;
            return <TransferRequestChannelContent type='viber'
                                                  channelState={ channelState }
                                                  url={ url } />;
        }

        if (channelState.hasError) {
            return <a className={ 'sk-error-link' }
                      onClick={ fetchViberQRCode }>
                       { text.viberQRCodeError }
                   </a>;
        }

        if (channelState.qrCode) {
            return <img alt='Viber QR Code'
                        style={ {    width: '40%'} }
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

export const ViberChannelContent = connect(({ui}) => {
    return {
        ui
    };
})(ViberChannelContentComponent);
