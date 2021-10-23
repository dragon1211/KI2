import React, { Component } from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Meeting from './meeting';
import MeetingDetail from './meeting/detail';
import MeetingEdit from './meeting/edit';

import Child from './child';
import ChildDetail from './child/detail';
import ChildEdit from './child/edit';
import ChildPasswordEdit from './child/password_edit';

import Parent from './parent';
import ParentDetail from './parent/detail';
import ParentEdit from './parent/edit';
import ParentPasswordEdit from './parent/password_edit';
import ParentRegister from './parent/register';

import Side from './side';

export default class AdminApp extends Component {
    render() {
        return (
            <main className="l-container meeting-consent">
            <BrowserRouter>
                <Switch>
                    <Route exact path='/admin/meeting' component={Meeting} />    
                    <Route exact path='/admin/meeting/detail/:meeting_id' component={MeetingDetail} />    
                    <Route exact path='/admin/meeting/edit/:meeting_id' component={MeetingEdit} />    
                    
                    <Route exact path='/admin/child' component={Child} />    
                    <Route exact path='/admin/child/detail/:child_id' component={ChildDetail} />    
                    <Route exact path='/admin/child/edit/:child_id' component={ChildEdit} />    
                    <Route exact path='/admin/child/edit/password/:father_id' component={ChildPasswordEdit} />    
                    
                    <Route exact path='/admin/parent' component={Parent} />    
                    <Route exact path='/admin/parent/detail/:father_id' component={ParentDetail} />    
                    <Route exact path='/admin/parent/edit/:father_id' component={ParentEdit} />    
                    <Route exact path='/admin/parent/edit/password/:father_id' component={ParentPasswordEdit} />    
                    <Route exact path='/admin/parent/register' component={ParentRegister} />    
                </Switch>
                <Side />
            </BrowserRouter>
        </main>
        );
    }
}
