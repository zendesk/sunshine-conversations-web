import React, { Component } from 'react';
import ImageLoader from 'react-imageloader';


function Loading() {
    return <div className='image-overlay'>
               <div className='three-bounce spinner'>
                   <div className='bounce1'></div>
                   <div className='bounce2'></div>
                   <div className='bounce3'></div>
               </div>
           </div>;
}

export class ImageMessage extends Component {
    static propTypes = {
        mediaUrl: React.PropTypes.string.isRequired
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
                       <Loading />
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
                       <Loading />
                       { image }
                   </div>;
        }

        return image;
    }
}
