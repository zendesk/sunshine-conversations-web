import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { EmailSettings } from './email-settings';
import { NotificationsSettings } from './notifications-settings';
import { hasChannels } from '../utils/app';

export class SettingsComponent extends Component {

    static propTypes = {
        settings: PropTypes.object.isRequired
    };

    render() {
        const {settings} = this.props;
        const settingsComponent = hasChannels(settings) ? <NotificationsSettings /> : <EmailSettings />;

        return <div className='sk-settings'>
                   { settingsComponent }
               </div>;
    }
}

export const Settings = connect(({app}) => {
    return {
        settings: app.settings.web
    };
})(SettingsComponent);
