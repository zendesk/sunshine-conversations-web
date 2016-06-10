import React, { Component, PropTypes } from 'react';

import { showChannelPage } from '../services/app-service';

export class AlternateChannels extends Component {
    static propTypes = {
        items: PropTypes.array.isRequired
    }

    onChannelClick(event) {
        const channel = event.target.id;
        showChannelPage(channel);
    }

    render() {
        const {items} = this.props;

        return <div className='available-channels'>
                   <div className='channel-list'>
                       { items.map(({channel, details}) => {
                             return <img id={ channel }
                                         className='channel-icon'
                                         key={ channel.type }
                                         onClick={ this.onChannelClick }
                                         src={ details.icon }
                                         srcSet={ `${details.icon} 1x, ${details.icon2x} 2x` } />;
                         }) }
                   </div>
               </div>;
    }
}
