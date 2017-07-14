import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ChannelPage from './ChannelPage';
import { getAppChannelDetails } from '../../utils/app';

export class ChannelComponent extends Component {
    static propTypes = {
        appChannels: PropTypes.array.isRequired,
        pendingClients: PropTypes.array.isRequired,
        channelStates: PropTypes.object.isRequired,
        visibleChannelType: PropTypes.string,
        smoochId: PropTypes.string,
        clients: PropTypes.array
    };

    render() {
        const {appChannels, visibleChannelType, smoochId, clients, pendingClients, channelStates} = this.props;

        if (!smoochId) {
            return null;
        }

        const channelPages = getAppChannelDetails(appChannels).map(({channel, details}) => {
            const client = clients.find((client) => client.platform === channel.type);
            const pendingClient = pendingClients.find((client) => client.platform === channel.type);

            if (!details.Component || (!!client && !details.renderPageIfLinked)) {
                return null;
            }

            return <ChannelPage key={ channel.type }
                                {...details}
                                channel={ channel }
                                icon={ details.iconLarge }
                                icon2x={ details.iconLarge2x }
                                client={ client }
                                pendingClient={ pendingClient }
                                visible={ channel.type === visibleChannelType }>
                       <details.Component {...channel}
                                          channelState={ channelStates[channel.type] }
                                          getContent={ details.getContent }
                                          smoochId={ smoochId }
                                          linked={ !!client } />
                   </ChannelPage>;
        });

        return <div className='channel-pages-container'>
                   { channelPages }
               </div>;
    }
}

export default connect(({appState, app, user, integrations}) => {
    return {
        visibleChannelType: appState.visibleChannelType,
        appChannels: app.integrations,
        channelStates: integrations,
        smoochId: user._id,
        clients: user.clients,
        pendingClients: user.pendingClients
    };
})(ChannelComponent);
