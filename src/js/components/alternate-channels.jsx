import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import bindAll from 'lodash.bindall';

import { showChannelPage } from '../services/app';

export class AlternateChannelsComponent extends Component {
    static propTypes = {
        items: PropTypes.array.isRequired
    };

    constructor(...args) {
        super(...args);
        bindAll(this, 'onChannelClick');
    }

    onChannelClick(e) {
        e.preventDefault();
        const {dispatch} = this.props;
        dispatch(showChannelPage(e.target.id));
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

export const AlternateChannels = connect()(AlternateChannelsComponent);
