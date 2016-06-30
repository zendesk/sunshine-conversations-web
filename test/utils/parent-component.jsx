import React, { PropTypes, Component } from 'react';

// Element with context:
// component = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
//                                               <ActionComponent {...props} />
//                                          </ParentComponentWithContext>);

// If you need to test functions:
// component = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
//                                                                      store={ mockedStore }
//                                                                      withRef={ true }
//                                                                      <ActionComponent {...props} />
//                                          </ParentComponentWithContext>);
// component.getWrappedInstance().someFunction();

export class ParentComponentWithContext extends Component {

    static propTypes = {
        context: PropTypes.object.isRequired,
        withRef: PropTypes.bool
    };

    static childContextTypes = {
        app: PropTypes.object,
        settings: PropTypes.object,
        ui: PropTypes.object,
        store: PropTypes.object
    };

    getChildContext() {
        return this.props.context;
    }

    getWrappedInstance() {
        if (this.props.withRef) {
            return this.refs.childElement;
        }

        throw new Error('Must use `withRef` to acccess wrapped component');
    }

    render() {
        const {children, withRef} = this.props;

        // If we need to use functions on the child element, then add a 'ref' propType
        const childElement = withRef ?
            React.Children.map(
                children, (child) => {
                    return React.cloneElement(child, {
                        ref: 'childElement'
                    });
                }) :
            children;

        return <div>
                   { childElement }
               </div>;
    }
}
