import sinon from 'sinon';
import React from 'react';
import { findDOMNode } from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { ImageUpload } from '../../../src/js/components/image-upload';
const conversationService = require('../../../src/js/services/conversation-service');

const sandbox = sinon.sandbox.create();

xdescribe('ChatInput', () => {
    var component;

    var onImageChangeSpy;

    beforeEach(() => {
        onImageChangeSpy = sandbox.spy(ImageUpload.prototype, 'onImageChange');

        sandbox.stub(conversationService, 'uploadImage').resolves();

        component = TestUtils.renderIntoDocument(<ImageUpload />);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should call onImageChange when selecting an image', () => {
        const fileInput = findDOMNode(component.refs.fileInput);
        TestUtils.Simulate.change(fileInput);
        onImageChangeSpy.should.have.been.calledOnce;
    });

    it('should call form reset after upload', () => {
        const resetSpy = sandbox.spy(component.refs.imageUploadForm, 'reset');
        return component.onImageChange({
            preventDefault: () => {
            }
        }).then(() => {
            resetSpy.should.have.been.calledOnce;
        });

    });
});
