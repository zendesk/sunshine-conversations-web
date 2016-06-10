import React, { Component, PropTypes } from 'react';
import MessengerPlugin from 'react-messenger-plugin';

export class MessengerChannelContent extends Component {
    static propTypes = {
        appId: PropTypes.string.isRequired,
        pageId: PropTypes.string.isRequired,
        smoochId: PropTypes.string.isRequired
    };

    state = {
        sdkBlocked: false
    };

    facebookScriptDidLoad = () => {
        // __globalCallbacks is one of the key added to FB when it's properly loaded.
        if (!global.FB || !global.FB.__globalCallbacks) {
            console.warn('Facebook SDK was blocked.');
            this.setState({
                sdkBlocked: true
            });
        }
    };


    render() {
        const {appId, pageId, smoochId} = this.props;

        return this.state.sdkBlocked ?
            <p>
                <a href={ `https://m.me/${pageId}` }
                   target='_blank'>
                    { `https://m.me/${pageId}` }
                </a>
            </p> :
            <MessengerPlugin appId={ appId }
                             pageId={ pageId }
                             passthroughParams={ smoochId }
                             asyncScriptOnLoad={ this.facebookScriptDidLoad }
                             size='large' />;
    }
}
