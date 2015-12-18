import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { hideSettingsNotification } from 'actions/app-state-actions';

export class EmailNotificationComponent extends Component {
  componentDidMount() {
    // TODO : handle slide down
  }
  componentWillUnmount() {
    // TODO : handle slide up
  }

  render() {
    return (
      <div className="sk-notifications">
        <p>
          { this.props.ui.text.settingsNotificationText }
          <a href="#" className="sk-notification-close" onClick={this.props.actions.hideSettingsNotification}>&times;</a>
        </p>
      </div>
    );
  }
}

export const EmailNotification = connect((state) => {
    return {
      ui: state.ui
    }
}, (dispatch) => {
    return {
      actions: bindActionCreators({ hideSettingsNotification }, dispatch)
    };
})(EmailNotificationComponent);
