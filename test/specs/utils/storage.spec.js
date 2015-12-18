import sinon from 'sinon';
import { storage } from 'utils/storage';

describe('Storage', () => {
    beforeEach(() => {
        localStorage.clear();
    });
    
    describe('with localStorage', () => {
        it('should add item to localStorage', () => {
            storage.setItem('item', 'value');
            localStorage.getItem('item').should.eq('value');
        });

        it('should remove item from localStorage', () => {
            storage.setItem('item', 'value');
            localStorage.getItem('item').should.eq('value');
            storage.removeItem('item');
            expect(localStorage.getItem('item')).to.be.null;
        });

        it('should get an item from localStorage', () => {
            localStorage.setItem('item', 'value');
            storage.getItem('item').should.eq('value');
        });
    });

    describe('without localStorage', () => {
        const sandbox = sinon.sandbox.create();

        beforeEach(() => {
            sandbox.stub(localStorage, 'setItem');
            localStorage.setItem.throws();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should add item to storage', () => {
            storage.setItem('item', 'value');
            expect(localStorage.getItem('item')).to.be.null;
            storage.getItem('item').should.eq('value');
        });

        it('should remove item from storage', () => {
            storage.setItem('item', 'value');
            expect(localStorage.getItem('item')).to.be.null;
            storage.getItem('item').should.eq('value');
            storage.removeItem('item');
            expect(storage.getItem('item')).to.be.null;
        });
    });
});
