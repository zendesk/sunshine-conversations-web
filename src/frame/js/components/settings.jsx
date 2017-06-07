import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { SettingsLoading } from './settings-loading';
import { hasChannels } from '../utils/app';

let NotificationsSettings;
let EmailSettings;

export class SettingsComponent extends Component {
    static propTypes = {
        settings: PropTypes.object.isRequired
    };

    state = {
        hasComponent: !!this.getComponent()
    };

    componentWillMount() {
        if(!this.state.hasComponent) {
            this.loadComponent();
        }
    }

    componentWillUpdate(nextProps) {
        if(!this.getComponent(nextProps)) {
            this.loadComponent();
        }
    }

    loadComponent(props = this.props) {
        const {settings} = props;
        if(hasChannels(settings)) {
            import('./notifications-settings')
                .then((Component) => {
                    NotificationsSettings = Component.NotificationsSettings;
                    this.setState({hasComponent: true});
                });
        } else {
            import('./email-settings')
                .then((Component) => {
                    EmailSettings = Component.EmailSettings;
                    this.setState({hasComponent: true});
                });
        }
    }

    getComponent(props = this.props) {
        const {settings} = props;
        return hasChannels(settings) ? NotificationsSettings : EmailSettings;
    }

    render() {
        const SettingsComponent = this.getComponent();

        return <div className='sk-settings'>
                   { SettingsComponent ? <SettingsComponent /> : <SettingsLoading /> }
               </div>;
    }
}

export const Settings = connect(({app}) => {
    return {
        settings: app.settings.web
    };
})(SettingsComponent);
