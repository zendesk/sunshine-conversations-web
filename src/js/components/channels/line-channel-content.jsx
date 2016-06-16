import React, { Component } from 'react';

export class LineChannelContent extends Component {
    render() {
        const {botName} = this.props;

        return <span className='channel-content-value'>
                   { botName }
               </span>;
    }
}
