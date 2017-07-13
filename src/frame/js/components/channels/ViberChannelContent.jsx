import isMobile from 'ismobilejs';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Loading from '../Loading';
import { fetchViberQRCode } from '../../services/integrations';

import TransferRequestChannelContent from './TransferRequestChannelContent';

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

        return <Loading dark={ true }
                                 style={ loadingStyle } />;
    }
}

export default connect(({ui}) => {
    return {
        ui
    };
})(ViberChannelContentComponent);
