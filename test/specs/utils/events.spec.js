import sinon from 'sinon';

import { Observable } from '../../../src/js/utils/events';


describe('Events utils', () => {
    const sandbox = sinon.sandbox.create();
    let clock;
    beforeEach(() => {
        clock = sandbox.useFakeTimers();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('Observable', () => {
        it('should register and trigger events', () => {
            const firstHandler = sandbox.spy();
            const secondHandler = sandbox.spy();
            const thirdHandler = sandbox.spy();
            const fourthHandler = sandbox.spy();

            const observable = new Observable();

            observable.on('1', firstHandler);
            observable.on('1', secondHandler);
            observable.on('2', thirdHandler);
            observable.on('2', fourthHandler);
            observable.trigger('1');
            clock.tick(20);

            firstHandler.should.have.been.calledOnce;
            secondHandler.should.have.been.calledOnce;
            thirdHandler.should.not.have.been.called;
            fourthHandler.should.not.have.been.called;

            firstHandler.reset();
            secondHandler.reset();
            thirdHandler.reset();
            fourthHandler.reset();

            observable.trigger('2');
            clock.tick(20);
            firstHandler.should.not.have.been.called;
            secondHandler.should.not.have.been.called;
            thirdHandler.should.have.been.calledOnce;
            fourthHandler.should.have.been.calledOnce;

            firstHandler.reset();
            secondHandler.reset();
            thirdHandler.reset();
            fourthHandler.reset();

            observable.off('1', firstHandler);
            observable.trigger('1');
            clock.tick(20);

            firstHandler.should.not.have.been.called;
            secondHandler.should.have.been.calledOnce;
            thirdHandler.should.not.have.been.called;
            fourthHandler.should.not.have.been.called;

            firstHandler.reset();
            secondHandler.reset();
            thirdHandler.reset();
            fourthHandler.reset();

            observable.off('2');
            observable.trigger('2');
            clock.tick(20);

            firstHandler.should.not.have.been.called;
            secondHandler.should.not.have.been.calledOnce;
            thirdHandler.should.not.have.been.calledOnce;
            fourthHandler.should.not.have.been.calledOnce;

            firstHandler.reset();
            secondHandler.reset();
            thirdHandler.reset();
            fourthHandler.reset();

            observable.off();
            observable.trigger('1');
            clock.tick(20);

            firstHandler.should.not.have.been.called;
            secondHandler.should.not.have.been.calledOnce;
            thirdHandler.should.not.have.been.calledOnce;
            fourthHandler.should.not.have.been.calledOnce;
        });
    });
});
