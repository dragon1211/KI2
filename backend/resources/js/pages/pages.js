import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Contact from './contact/index';
import ContactComplete from './contact/complete';
import UnknownError from './contact/unknown';


import { BrowserRouter, Route, Switch } from 'react-router-dom'
export default class Pages extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path='/contact-us' component={Contact} />
                    <Route exact path='/contact-us/complete' component={ContactComplete} />
                    <Route exact path='/unknown-error' component={UnknownError} />
                </Switch>
            </BrowserRouter>
        );
    }
}

if(document.getElementById('contact')){
	ReactDOM.render(
		<Pages />,
		document.getElementById('contact')
	)
}