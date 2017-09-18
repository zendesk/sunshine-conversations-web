import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export class TypingIndicatorComponent extends Component {
    static propTypes = {
        avatarUrl: PropTypes.string,
        name: PropTypes.string,
        firstInGroup: PropTypes.bool
    };

    static defaultProps = {
        firstInGroup: true
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
        const {avatarUrl, name, firstInGroup} = this.props;
        const {mounted} = this.state;

        const avatar = avatarUrl ?
            <img src={ avatarUrl }
                 alt={ `${name}'s avatar` }
                 className='typing-indicator-avatar' /> :
            <div className='typing-indicator-avatar-placeholder' />;

        const fromName = name && firstInGroup ? <div className='from'>
                                                    { name }
                                                </div> : null;

        return <div className={ `typing-indicator-container ${mounted ? 'fade-in' : ''}` }>
                   { fromName }
                   { avatar }
                   <div className={ `typing-indicator ${firstInGroup ? 'typing-indicator-first' : ''}` }>
                       <span></span>
                       <span></span>
                       <span></span>
                   </div>
               </div>;
    }
}


export default connect(({appState}) => {
    return {
        avatarUrl: appState.typingIndicatorAvatarUrl,
        name: appState.typingIndicatorName
    };
})(TypingIndicatorComponent);
