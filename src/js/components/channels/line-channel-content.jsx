import React, { Component } from 'react';

export class LineChannelContent extends Component {
    render() {
        const {qrCodeUrl} = this.props;
        return <img style={ {    width: '40%'} }
                    src={ qrCodeUrl } />;
    }
}
