import React, { Component } from 'react';
import Side from './side';

import Meeting from './meeting';
import MeetingDetail from './meeting/detail';

import Parent from './parent';
import ParentDetail from './parent/detail';

import Profile from './profile';
import ProfileEdit from './profile/edit';
import ProfilePasswordEdit from './profile/password_edit';
import ProfileWithdrawal from './profile/withdrawal';

import Search from './search';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ScrollToTop from '../component/scroll_top';

export default class ChildApp extends Component {
    render() {
        return (
        <main className="l-container meeting-consent">
            <BrowserRouter>
                <ScrollToTop/>
                <Switch>
                    <Route exact path="/c-account/meeting" component = {Meeting} />
                    <Route exact path="/c-account/meeting/detail/:meeting_id" component = {MeetingDetail} />
                    <Route exact path="/c-account/search" component = {Search} />
                    <Route exact path="/c-account/parent" component = {Parent} />
                    <Route exact path="/c-account/parent/detail/:father_id" component = {ParentDetail} />

                    <Route exact path="/c-account/profile" component = {Profile} />
                    <Route exact path="/c-account/profile/edit/:child_id" component = {ProfileEdit} />
                    <Route exact path="/c-account/profile/password-edit/:child_id" component = {ProfilePasswordEdit} />
                    <Route exact path="/c-account/profile/withdrawal" component = {ProfileWithdrawal} />
                </Switch>
                <Side />
            </BrowserRouter>
        </main>
        );
    }
}