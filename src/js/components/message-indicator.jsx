import React, { Component } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

const BLINKING_INTERVAL = 1500;

export class MessageIndicatorComponent extends Component {
    state = {
        initialDocumentTitle: global.document ? document.title : '',
        currentTitle: global.document ? document.title : '',
        lastSetTitle: ''
    };

    blinkTitle() {
        if (!this.blinkInterval) {
            const fn = () => {
                const {unreadCount, messageIndicatorTitleSingular, messageIndicatorTitlePlural} = this.props;
                const {currentTitle, lastSetTitle} = this.state;
                let {initialDocumentTitle} = this.state;

                const title = document.title;

                if (title !== initialDocumentTitle && title !== lastSetTitle) {
                    // document title changed for something we don't control, this is the new initial title
                    this.setState({
                        initialDocumentTitle: title
                    });

                    initialDocumentTitle = title;
                }

                if (currentTitle === initialDocumentTitle && unreadCount > 0) {

                    const newTitle = unreadCount === 1 ?
                        messageIndicatorTitleSingular :
                        messageIndicatorTitlePlural;

                    this.setState({
                        currentTitle: newTitle.replace('{count}', unreadCount),
                        lastSetTitle: newTitle.replace('{count}', unreadCount)
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

export const MessageIndicator = connect(({conversation: {unreadCount}, ui: {text: {messageIndicatorTitleSingular, messageIndicatorTitlePlural}}}) => {
    return {
        unreadCount,
        messageIndicatorTitleSingular,
        messageIndicatorTitlePlural
    };
})(MessageIndicatorComponent);
