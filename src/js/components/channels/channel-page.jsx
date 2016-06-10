import React, { Component, PropTypes } from 'react';


export class ChannelPage extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        visible: PropTypes.bool,
        icon: PropTypes.string.isRequired,
        icon2x: PropTypes.string.isRequired,
        children: PropTypes.element.isRequired
    };

    static defaultProps = {
        visible: false
    };

    render() {
        const {icon, icon2x, name, visible, description, children} = this.props;

        return <div className={ `sk-channel ${visible ? 'sk-channel-visible' : 'sk-channel-hidden'}` }>
                   <div className='content-wrapper'>
                       <div className='channel-header'>
                           <img className='channel-icon'
                                src={ icon }
                                srcSet={ `${icon} 1x, ${icon2x} 2x` } />
                           <div className='channel-name'>
                               { name }
                           </div>
                           <p className='channel-description'>
                               { description }
                           </p>
                       </div>
                       <div className='channel-content'>
                           { children }
                       </div>
                   </div>
               </div>;
    }
}
