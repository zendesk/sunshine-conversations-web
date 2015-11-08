import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { store } from './stores/app-store';
import { Widget } from './components/widget.jsx';



function renderWidget() {
    const el = document.createElement('div');
    el.setAttribute('id', 'sk-holder');
    el.className = 'sk-noanimation';

    render(<Provider store={store}><Widget /></Provider>, el);

    document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(el);
        el.className = '';
    });

    return el;
}


export class Smooch {
    constructor() {}

    init(props) {
        return this.login(props);
    }

    login(userId, jwt) {
        return Promise.resolve().then(()=> {
          this._el = renderWidget();
        });
    }

    logout() {
        return this.login();
    }

    track() {
        return Promise.resolve()
    }

    sendMessage(text) {
        return Promise.resolve()
    }

    updateUser(props) {
        return Promise.resolve()
    }

    destroy() {
      this._el.remove();
    }
}
