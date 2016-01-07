import React, { Component } from 'react';
import { Widget } from 'components/widget.jsx';
import { Provider } from 'react-redux';

export class Root extends Component {
    render() {
        const {store} = this.props;
        return (
            <Provider store={ store }>
                <Widget />
            </Provider>
            );
    }
}
