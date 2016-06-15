import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { ChannelPage } from './channel-page';
import { isChannelLinked } from '../../utils/user';
import { getAppChannelDetails } from '../../utils/app';

export class ChannelComponent extends Component {
    static propTypes = {
        appChannels: PropTypes.array.isRequired,
        visibleChannelType: PropTypes.string,
        smoochId: PropTypes.string,
        clients: PropTypes.array
    };

    render() {
        const {appChannels, visibleChannelType, smoochId, clients} = this.props;

        //
        if (!smoochId) {
            return null;
        }

        const channelPages = getAppChannelDetails(appChannels).map(({channel, details}) => {
            if (!details.Component || isChannelLinked(clients, channel.type)) {
                return null;
            }

            return <ChannelPage key={ channel.type }
                                {...details}
                                icon={ details.iconLarge }
                                icon2x={ details.iconLarge2x }
                                visible={ channel.type === visibleChannelType }>
                       <details.Component {...channel}
                                          getContent={ details.getContent }
                                          smoochId={ smoochId } />
                   </ChannelPage>;
        });

        return <div className='channel-pages-container'>
                   { channelPages }
               </div>;
    }
}

export const Channel = connect(({appState, app, user}) => {
    const channelType = appState.visibleChannelType;
    return {
        visibleChannelType: channelType,
        appChannels: app.integrations,
        smoochId: user._id,
        clients: user.clients
    };
})(ChannelComponent);
