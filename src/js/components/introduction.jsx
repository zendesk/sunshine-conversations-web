import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { AlternateChannels } from './alternate-channels';
import { createMarkup } from '../utils/html';
import { defaultAppIcon, defaultAppIcon2x } from '../constants/assets';
import { getAppChannelDetails } from '../utils/app';

class IntroductionComponent extends Component {
    static propTypes = {
        app: PropTypes.object.isRequired,
        integrations: PropTypes.array.isRequired
    }

    static contextTypes = {
        ui: PropTypes.object
    }

    render() {
        const {app, integrations} = this.props;
        const {ui: {text}} = this.context;
        const channelDetailsList = getAppChannelDetails(integrations);

        const channelsAvailable = channelDetailsList.length > 0;
        const introText = channelsAvailable ? `${text.introText} ${text.introAppText}` : text.introText;

        return <div className='sk-intro-section'>
                   <img className='app-icon'
                        src={ app.iconUrl || defaultAppIcon }
                        srcSet={ `${app.iconUrl || defaultAppIcon} 1x, ${app.iconUrl || defaultAppIcon2x} 2x` } />
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
