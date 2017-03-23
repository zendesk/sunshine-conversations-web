import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { hideChannelPage } from '../../services/app';
import { LoadingComponent } from '../../components/loading';
import { resetTransferRequestCode } from '../../actions/integrations-actions';

export class MessengerChannelContentComponent extends Component {

    static propTypes = {
        channelState: PropTypes.object.isRequired,
        pageId: PropTypes.string.isRequired
    };

    onLink = () => {
        const {dispatch, type} = this.props;
        dispatch(resetTransferRequestCode(type));
        dispatch(hideChannelPage());
    }

    render() {
        const {channelState, pageId} = this.props;
        const code = channelState.transferRequestCode;
        if (code) {
            const url = `https://m.me/${pageId}?ref=${code}`;
            return <a alt='Connect'
                      target='_blank'
                      onClick={ this.onLink }
                      href={ url }>Connect</a>;
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

export const MessengerChannelContent = connect()(MessengerChannelContentComponent);
