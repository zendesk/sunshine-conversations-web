import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { LoadingComponent } from '../../components/loading';

export class MessengerChannelContentComponent extends Component {

    static propTypes = {
        channelState: PropTypes.object.isRequired,
        pageId: PropTypes.string.isRequired
    };

    render() {
        const {channelState, pageId} = this.props;
        const code = channelState.transferRequestCode;
        if (code) {
            const url = `https://m.me/${pageId}?ref=${code}`;
            return <a alt='Connect'
                      target='_blank'
                      onClick={ () => console.log('lol') }
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

export const MessengerChannelContent = connect(({ui: {text}}) => {
    return {};
})(MessengerChannelContentComponent);
