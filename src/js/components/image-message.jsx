import React, { Component } from 'react';
import ImageLoader from 'react-imageloader';

import { ImageLoading } from 'components/image-loading';

export class ImageMessage extends Component {
    static propTypes = {
        mediaUrl: React.PropTypes.string.isRequired,
        accentColor: React.PropTypes.string
    };

    state = {};

    componentWillReceiveProps(nextProps) {
        if (this.props.mediaUrl !== nextProps.mediaUrl) {
            // keep the old url so we can display it while the new one loads from
            // the CDN.
            this.setState({
                oldMediaUrl: this.props.mediaUrl
            });
        }
    }

    render() {
        const preloader = () => {
            return <div className='preloader-container'>
                       <ImageLoading accentColor={ this.props.accentColor } />
                       { this.state.oldMediaUrl ?
                             <img src={ this.state.oldMediaUrl } /> :
                             null }
                   </div>;
        };
        const image = <ImageLoader src={ this.props.mediaUrl }
                                   wrapper={ React.DOM.div }
                                   preloader={ preloader }
                                   onLoad={ this.props.onLoad }>
                      </ImageLoader>;

        if (this.props.status === 'sending') {
            return <div className='image-container'>
                       <ImageLoading accentColor={ this.props.accentColor } />
                       { image }
                   </div>;
        }

        return image;
    }
}
