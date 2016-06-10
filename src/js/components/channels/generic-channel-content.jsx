import React, { Component, PropTypes } from 'react';

export class GenericChannelContent extends Component {
    static propTypes = {
        getContent: PropTypes.func.isRequired
    };

    render() {
        const {getContent, ...channel} = this.props;

        return <p>
                   { getContent(channel) }
               </p>;
    }
}
