import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ParentForgotPassword from './forgot_password';
import ParentForgotPasswordComplete from './forgot_password/complete';
import ParentForgotPasswordReset from './forgot_password/reset';
import ParentLogin from './login';
import ParentSignUp from './register';
import ParentSignUpComplete from './register/complete';
import ParentSignUpError from './register/error';
import ParentWithdrawalComplete from './withdrawal_complete';


export default class ParentAuth extends Component {
    render() {
        return (
        <main className="l-single-main">
            <div className="l-centeringbox">
                <div className="l-centeringbox-wrap">
                    <div className="l-single-container">
                        <div className="l-single-inner">

                            <BrowserRouter>
                                <Switch>
                                    <Route exact path='/p-account/register/:token' component={ParentSignUp} />
                                    <Route exact path='/p-account/register/complete/:token' component={ParentSignUpComplete} />
                                    <Route exact path='/p-account/register/error/:token' component={ParentSignUpError} />

                                    <Route exact path="/p-account/forgot-password" component = {ParentForgotPassword} />
                                    <Route exact path="/p-account/forgot-password/reset/:token" component = {ParentForgotPasswordReset} />
                                    <Route exact path="/p-account/forgot-password/complete" component = {ParentForgotPasswordComplete} />
                                    
                                    <Route exact path="/p-account/login" component = {ParentLogin} />
                                    <Route exact path="/p-account/withdrawal/complete" component = {ParentWithdrawalComplete} />
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

if(document.getElementById('p-auth')){
    console.log("v1: 2021/11/26")
	ReactDOM.render(
		<ParentAuth />,
		document.getElementById('p-auth')
	)
}