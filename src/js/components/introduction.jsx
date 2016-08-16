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
        appState: PropTypes.object.isRequired
    };

    static contextTypes = {
        ui: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired,
        app: PropTypes.object.isRequired
    };

    constructor(...args) {
        super(...args);
        this._debounceHeightCalculation = debounce(this.calculateIntroHeight.bind(this), 400);
    }

    componentDidMount() {
        // Make sure Introduction Component has fully rendered before computing height
        setTimeout(() => {
            this.calculateIntroHeight();
        }, 200);

        window.addEventListener('resize', () => {
            this.calculateIntroHeight();
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.calculateIntroHeight());
    }

    calculateIntroHeight() {
        const {appState: {introHeight}, dispatch} = this.props;
        const node = findDOMNode(this.refs.introductionContainer);
        const nodeHeight = node.offsetHeight;

        if (introHeight !== nodeHeight) {
            dispatch(setIntroHeight(nodeHeight));
        }
    }

    render() {
        const {app, ui: {text}} = this.context;
        const channelDetailsList = getAppChannelDetails(app.integrations);

        const channelsAvailable = channelDetailsList.length > 0;
        const introText = channelsAvailable ? `${text.introductionText} ${text.introAppText}` : text.introductionText;

        return <div className='sk-intro-section'
                    ref='introductionContainer'>
                   { app.iconUrl ? <img className='app-icon'
                                        src={ app.iconUrl } />
                         : <DefaultAppIcon /> }
                   <div className='app-name'>
                       { app.name }
                   </div>
                   <div className='intro-text'
                        dangerouslySetInnerHTML={ createMarkup(introText) } />
                   { channelsAvailable ?
                         <AlternateChannels items={ channelDetailsList } />
                         : null }
               </div>;
    }
}

export const Introduction = connect(({appState: {introHeight, widgetState}}) => {
    return {
        appState: {
            introHeight,
            widgetState
        }
    };
})(IntroductionComponent);
