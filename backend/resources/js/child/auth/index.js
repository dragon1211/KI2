import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ForgotPassword from './forgot_password';
import ForgotPasswordComplete from './forgot_password/complete';
import ForgotPasswordReset from './forgot_password/reset';

import Login from './login';
import SignUpTemporary from './register/temporary';
import SignUp from './register';
import SignUpComplete from './register/complete';
import SignUpError from './register/error';
            

export default class ChildAuth extends Component {
    render() {
        return (
        <main class="l-single-main">
            <div class="l-centeringbox">
                <div class="l-centeringbox-wrap">
                    <div class="l-single-container">
                        <div class="l-single-inner">

                            <BrowserRouter>
                                <Switch>
                                    <Route exact path='/register-temporary/c-account' component={SignUpTemporary} />
                                    <Route exact path='/register/c-account' component={SignUp} />
                                    <Route exact path='/register/c-account/complete' component={SignUpComplete} />
                                    <Route exact path='/register/c-account/error/' component={SignUpError} />

                                    <Route exact path="/forgot-password/c-account" component = {ForgotPassword} />
                                    <Route exact path="/forgot-password/c-account/reset" component = {ForgotPasswordReset} />
                                    <Route exact path="/forgot-password/c-account/complete" component = {ForgotPasswordComplete} />
                                    
                                    <Route exact path="/login/c-account" component = {Login} />
                                </Switch>
                            </BrowserRouter>

                        </div>
                    </div>
                </div>
            </div>
        </main>
           
        );
    }
}

// ----------------------------------------------------------------------

if(document.getElementById('c-auth')){
	ReactDOM.render(
		<ChildAuth />,
		document.getElementById('c-auth')
	)
}