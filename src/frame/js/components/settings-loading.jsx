import React, { Component } from 'react';

import { Loading } from './loading';

export class SettingsLoading extends Component {
    render() {
        return <div className='content-wrapper'>
                   <div className='settings-wrapper'>
                       <Loading />
                   </div>
               </div>;
    }
}
