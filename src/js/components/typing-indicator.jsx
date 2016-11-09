import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';


export class TypingIndicatorComponent extends Component {
    static propTypes = {
        accentColor: PropTypes.string.isRequired
    };

    render() {
        return <div className='sk-typing-indicator'>
                   I'M TYPING OKAY?!?
               </div>;
    }
}


export const TypingIndicator = connect(({app}) => {
    return {
        accentColor: app.settings.web.accentColor
    };
})(TypingIndicatorComponent);
