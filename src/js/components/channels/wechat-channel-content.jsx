import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { LoadingComponent } from '../../components/loading';
import { fetchWeChatQRCode } from '../../services/integrations';

export class WeChatChannelContentComponent extends Component {

    static propTypes = {
        channelState: PropTypes.object.isRequired,
        qrCodeError: PropTypes.string.isRequired
    };

    render() {
        const {channelState, qrCodeError} = this.props;

        if (channelState.hasError) {
            return <a className={ 'sk-error-link' }
                      onClick={ fetchWeChatQRCode }>
                       { qrCodeError }
                   </a>;
        }

        if (channelState.qrCode) {
            return <img alt='WeChat QR Code'
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

export const WeChatChannelContent = connect(({ui: {text}}) => {
    return {
        qrCodeError: text.wechatQRCodeError
    };
})(WeChatChannelContentComponent);
