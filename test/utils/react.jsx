import React from 'react';
import TestUtils from 'react-addons-test-utils';
import sinon from 'sinon';
import _ from 'underscore';
import { ParentComponentWithContext } from './parent-component';

export function scryRenderedDOMComponentsWithId(tree, id) {
    return TestUtils.findAllInRenderedTree(tree, function(inst) {
        return TestUtils.isDOMComponent(inst) && inst.getAttribute('id') === id;
    });
}

export function scryRenderedDOMComponentsWithAttribute(tree, attr, value = '') {
    return TestUtils.findAllInRenderedTree(tree, function(inst) {
        return TestUtils.isDOMComponent(inst) && inst.getAttribute(attr) === value;
    });
}

export function findRenderedDOMComponentsWithId(tree, id) {
    const components = scryRenderedDOMComponentsWithId(tree, id);
    return components.length > 0 ? components[0] : undefined;
}

export function mockComponent(sinon, module, mockTagName = 'div', props = null) {
    module.prototype.componentDidMount && sinon.stub(module.prototype, 'componentDidMount');
    module.prototype.componentDidUpdate && sinon.stub(module.prototype, 'componentDidUpdate');

    return sinon.stub(module.prototype, 'render', function() {
        return React.createElement(
            mockTagName,
            props,
            this.props.children
        );
    });
}

export function getContext(context = {}) {
    const defaultContext = {
        app: {},
        settings: {},
        ui: {}
    };

    return {
        ...defaultContext,
        ...context
    };
}

export function wrapComponentWithContext(Component, props, context) {
    const wrapper = TestUtils.renderIntoDocument(
        <ParentComponentWithContext context={ context }
                                    withRef={ true }>
            <Component {...props} />
        </ParentComponentWithContext>
    );

    return wrapper.getWrappedInstance();
}

export function watchConsole() {
    sinon.spy(console, 'error'); // ensure that we don't swallow up console error output

    sinon.spy(console, 'warn'); // ensure that we don't swallow up console warn output
}

export function getReactWarningErrorArray() {
    const errors = _.times(console.error.callCount, (index) => console.error.getCall(index));
    const warnings = _.times(console.warn.callCount, (index) => console.warn.getCall(index));

    return errors.concat(warnings)
        .filter((c) => (c.args && c.args.length && /(Invalid|Failed)/gi.test(c.args[0])))
        .map((c) => c.args.join('|'));
}

export function unwatchConsole() {
    if (console.error.restore) {
        console.error.restore();
    }

    if (console.warn.restore) {
        console.warn.restore();
    }
}
