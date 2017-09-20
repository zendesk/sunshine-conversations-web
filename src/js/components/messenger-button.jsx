import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import bindAll from 'lodash.bindall';

import { toggleWidget } from '../services/app';
import { DefaultButtonIcon } from './default-button-icon';
import { DefaultCloseIcon } from './default-close-icon';
import classnames from 'classnames';

export class MessengerButtonComponent extends Component {

    static propTypes = {
        shown: PropTypes.bool.isRequired,
        isWidgetOpen: PropTypes.bool.isRequired,
        unreadCount: PropTypes.number.isRequired,
        settings: PropTypes.object.isRequired
    };

    static defaultProps = {
        shown: true,
        unreadCount: 0
    };

    constructor(...args) {
        super(...args);
        bindAll(this, 'onClick');
    }

    onClick(e) {
        const {dispatch} = this.props;
        e.preventDefault();
        dispatch(toggleWidget());
    }

    render() {
        const {unreadCount, shown, isWidgetOpen, settings} = this.props;
        const {brandColor, isBrandColorDark, buttonIconUrl} = settings;

        const style = {
            backgroundColor: `#${brandColor}`
        };

        let icon;

        if (buttonIconUrl) {
            icon = <div className='messenger-button-icon' style={{position: 'absolute'}}>
                          <img alt='Smooch Messenger Button'
                               src={ buttonIconUrl } />
                      </div>;
        } else {
            icon = <DefaultButtonIcon key='2' isBrandColorDark={ isBrandColorDark } style={{position: 'absolute'}}/>;
        }

        let unreadBadge;
        if (unreadCount > 0) {
            unreadBadge = <div className='unread-badge'>
                              { unreadCount }
                          </div>;
        }

        return <div id='sk-messenger-button'
                    className={`messenger-button-${shown ? 'shown' : 'hidden'}`}
                    style={style}
                    onClick={this.onClick}>

            <div
                key='1'
                className={classnames('sk-messenger-icon sk-messenger-close-icon', {
                    'sk-messenger-icon-hidden-up': !isWidgetOpen
                })}
                style={{position: 'absolute'}}
            >
                <DefaultCloseIcon key='2' isBrandColorDark={ isBrandColorDark } style={{position: 'absolute'}}/>
            </div>

            <div className={classnames('sk-messenger-icon', {'sk-messenger-icon-hidden-down': isWidgetOpen})}>
                {icon}
            </div>
            {unreadBadge}
        </div>;
    }
}

export const MessengerButton = connect(({app, conversation: {unreadCount}}) => {
    return {
        settings: app.settings.web,
        unreadCount
    };
})(MessengerButtonComponent);
