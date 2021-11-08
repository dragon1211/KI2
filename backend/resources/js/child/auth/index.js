import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ChildForgotPassword from './forgot_password';
import ChildForgotPasswordComplete from './forgot_password/complete';
import ChildForgotPasswordReset from './forgot_password/reset';
import ChildLogin from './login';
import ChildSignUpTemporary from './register/temporary';
import ChildSignUp from './register';
import ChildSignUpComplete from './register/complete';
import ChildSignUpError from './register/error';
import ChildWithdrawal from './withdrawal_complete';
export default class ChildAuth extends Component {
    render() {
        return (
        <main className="l-single-main">
            <div className="l-centeringbox">
                <div className="l-centeringbox-wrap">
                    <div className="l-single-container">
                        <div className="l-single-inner">

                            <BrowserRouter>
                                <Switch>
                                    <Route exact path='/c-account/register-temporary' component={ChildSignUpTemporary} />
                                    <Route exact path='/c-account/register/:token' component={ChildSignUp} />
                                    <Route exact path='/c-account/register/complete' component={ChildSignUpComplete} />
                                    <Route exact path='/c-account/register/error/' component={ChildSignUpError} />

                                    <Route exact path="/c-account/forgot-password" component = {ChildForgotPassword} />
                                    <Route exact path="/c-account/forgot-password/reset/:token" component = {ChildForgotPasswordReset} />
                                    <Route exact path="/c-account/forgot-password/complete" component = {ChildForgotPasswordComplete} />
                                    
                                    <Route exact path="/c-account/login" component = {ChildLogin} />
                                    <Route exact path="/c-account/withdrawal/complete" component = {ChildWithdrawal} />
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