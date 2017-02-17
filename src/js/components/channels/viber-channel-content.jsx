import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { LoadingComponent } from '../../components/loading';
import { fetchViberQRCode } from '../../services/integrations';


class ViberChannelContentComponent extends Component {
    static propTypes = {
        channelState: PropTypes.object.isRequired,
        ui: PropTypes.object.isRequired
    };

    render() {
        const {channelState, ui: {text}} = this.props;

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
