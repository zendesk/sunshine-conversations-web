import React, { Component } from 'react';
import { connect } from 'react-redux';

import { immediateUpdate } from 'services/user-service';
import { setUser } from 'actions/user-actions';

export class SettingsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.user.email
        };

        this.onChange = this.onChange.bind(this);
        this.save = this.save.bind(this);
    }

    onChange(e) {
      this.setState({
        email: e.target.value
      });
    }

    save(e) {
        e.preventDefault();

        // TODO : add validation

        immediateUpdate({
            email: this.state.email
        }).then((response) => {
            this.props.dispatch(setUser(response.appUser));
        });
    }

    render() {
        return (
            <div id="sk-settings">
                <div className="settings-wrapper">
                    <p>
                        { this.props.ui.readOnlyEmail ? this.props.ui.text.settingsReadOnlyText : this.props.ui.text.settingsText }
                    </p>
                    <form onSubmit={this.save}>
                        <div className="input-group">
                            <i className="fa fa-envelope-o before-icon"></i>
                            <input type="text" placeholder={this.props.ui.text.settingsInputPlaceholder} className="input email-input" onChange={this.onChange} value={this.state.email} />
                        </div>

                        <div className="input-group">
                            <button type="button" className="btn btn-sk-primary" onClick={ this.save }>{ this.props.ui.text.settingsSaveButtonText }</button>
                            <span className="form-message"></span>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export const Settings = connect((state) => {
    return {
        ui: state.ui,
        user: state.user
    }
})(SettingsComponent);
