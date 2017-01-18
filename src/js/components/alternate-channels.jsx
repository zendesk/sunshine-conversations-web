import React, { Component, PropTypes } from 'react';

import { showChannelPage } from '../services/app';

export class AlternateChannels extends Component {
    static propTypes = {
        items: PropTypes.array.isRequired
    }

    onChannelClick(event) {
        showChannelPage(event.target.id);
    }

    render() {
        const {items} = this.props;

        return <div className='available-channels'>
                   <div className='channel-list'>
                       { items.map(({channel, details}) => {
                             return <img id={ channel.type }
                                         className='channel-icon'
                                         key={ channel.type }
                                         onClick={ this.onChannelClick }
                                         src={ details.icon }
                                         alt={ details.name }
                                         srcSet={ `${details.icon} 1x, ${details.icon2x} 2x` } />;
                         }) }
                   </div>
               </div>;
    }
}
