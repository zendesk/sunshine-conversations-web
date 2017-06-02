import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { TransferRequestChannelContent } from './transfer-request-channel-content';

export class TelegramChannelContentComponent extends Component {

    static propTypes = {
        channelState: PropTypes.object.isRequired,
        username: PropTypes.string.isRequired
    };

    render() {
        const {username, channelState} = this.props;
        const url = `https://telegram.me/${username}?start=${channelState.transferRequestCode}`;
        return <TransferRequestChannelContent type='telegram'
                                              channelState={ channelState }
                                              url={ url } />;
    }
}

export const TelegramChannelContent = connect()(TelegramChannelContentComponent);
