import React, { Component } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

const BLINKING_INTERVAL = 1500;

export class MessageIndicatorComponent extends Component {
    state = {
        initialDocumentTitle: global.document ? document.title : '',
        currentTitle: global.document ? document.title : ''
    };

    blinkTitle() {
        if (!this.blinkInterval) {
            const fn = () => {
                const {unreadCount, messages, messageIndicatorTitle} = this.props;
                const {currentTitle, initialDocumentTitle} = this.state;
                if (currentTitle === initialDocumentTitle && unreadCount > 0) {
                    const filteredMessages = messages.filter((message) => message.role !== 'appUser');
                    const lastMessageAuthor = filteredMessages[filteredMessages.length - 1].name;

                    this.setState({
                        currentTitle: messageIndicatorTitle.replace('{name}', lastMessageAuthor)
                    });
                } else {
                    this.setState({
                        currentTitle: initialDocumentTitle
                    });
                }
            };
            this.blinkInterval = setInterval(fn, BLINKING_INTERVAL);
        }
    }

    cancelBlinking() {
        const {currentTitle, initialDocumentTitle} = this.state;
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
            delete this.blinkInterval;
        }

        if (currentTitle !== initialDocumentTitle) {
            this.setState({
                currentTitle: initialDocumentTitle
            });
        }
    }

    componentWillReceiveProps({unreadCount}) {
        if (unreadCount > 0) {
            this.blinkTitle();
        } else {
            this.cancelBlinking();
        }
    }

    componentDidMount() {
        const {unreadCount} = this.props;
        if (unreadCount > 0) {
            this.blinkTitle();
        }
    }

    componentWillUnmount() {
        this.cancelBlinking();

        // do it manually because `DocumentTitle` will be unmounted
        document.title = this.state.initialDocumentTitle;
    }

    render() {
        return <DocumentTitle title={ this.state.currentTitle } />;
    }
}

export const MessageIndicator = connect(({conversation, ui: {text: {messageIndicatorTitle}}}) => {
    return {
        ...conversation,
        messageIndicatorTitle
    };
})(MessageIndicatorComponent);
