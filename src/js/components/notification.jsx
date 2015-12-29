import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { createMarkup } from 'utils/html';

import { hideSettingsNotification, showSettings } from 'actions/app-state-actions';

export class NotificationComponent extends Component {
  bindHandler() {
    if (this.props.appState.settingsNotificationVisible) {
      let node = findDOMNode(this);
      let linkNode = node.querySelector('[data-ui-settings-link]');
      
      if (linkNode) {
        linkNode.onclick = this.onLinkClick.bind(this);
      }
    }
  }

  componentDidMount() {
    this.bindHandler();
  }

  componentDidUpdate() {
    this.bindHandler();
  }


  onLinkClick(e) {
    e.preventDefault();

    this.props.actions.hideSettingsNotification();
    this.props.actions.showSettings();
  }

  render() {
    let content = this.props.appState.settingsNotificationVisible ? (
      <div key="content" className="sk-notifications">
        <p>
          <span ref="text" dangerouslySetInnerHTML={createMarkup(this.props.ui.text.settingsNotificationText)}></span>
          <a href="#" className="sk-notification-close" onClick={this.props.actions.hideSettingsNotification}>&times;</a>
        </p>
      </div>
    ) : null;
    return (
      <ReactCSSTransitionGroup
        component="div"
        className="sk-notification-container"
        transitionName="notification"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}>
        {content}
      </ReactCSSTransitionGroup>
    );
  }
}

export const Notification = connect((state) => {
    return {
      ui: state.ui,
      appState: state.appState
    }
}, (dispatch) => {
    return {
      actions: bindActionCreators({ hideSettingsNotification, showSettings }, dispatch)
    };
})(NotificationComponent);
