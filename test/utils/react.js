import React from 'react';
import TestUtils from 'react-addons-test-utils';

export function scryRenderedDOMComponentsWithId(tree, id) {
    return TestUtils.findAllInRenderedTree(tree, function(inst) {
        return TestUtils.isDOMComponent(inst) && inst.getAttribute('id') === id;
    });
}

export function findRenderedDOMComponentsWithId(tree, id) {
    let components = scryRenderedDOMComponentsWithId(tree, id);
    return components.length > 0 ? components[0] : undefined;
}

export function mockComponent(sinon, module, mockTagName = 'div', props = null) {
    return sinon.stub(module.prototype, 'render', function() {
        return React.createElement(
        mockTagName,
        props,
        this.props.children
        );
    });
}
