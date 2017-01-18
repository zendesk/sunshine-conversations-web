import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { AlternateChannels } from '../../../src/js/components/alternate-channels';
import { getAppChannelDetails } from '../../../src/js/utils/app';
import * as appService from '../../../src/js/services/app';

const sandbox = sinon.sandbox.create();


describe('AlternateChannels Component', () => {

    beforeEach(() => {
        sandbox.stub(appService, 'showChannelPage');
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should render no items if no channels', () => {
        const component = TestUtils.renderIntoDocument(<AlternateChannels items={ [] } />);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-icon').length.should.be.eq(0);
    });

    it('should render all the channels and call showChannelPage with channel type when clicked', () => {
        const channels = [{
            type: 'messenger'
        }, {
            type: 'telegram'
        }];

        const items = getAppChannelDetails(channels);
        const component = TestUtils.renderIntoDocument(<AlternateChannels items={ items } />);
        const itemComponents = TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-icon');
        itemComponents.length.should.be.eq(2);

        itemComponents.forEach((c, index) => {
            TestUtils.Simulate.click(c);
            appService.showChannelPage.should.have.been.calledWith(channels[index].type);
        });
    });

});
