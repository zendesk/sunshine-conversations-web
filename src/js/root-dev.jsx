import React, { Component } from 'react';
import { Widget } from 'components/widget.jsx';
import { store } from 'stores/app-store';
import { Provider } from 'react-redux';
import { DevTools } from 'components/dev-tools';

export class Root extends Component {
    render() {
        const {store} = this.props;
        return (
            <Provider store={ store }>
                <div>
                    <Widget />
                    <DevTools />
                </div>
            </Provider>
            );
    }
}
