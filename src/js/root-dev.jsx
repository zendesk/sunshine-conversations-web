import React, { Component } from 'react';
import { Widget } from 'components/widget.jsx';
import { store } from 'stores/app-store';
import { Provider } from 'react-redux';
import { DevTools } from 'components/dev-tools';

export class Root extends Component {
    render() {
        const {store} = this.props;
        const style = {
            height: '100%'
        };
        return (
            <Provider store={ store }>
                <div style={ style }>
                    <Widget />
                    <DevTools />
                </div>
            </Provider>
            );
    }
}
