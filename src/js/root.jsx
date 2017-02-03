import React, { Component } from 'react';
import { Provider } from 'react-redux';

import { Widget } from './components/widget';

export class Root extends Component {
    render() {
        const {store} = this.props;
        return <Provider store={ store }>
                   <Widget />
               </Provider>;
    }
}
