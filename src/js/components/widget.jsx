import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Header } from './header.jsx';
import { EmailNotification } from './notification.jsx';

class WidgetComponent extends Component {
  render() {
    const notification = this.props.appState.settingsNotificationVisible ? <EmailNotification /> : '';
    return (
      <div id="sk-container" className={this.props.appState.widgetOpened ? 'sk-appear' : 'sk-close'}>
        <div id="sk-wrapper">
          <Header />
          { notification }
        </div>
      </div>
    )
  }
}

export const Widget = connect((state) => {
    return {
      appState: state.appState
    } 
})(WidgetComponent);
