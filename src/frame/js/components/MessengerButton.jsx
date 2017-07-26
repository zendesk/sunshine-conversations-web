import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { openWidget } from '../actions/app-state';
import { bindAll } from '../utils/functions';
import DefaultButtonIcon from './DefaultButtonIcon';

export class MessengerButtonComponent extends Component {

    static propTypes = {
        shown: PropTypes.bool.isRequired,
        unreadCount: PropTypes.number.isRequired,
        brandColor: PropTypes.string,
        isBrandColorDark: PropTypes.bool,
        buttonIconUrl: PropTypes.string
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
        const {unreadCount, shown, brandColor, isBrandColorDark, buttonIconUrl} = this.props;

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

export default connect(({conversation: {unreadCount}, config: {style}}) => {
    return {
        brandColor: style.brandColor,
        isBrandColorDark: style.isBrandColorDark,
        buttonIconUrl: style.buttonIconUrl,
        unreadCount
    };
})(MessengerButtonComponent);
