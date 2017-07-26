import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import { findDOMNode } from 'react-dom';

import AlternateChannels from './AlternateChannels';
import DefaultAppIcon from './DefaultAppIcon';

import { setIntroHeight } from '../actions/app-state';

import { createMarkup } from '../utils/html';
import { getAppChannelDetails } from '../utils/app';

export class IntroductionComponent extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        appState: PropTypes.object.isRequired,
        config: PropTypes.object.isRequired,
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
        const {config, introductionText, introAppText} = this.props;
        const channelDetailsList = getAppChannelDetails(config.integrations);

        const channelsAvailable = channelDetailsList.length > 0;
        const introText = channelsAvailable ? `${introductionText} ${introAppText}` : introductionText;

        return <div className='sk-intro-section'
                    ref='introductionContainer'>
                   { config.app.iconUrl ? <img className='app-icon'
                                               alt='App icon'
                                               src={ config.app.iconUrl } />
                         : <DefaultAppIcon /> }
                   <div className='app-name'>
                       { config.app.name }
                   </div>
                   <div className='intro-text'
                        dangerouslySetInnerHTML={ createMarkup(introText) } />
                   { channelsAvailable ?
                         <AlternateChannels items={ channelDetailsList } /> :
                         null }
               </div>;
    }
}

export default connect(({config, appState: {introHeight, widgetState}, ui: {text}}) => {
    return {
        config,
        appState: {
            introHeight,
            widgetState
        },
        introAppText: text.introAppText,
        introductionText: text.introductionText
    };
})(IntroductionComponent);
