import sinon from 'sinon';

import { getItem, setItem, removeItem } from '../../../src/frame/js/utils/storage';

describe('Storage', () => {
    beforeEach(() => {
        global.localStorage.clear();
    });

    describe('with localStorage', () => {
        it('should add item to localStorage', () => {
            setItem('item', 'value');
            localStorage.getItem('item').should.eq('value');
        });

        it('should remove item from localStorage', () => {
            setItem('item', 'value');
            localStorage.getItem('item').should.eq('value');
            removeItem('item');
            expect(localStorage.getItem('item')).to.be.null;
        });

        it('should get an item from localStorage', () => {
            localStorage.setItem('item', 'value');
            getItem('item').should.eq('value');
        });
    });

    describe('without localStorage', () => {
        const sandbox = sinon.sandbox.create();

        // Chrome doesn't like stubbing localStorage...
        // We're doing it the monkey way.
        const localStorageSetItem = localStorage.setItem.bind(localStorage);

        before(() => {
            localStorage.setItem = () => {
                throw new Error();
            };
        });

        afterEach(() => {
            sandbox.restore();
        });

        after(() => {
            localStorage.setItem = localStorageSetItem;
        });

        it('should add item to storage', () => {
            setItem('item', 'value');
            expect(localStorage.getItem('item')).to.be.null;
            getItem('item').should.eq('value');
        });

        it('should remove item from storage', () => {
            localStorageSetItem('item', 'value');
            expect(localStorage.getItem('item')).to.eq('value');
            getItem('item').should.eq('value');
            removeItem('item');
            expect(getItem('item')).to.be.null;
        });
    });
});
