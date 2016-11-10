import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

export class TypingIndicatorComponent extends Component {
    static propTypes = {
        accentColor: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string
    };

    state = {
        mounted: false
    };

    componentDidMount() {
        this.setState({
            mounted: true
        });
    }

    render() {
        const {accentColor, avatarUrl} = this.props;
        const {mounted} = this.state;

        const avatar = avatarUrl ?
            <img src={ avatarUrl }
                 className='sk-typing-indicator-avatar' /> :
            <div className='sk-msg-avatar-placeholder' />;

        return <div className={ `sk-typing-indicator-container ${mounted ? 'fade-in' : ''}` }>
                   { avatar }
                   <div className='sk-typing-indicator'>
                       <span></span>
                       <span></span>
                       <span></span>
                   </div>
               </div>;
    }
}


export const TypingIndicator = connect(({app, appState}) => {
    return {
        accentColor: app.settings.web.accentColor,
        avatarUrl: appState.typingIndicatorAvatarUrl
    };
})(TypingIndicatorComponent);
