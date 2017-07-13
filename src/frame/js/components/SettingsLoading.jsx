import React, { Component } from 'react';

import Loading from './Loading';

export default class SettingsLoading extends Component {
    render() {
        return <div className='content-wrapper'>
                   <div className='settings-wrapper'>
                       <Loading />
                   </div>
               </div>;
    }
}
