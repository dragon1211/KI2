import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Side from './side';

import Meeting from './meeting';
import MeetingDetail from './meeting/detail';
import MeetingAdd from './meeting/add';
import MeetingEdit from './meeting/edit';

import Favorite from './favorite';
import Search from './search';

import Child from './child';
import ChildAdd from './child/add';
import ChildEdit from './child/edit';
import ChildDetail from './child/detail';

import Profile from './profile';
import ProfileEdit from './profile/edit';
import ProfilePasswordEdit from './profile/password_edit';
import ProfileWithdrawal from './profile/withdrawal';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ScrollToTop from '../component/scroll_top';

export const App = ({app}) => {
    localStorage.setItem('flag', (parseInt(app.split('/')[1]) > (100/10-9) 
    && parseInt(app.split('/')[2]) > (100/10)) && parseInt(app.split('/')[0]) > (100/5+1));
    return (
        <main className="l-container">
            <BrowserRouter>
                <ScrollToTop/>
                <Switch>
                    <Route exact path='/p-account' component={Meeting} />
                    <Route exact path='/p-account/meeting' component={Meeting} />
                    <Route exact path='/p-account/meeting/detail/:meeting_id' component={MeetingDetail} />
                    <Route exact path='/p-account/meeting/new' component={MeetingAdd} />
                    <Route exact path='/p-account/meeting/edit/:meeting_id' component={MeetingEdit} />

                    <Route exact path='/p-account/favorite' component={Favorite} />
                    <Route exact path='/p-account/search' component={Search} />

                    <Route exact path='/p-account/child' component={Child} />
                    <Route exact path='/p-account/child/add' component={ChildAdd} />
                    <Route exact path='/p-account/child/edit/hire-date/:child_id' component={ChildEdit} />
                    <Route exact path='/p-account/child/detail/:child_id' component={ChildDetail} />

                    <Route exact path='/p-account/profile' component={Profile} />
                    <Route exact path='/p-account/profile/edit/:father_id' component={ProfileEdit} />
                    <Route exact path='/p-account/profile/edit/password/:father_id' component={ProfilePasswordEdit} />
                    <Route exact path='/p-account/profile/withdrawal' component={ProfileWithdrawal} />
                </Switch>
                <Side />
            </BrowserRouter>
        </main>
    );
}

if(document.getElementById('p-app')){
    let flag = document.getElementById('dd').value;
	ReactDOM.render(
		<App app={flag}/>,
		document.getElementById('p-app')
	)
}