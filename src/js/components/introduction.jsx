import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import { findDOMNode } from 'react-dom';

import { AlternateChannels } from './alternate-channels';
import { DefaultAppIcon } from './default-app-icon';

import { setIntroHeight } from '../actions/app-state-actions';

import { createMarkup } from '../utils/html';
import { getAppChannelDetails } from '../utils/app';

export class IntroductionComponent extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        appState: PropTypes.object.isRequired,
        app: PropTypes.object.isRequired,
        introAppText: PropTypes.string.isRequired,
        introductionText: PropTypes.string.isRequired
    };

    constructor(...args) {
        super(...args);
        this._debounceClientHeightCalculation = debounce(this.calculateIntroHeight.bind(this), 150);
    }

    componentDidMount() {
        // Height of Introduction component will be computed on render and on resize only
        window.addEventListener('resize', this._debounceClientHeightCalculation);
        setTimeout(this.calculateIntroHeight.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._debounceClientHeightCalculation);
    }

    componentDidUpdate() {
        setTimeout(this.calculateIntroHeight.bind(this));
    }

    calculateIntroHeight() {
        const {appState: {introHeight}, dispatch} = this.props;
        const node = findDOMNode(this.refs.introductionContainer);

        if (node) {
            const nodeHeight = node.offsetHeight;

            if (introHeight !== nodeHeight) {
                dispatch(setIntroHeight(nodeHeight));
            }
        }
    }

    render() {
        const {app, introductionText, introAppText} = this.props;
        const channelDetailsList = getAppChannelDetails(app.integrations);

        const channelsAvailable = channelDetailsList.length > 0;
        const introText = channelsAvailable ? `${introductionText} ${introAppText}` : introductionText;

        return <div className='sk-intro-section'
                    ref='introductionContainer'>
                   { app.iconUrl ? <img className='app-icon'
                                        alt='App icon'
                                        src={ app.iconUrl } />
                         : <DefaultAppIcon /> }
                   <div className='app-name'>
                       { app.name }
                   </div>
                   <div className='intro-text'
                        dangerouslySetInnerHTML={ createMarkup(introText) } />
                   { channelsAvailable ?
                         <AlternateChannels items={ channelDetailsList } /> :
                         null }
               </div>;
    }
}

export const Introduction = connect(({app, appState: {introHeight, widgetState}, ui: {text}}) => {
    return {
        app,
        appState: {
            introHeight,
            widgetState
        },
        introAppText: text.introAppText,
        introductionText: text.introductionText
    };
})(IntroductionComponent);
