import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

export class ChannelPageComponent extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        descriptionHtml: PropTypes.string,
        visible: PropTypes.bool,
        icon: PropTypes.string.isRequired,
        icon2x: PropTypes.string.isRequired,
        children: PropTypes.element.isRequired,
        text: PropTypes.object.isRequired
    };

    static defaultProps = {
        visible: false
    };

    render() {
        const {icon, icon2x, name, visible, children, channel, client, pendingClient, text} = this.props;

        const description = this.props.getDescription ?
            this.props.getDescription({
                text,
                channel,
                client,
                pendingClient
            }) :
            text[this.props.descriptionKey];

        const descriptionHtml = text[this.props.descriptionHtmlKey];

        const channelDescription = descriptionHtml ?
            <span dangerouslySetInnerHTML={ {    __html: descriptionHtml} } /> :
            <span>{ description }</span>;

        return <div className={ `sk-channel ${visible ? 'sk-channel-visible' : 'sk-channel-hidden'}` }>
                   <div className='content-wrapper'>
                       <div className='channel-header'>
                           <img className='channel-icon'
                                alt={ name }
                                src={ icon }
                                srcSet={ `${icon} 1x, ${icon2x} 2x` } />
                           <div className='channel-name'>
                               { name }
                           </div>
                           <div className='channel-description'>
                               { channelDescription }
                           </div>
                       </div>
                       <div className='channel-content'>
                           { children }
                       </div>
                   </div>
               </div>;
    }
}

export const ChannelPage = connect(({ui: {text}}) => {
    return {
        text
    };
})(ChannelPageComponent);
