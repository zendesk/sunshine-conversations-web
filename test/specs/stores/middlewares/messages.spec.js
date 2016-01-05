import sinon from 'sinon';
import { firstMessage } from 'stores/middlewares/messages';
import { addMessage } from 'actions/conversation-actions';
import { SHOW_SETTINGS_NOTIFICATION } from 'actions/app-state-actions';
import { getMockedStore } from 'test/utils/redux';

const sandbox = sinon.sandbox.create();

function getScenarioName(scenario) {
    let messageType = scenario.state.conversation.messages.filter(message => message.role === 'appUser').length === 1 ?
        `first appUser message` :
        'not first message';
    let settingsState = scenario.state.appState.settingsEnabled ? 'settings enabled' : 'settings disabled';
    let emailState = scenario.state.user.email ? 'email set' : 'email not set';

    // since the dispatch function is a no op, the last message in the state is assumed to be the last message dispatched
    let role = scenario.state.conversation.messages[scenario.state.conversation.messages.length - 1].role;
    let messageRole = `dispatching message with ${role} role`;

    return `${messageType}, ${settingsState}, ${emailState}, ${messageRole}`;
}


describe('Messages middleware', () => {
    let nextSpy;
    let store;
    let middlewareFn;

    beforeEach(() => {
        nextSpy = sandbox.spy();
    });

    afterEach(() => {
        sandbox.reset();
    });

    [{
        description: 'First message by appUser',
        state: {
            appState: {
                settingsEnabled: true
            },
            user: {
                email: undefined
            },
            conversation: {
                messages: [
                    {
                        role: 'appUser'
                    }
                ]
            }
        },
        outcome: true
    }, {
        description: 'Multiple messages by appUser',
        state: {
            appState: {
                settingsEnabled: true
            },
            user: {
                email: undefined
            },
            conversation: {
                messages: [
                    {
                        role: 'appUser'
                    },
                    {
                        role: 'appUser'
                    }
                ]
            }
        },
        outcome: false
    }, {
        description: 'Multiple messages by appMaker, but first by appUser',
        state: {
            appState: {
                settingsEnabled: true
            },
            user: {
                email: undefined
            },
            conversation: {
                messages: [
                    {
                        role: 'appMaker'
                    },
                    {
                        role: 'appMaker'
                    },
                    {
                        role: 'appUser'
                    }
                ]
            }
        },
        outcome: true
    }, {
        description: 'Email set',
        state: {
            appState: {
                settingsEnabled: true
            },
            user: {
                email: 'test@test.com'
            },
            conversation: {
                messages: [
                    {
                        role: 'appUser'
                    }
                ]
            }
        },
        outcome: false
    }, {
        description: 'First message by appMaker',
        state: {
            appState: {
                settingsEnabled: true
            },
            user: {
                email: undefined
            },
            conversation: {
                messages: [
                    {
                        role: 'appMaker'
                    }
                ]
            }
        },
        outcome: false
    }, {
        description: 'Settings disabled',
        state: {
            appState: {
                settingsEnabled: false
            },
            user: {
                email: undefined
            },
            conversation: {
                messages: [
                    {
                        role: 'appUser'
                    }
                ]
            }
        },
        outcome: false
    }].forEach((scenario) => {

        describe(`${scenario.description}: ${getScenarioName(scenario)}`, () => {
            beforeEach(() => {
                store = getMockedStore(sandbox, Object.assign({}, scenario.state));

                middlewareFn = firstMessage(store)(nextSpy);
            });

            it(`should ${scenario.outcome ? '' : 'not'} call dispatch with showSettingsNotification`, () => {
                middlewareFn(addMessage({
                    role: scenario.state.conversation.messages[scenario.state.conversation.messages.length - 1].role
                }));

                if (scenario.outcome) {
                    store.dispatch.should.have.been.calledWith({
                        type: SHOW_SETTINGS_NOTIFICATION
                    });
                } else {
                    store.dispatch.should.not.have.been.called;
                }
            });
        });

    });


});
