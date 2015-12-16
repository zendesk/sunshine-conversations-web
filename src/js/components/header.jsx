import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleWidget, showSettings, hideSettings } from '../actions/app-state-actions'


export class HeaderComponent extends Component {
    constructor(props) {
        super(props);
        this.actions = this.props.actions;

        this.showSettings = this.showSettings.bind(this);
        this.hideSettings = this.hideSettings.bind(this);
    }

    showSettings(e) {
        e.stopPropagation();
        this.actions.showSettings();
    }

    hideSettings(e) {
        e.stopPropagation();
        this.actions.hideSettings();
    }

    render() {
        const settingsButton = this.props.appState.settingsEnabled && !this.props.appState.settingsVisible  ? (
            <div id="sk-notification-badge" onClick={this.showSettings}><i className="fa fa-gear"></i></div>
            ) : '';

        const backButton = this.props.appState.settingsEnabled && this.props.appState.settingsVisible ? (
            <div className="sk-back-handle" onClick={this.hideSettings}><i className="fa fa-arrow-left"></i></div>
            ) : '';

        const closeHandle = this.props.appState.widgetOpened ? (
          <div className="sk-close-handle sk-close-hidden"><i className="fa fa-times"></i></div>
        ) : (
          <div className="sk-show-handle sk-appear-hidden"><i className="fa fa-arrow-up"></i></div>
        );

        return (
            <div id={ this.props.appState.settingsVisible ? 'sk-settings-header' : 'sk-header'} onClick={this.actions.toggleWidget}>
                { settingsButton }
                { backButton }
                { this.props.appState.settingsVisible ? this.props.ui.text.settingsHeaderText : this.props.ui.text.headerText }
                { closeHandle }
            </div>
        );
    }
}

function mapStateToProps(state) {
  return { ui: state.ui, appState: state.appState }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ toggleWidget, showSettings, hideSettings }, dispatch) }
}

export const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)
