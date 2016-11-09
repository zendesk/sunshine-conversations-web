import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';


export class TypingIndicatorComponent extends Component {
    static propTypes = {
        accentColor: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string
    };

    render() {
        const {accentColor, avatarUrl} = this.props;
        const avatar = avatarUrl ?
            <div className='sk-typing-indicator-avatar'>
                <img src={ avatarUrl } />
            </div> :
            null;
        return <div className='sk-typing-indicator-container'>
                   { avatar }
                   <div className='sk-typing-indicator'>
                       I'M TYPING OKAY?!?
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
