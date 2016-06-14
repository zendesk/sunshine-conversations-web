import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import { findDOMNode } from 'react-dom';

import { AlternateChannels } from './alternate-channels';
import { createMarkup } from '../utils/html';
import { getAppChannelDetails } from '../utils/app';
import { DefaultAppIcon } from './default-app-icon';
import { setIntroHeight } from '../actions/app-state-actions';

class IntroductionComponent extends Component {
    static propTypes = {
        app: PropTypes.object.isRequired,
        integrations: PropTypes.array.isRequired,
        dispatch: PropTypes.func.isRequired
    }

    static contextTypes = {
        ui: PropTypes.object,
        settings: PropTypes.object
    }

    constructor(...args) {
        super(...args);

        this._debounceHeightCalculation = debounce(this.calculateIntroHeight.bind(this), 150);
    }

    componentDidMount() {
        setTimeout(() => this.calculateIntroHeight());
        window.addEventListener('resize', this._debounceHeightCalculation);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._debounceHeightCalculation);
    }

    calculateIntroHeight() {
        const node = findDOMNode(this);

        const nodeRect = node.getBoundingClientRect();
        const nodeHeight = Math.floor(nodeRect.height);

        this.props.dispatch(setIntroHeight(nodeHeight));
    }

    render() {
        const {app, integrations} = this.props;
        const {ui: {text}, settings: {accentColor}} = this.context;
        const channelDetailsList = getAppChannelDetails(integrations);
        const channelsAvailable = channelDetailsList.length > 0;
        const introText = channelsAvailable ? `${text.introText} ${text.introAppText}` : text.introText;

        return <div className='sk-intro-section'>
                   { app.iconUrl ? <img className='app-icon'
                                        src={ app.iconUrl } />
                         : <DefaultAppIcon color={ accentColor } /> }
                   <div className='app-name'>
                       { app.name || 'Smooch Technologies Inc.' }
                   </div>
                   <div className='intro-text'
                        dangerouslySetInnerHTML={ createMarkup(introText) } />
                   { channelsAvailable ?
                         <AlternateChannels items={ channelDetailsList } />
                         : null }
               </div>;
    }
}

export const Introduction = connect((state) => {
    return {
        app: state.app,
        integrations: state.app.integrations
    };
})(IntroductionComponent);
