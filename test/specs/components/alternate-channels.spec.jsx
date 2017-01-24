import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { AlternateChannels } from '../../../src/js/components/alternate-channels';
import { getAppChannelDetails } from '../../../src/js/utils/app';
import * as appService from '../../../src/js/services/app';

import { wrapComponentWithStore } from '../../utils/react';
import { createMockedStore } from '../../utils/redux';

const sandbox = sinon.sandbox.create();


describe('AlternateChannels Component', () => {
    let mockedStore;

    beforeEach(() => {
        sandbox.stub(appService, 'showChannelPage');
        mockedStore = createMockedStore(sandbox);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should render no items if no channels', () => {
        const component = wrapComponentWithStore(AlternateChannels, {
            items: []
        }, mockedStore);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-icon').length.should.be.eq(0);
    });

    it('should render all the channels and call showChannelPage with channel type when clicked', () => {
        const channels = [{
            type: 'messenger'
        }, {
            type: 'telegram'
        }];

        const items = getAppChannelDetails(channels);
        const component = wrapComponentWithStore(AlternateChannels, {
            items
        }, mockedStore);

        const itemComponents = TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-icon');
        itemComponents.length.should.be.eq(2);

        itemComponents.forEach((c, index) => {
            TestUtils.Simulate.click(c);
            appService.showChannelPage.should.have.been.calledWith(channels[index].type);
        });
    });

});
