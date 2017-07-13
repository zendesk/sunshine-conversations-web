import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ImageLoader from '../lib/react-imageloader';
import ImageLoading from './ImageLoading';
import { SEND_STATUS } from '../constants/message';

export default class ImageMessage extends Component {
    static propTypes = {
        mediaUrl: PropTypes.string.isRequired,
        accentColor: PropTypes.string
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
                       <ImageLoading color={ this.props.accentColor } />
                       { this.state.oldMediaUrl ?
                             <img src={ this.state.oldMediaUrl }
                                  alt='Uploaded image' /> :
                             null }
                   </div>;
        };
        const image = <ImageLoader src={ this.props.mediaUrl }
                                   imgProps={ { alt: 'Uploaded image' } }
                                   wrapper={ React.DOM.div }
                                   preloader={ preloader }
                                   onLoad={ this.props.onLoad }>
                      </ImageLoader>;

        if (this.props.sendStatus === SEND_STATUS.SENDING) {
            return <div className='image-container'>
                       <ImageLoading color={ this.props.accentColor } />
                       { image }
                   </div>;
        }

        return image;
    }
}
