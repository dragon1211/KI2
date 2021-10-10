import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Side from '../component/side';

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
import ProfileWithdrawalComplete from '../parent/profile/withdrawal_complete';

import { BrowserRouter, Route, Switch } from 'react-router-dom'
export default class App extends Component {
    render() {
        return (
            <main className="l-container">
                <BrowserRouter>
                    <Switch>
                        <Route exact path='/p-account' component={Meeting} />
                        <Route exact path='/p-account/meeting' component={Meeting} />
                        <Route exact path='/p-account/meeting/detail/:id' component={MeetingDetail} />
                        <Route exact path='/p-account/meeting/new' component={MeetingAdd} />
                        <Route exact path='/p-account/meeting/edit/:id' component={MeetingEdit} />

                        <Route exact path='/p-account/favorite' component={Favorite} />
                        <Route exact path='/p-account/search' component={Search} />

                        <Route exact path='/p-account/child' component={Child} />
                        <Route exact path='/p-account/child/add' component={ChildAdd} />
                        <Route exact path='/p-account/child/edit/hire-date/:id' component={ChildEdit} />
                        <Route exact path='/p-account/child/detail/:id' component={ChildDetail} />

                        <Route exact path='/p-account/profile' component={Profile} />
                        <Route exact path='/p-account/profile/edit/:id' component={ProfileEdit} />
                        <Route exact path='/p-account/profile/edit/password/:id' component={ProfilePasswordEdit} />
                        <Route exact path='/p-account/profile/withdrawal' component={ProfileWithdrawal} />
                        <Route exact path='/p-account/profile/withdrawal/complete' component={ProfileWithdrawalComplete} />
                    </Switch>
                    <Side />
                </BrowserRouter>
            </main>
        );
    }
}

if(document.getElementById('p-app')){
	ReactDOM.render(
		<App />,
		document.getElementById('p-app')
	)
}