import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import bindAll from 'lodash.bindall';

import { showChannelPage } from '../services/app';

export class NotificationChannelItemComponent extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        linked: PropTypes.bool.isRequired,
        hasURL: PropTypes.string,
        icon: PropTypes.string.isRequired,
        icon2x: PropTypes.string.isRequired,
        displayName: PropTypes.string,
        linkColor: PropTypes.string,
        notificationSettingsConnectedAsText: PropTypes.string.isRequired,
        notificationSettingsConnectedText: PropTypes.string.isRequired
    };

    constructor(...args) {
        super(...args);
        bindAll(this, 'onClick');
    }

    onClick() {
        const {dispatch} = this.props;
        dispatch(showChannelPage(this.props.id));
    }

    render() {
        const {name, icon, icon2x, linked, hasURL, displayName, linkColor, notificationSettingsConnectedText, notificationSettingsConnectedAsText} = this.props;

        const itemRightStyle = linked && linkColor ? {
            color: `#${linkColor}`
        } : null;

        const classNames = ['channel-item'];
        const contentClassNames = ['channel-item-content'];

        if (linked) {
            classNames.push('channel-item-linked');
            contentClassNames.push('linked');
        }

        return <div className={ classNames.join(' ') }
                    onClick={ this.onClick }>
                   <div className='channel-item-header'>
                       <img className='channel-item-icon'
                            alt={ name }
                            src={ icon }
                            srcSet={ `${icon} 1x, ${icon2x} 2x` } />
                       <div className={ contentClassNames.join(' ') }>
                           <div className='channel-item-name'>
                               { name }
                           </div>
                           { linked ? <div className='channel-item-connected-as'>
                                          { displayName ? notificationSettingsConnectedAsText.replace('{username}', displayName) : notificationSettingsConnectedText }
                                      </div> : null }
                       </div>
                       <div className='channel-item-right'
                            style={ itemRightStyle }>
                           { hasURL && linked ? 'Open' : <i className='fa fa-angle-right' /> }
                       </div>
                   </div>
               </div>;
    }
}

export const NotificationChannelItem = connect(({app, ui}) => {
    return {
        linkColor: app.settings.web.linkColor,
        notificationSettingsConnectedAsText: ui.text.notificationSettingsConnectedAs,
        notificationSettingsConnectedText: ui.text.notificationSettingsConnected
    };
})(NotificationChannelItemComponent);
