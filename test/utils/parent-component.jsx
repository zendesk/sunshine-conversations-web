import { Provider } from 'react-redux';
import React, { PropTypes, Component } from 'react';

export class ParentComponentWithContext extends Component {

    static propTypes = {
        context: PropTypes.object
    };

    static childContextTypes = {
        app: PropTypes.object,
        settings: PropTypes.object,
        ui: PropTypes.object
    };

    getChildContext() {
        return this.props.context;
    }

    render() {
        return (
            <Provider store={ this.props.store }>
                <div>
                    { this.props.children }
                </div>
            </Provider>
        );
    }
}