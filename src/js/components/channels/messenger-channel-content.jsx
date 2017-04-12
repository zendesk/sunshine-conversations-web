import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { TransferRequestChannelContent } from './transfer-request-channel-content';

export class MessengerChannelContentComponent extends Component {

    static propTypes = {
        pageId: PropTypes.string.isRequired,
        channelState: PropTypes.object.isRequired
    };

    render() {
        const {pageId, channelState} = this.props;
        const url = `https://m.me/${pageId}?ref=${channelState.transferRequestCode}`;
        return <TransferRequestChannelContent type='messenger'
                                              channelState={ channelState }
                                              url={ url } />;
    }
}

export const MessengerChannelContent = connect()(MessengerChannelContentComponent);
