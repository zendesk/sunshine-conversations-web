import React from 'react';
import TestUtils from 'react-addons-test-utils';

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
