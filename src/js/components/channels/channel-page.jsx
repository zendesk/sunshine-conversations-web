import React, { Component, PropTypes } from 'react';


export class ChannelPage extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        descriptionHtml: PropTypes.string,
        visible: PropTypes.bool,
        icon: PropTypes.string.isRequired,
        icon2x: PropTypes.string.isRequired,
        children: PropTypes.element.isRequired
    };

    static defaultProps = {
        visible: false
    };

    render() {
        const {icon, icon2x, name, visible, description, descriptionHtml, children} = this.props;
        const channelDescription = descriptionHtml ?
            <span dangerouslySetInnerHTML={ { __html: descriptionHtml } } /> :
            <span>{ description }</span>;

        return <div className={ `sk-channel ${visible ? 'sk-channel-visible' : 'sk-channel-hidden'}` }>
                   <div className='content-wrapper'>
                       <div className='channel-header'>
                           <img className='channel-icon'
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
