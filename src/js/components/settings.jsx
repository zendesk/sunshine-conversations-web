import React, { Component, PropTypes } from 'react';

import { EmailSettings } from './email-settings';
import { NotificationsSettings } from './notifications-settings';
import { hasChannels } from '../utils/app';

export class Settings extends Component {
    static contextTypes = {
        settings: PropTypes.object
    };

    static propTypes = {
        className: PropTypes.string
    };

    render() {
        const {settings} = this.context;
        const settingsComponent = hasChannels(settings) ? <NotificationsSettings /> : <EmailSettings />;

        return <div className='sk-settings'>
                   { settingsComponent }
               </div>;
    }
}
