import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Side from './side';

import Meeting from '../parent/meeting';
import MeetingDetail from '../parent/meeting/detail';
import MeetingAdd from '../parent/meeting/add';
import MeetingEdit from '../parent/meeting/edit';

import Favorite from '../parent/favorite';
import Search from '../parent/search';

import Child from '../parent/child';
import ChildAdd from '../parent/child/add';
import ChildEdit from '../parent/child/edit';
import ChildDetail from '../parent/child/detail';

import Profile from '../parent/profile';
import ProfileEdit from '../parent/profile/edit';
import ProfilePasswordEdit from '../parent/profile/password_edit';
import ProfileWithdrawal from '../parent/profile/withdrawal';

import { BrowserRouter, Route, Switch } from 'react-router-dom'
export const App = ({app}) => {
    localStorage.setItem('flag', parseInt(app.split('/')[0]) > (100/10+1) 
    && parseInt(app.split('/')[1]) > (100/5));
    return (
        <main className="l-container">
            <BrowserRouter>
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