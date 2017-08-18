import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Loading from '../Loading';
import { fetchWeChatQRCode } from '../../actions/integrations';

export class WeChatChannelContentComponent extends Component {

    static propTypes = {
        channelState: PropTypes.object.isRequired,
        qrCodeError: PropTypes.string.isRequired
    };

    render() {
        const {channelState, qrCodeError} = this.props;

        if (channelState.hasError) {
            return <a className='error-link'
                      onClick={ fetchWeChatQRCode }>
                       { qrCodeError }
                   </a>;
        }

        if (channelState.qrCode) {
            return <img alt='WeChat QR Code'
                        style={ { width: '40%' } }
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

export default connect(({ui: {text}}) => {
    return {
        qrCodeError: text.wechatQRCodeError
    };
})(WeChatChannelContentComponent);
