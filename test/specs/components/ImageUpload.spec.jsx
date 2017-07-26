import sinon from 'sinon';
import { findDOMNode } from 'react-dom';
import TestUtils from 'react-dom/test-utils';

import ImageUpload, { ImageUploadComponent, __Rewire__ as ImageUploadRewire } from '../../../src/frame/js/components/ImageUpload';

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
        ImageUploadRewire('uploadImage', sandbox.stub().returnsAsyncThunk());
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
        const resetSpy = sandbox.spy(component._formNode, 'reset');
        return component.onImageChange({
            preventDefault: () => {
            }
        }).then(() => {
            resetSpy.should.have.been.calledOnce;
        });

    });
});
