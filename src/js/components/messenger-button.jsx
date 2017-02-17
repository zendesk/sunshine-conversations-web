import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import bindAll from 'lodash.bindall';

import { openWidget } from '../services/app';
import { DefaultButtonIcon } from './default-button-icon';

export class MessengerButtonComponent extends Component {

    static propTypes = {
        shown: PropTypes.bool.isRequired,
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
        dispatch(openWidget());
    }

    render() {
        const {unreadCount, shown, settings} = this.props;
        const {brandColor, isBrandColorDark, buttonIconUrl} = settings;

        const style = {
            backgroundColor: `#${brandColor}`
        };

        let content;

        if (buttonIconUrl) {
            content = <div className='messenger-button-icon'>
                          <img alt='Smooch Messenger Button'
                               src={ buttonIconUrl } />
                      </div>;
        } else {
            content = <DefaultButtonIcon isBrandColorDark={ isBrandColorDark } />;
        }

        let unreadBadge;
        if (unreadCount > 0) {
            unreadBadge = <div className='unread-badge'>
                              { unreadCount }
                          </div>;
        }

        return <div id='sk-messenger-button'
                    className={ `messenger-button-${shown ? 'shown' : 'hidden'}` }
                    style={ style }
                    onClick={ this.onClick }>
                   { content }
                   { unreadBadge }
               </div>;
    }
}

export const MessengerButton = connect(({app, conversation: {unreadCount}}) => {
    return {
        settings: app.settings.web,
        unreadCount
    };
})(MessengerButtonComponent);
