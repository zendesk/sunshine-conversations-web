import sinon from 'sinon';
import { findDOMNode } from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { ImageUpload, ImageUploadComponent } from '../../../src/js/components/image-upload';
const conversationService = require('../../../src/js/services/conversation');

import { wrapComponentWithStore } from '../../utils/react';
import { createMockedStore } from '../../utils/redux';

const sandbox = sinon.sandbox.create();

describe('Image Upload Component', () => {
    let component;
    let mockedStore;
    let onImageChangeSpy;

    beforeEach(() => {
        mockedStore = createMockedStore(sandbox);
        onImageChangeSpy = sandbox.spy(ImageUploadComponent.prototype, 'onImageChange');

        sandbox.stub(conversationService, 'uploadImage').resolves();
        component = wrapComponentWithStore(ImageUpload, {}, mockedStore).getWrappedInstance();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should call onImageChange when selecting an image', () => {
        const fileInput = findDOMNode(component._fileInputNode);
        TestUtils.Simulate.change(fileInput);
        onImageChangeSpy.should.have.been.calledOnce;
    });

    it('should call form reset after upload', () => {
        const resetSpy = sandbox.spy(component. _formNode, 'reset');
        return component.onImageChange({
            preventDefault: () => {
            }
        }).then(() => {
            resetSpy.should.have.been.calledOnce;
        });

    });
});
