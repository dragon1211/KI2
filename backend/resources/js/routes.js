import {Route} from 'react-router-dom';

import DashboardLayout from './layout/DashboardLayout';
import MainLayout from './layout/MainLayout';

/*====================================
               Admin
===================================*/
import AdminMeetings from './admin/meeting';
import AdminMeetingDetail from './admin/meeting/detail';
import AdminMeetingEdit from './admin/meeting/edit';

import AdminChilds from './admin/child';
import AdminChildDetail from './admin/child/detail';
import AdminChildEdit from './admin/child/edit';
import AdminChildPasswordEdit from './admin/child/password_edit';

import AdminParents from './admin/parent';
import AdminParentDetail from './admin/parent/detail';
import AdminParentEdit from './admin/parent/edit';
import AdminParentPasswordEdit from './admin/parent/password_edit';
import AdminParentAdd from './admin/parent/add';

import AdminSide from './admin/side';

import AdminLogin from './admin/login';


/*====================================
            p-account
===================================*/
import ParentMeetings from './parent/meeting';
import ParentMeetingDetail from './parent/meeting/detail';
import ParentMeetingAdd from './parent/meeting/add';
import ParentMeetingEdit from './parent/meeting/edit';

import ParentFavorite from './parent/favorite';
import ParentSearch from './parent/search';

import ParentChilds from './parent/child';
import ParentChildAdd from './parent/child/add';
import ParentChildEdit from './parent/child/edit';
import ParentChildDetail from './parent/child/detail';

import ParentProfileDetail from './parent/profile';
import ParentProfileEdit from './parent/profile/edit';
import ParentProfilePasswordEdit from './parent/profile/password_edit';
import ParentProfileWithdrawal from './parent/profile/withdrawal';

import ParentSide from './parent/side';

/*------------------------------------*/
import ParentForgotPassword from './parent/auth/forgot_password';
import ParentForgotPasswordReset from './parent/auth/forgot_password/reset';
import ParentLogin from './parent/auth/login';
import ParentSignUp from './parent/auth/register';

import PasswordResetComplete from './component/password_reset_complete';
import SignUpComplete from './component/register/complete';
import SignUpError from './component/register/error';
import WithdrawalComplete from './component/withdrawal_complete';



/*====================================
            c-account
===================================*/
import ChildSide from './child/side';

import ChildMeetings from './child/meeting';
import ChildMeetingDetail from './child/meeting/detail';

import ChildParents from './child/parent';
import ChildParentDetail from './child/parent/detail';

import ChildProfileDetail from './child/profile';
import ChildProfileEdit from './child/profile/edit';
import ChildProfilePasswordEdit from './child/profile/password_edit';
import ChildProfileWithdrawal from './child/profile/withdrawal';

import ChildSearch from './child/search';

/*--------------------------------*/
import ChildForgotPassword from './child/auth/forgot_password';
import ChildForgotPasswordReset from './child/auth/forgot_password/reset';
import ChildLogin from './child/auth/login';
import ChildSignUpTemporary from './child/auth/register/temporary';
import ChildSignUp from './child/auth/register';


/*====================================
               pages
===================================*/
import Contact from './pages/contact/index';
import ContactComplete from './pages/contact/complete';
import UnknownError from './pages/contact/unknown';
import Terms from './pages/terms';
import PrivacyPolicy from './pages/privacy-policy';




const routes = [
    {
        path: 'admin',
        element: <DashboardLayout side={<AdminSide/>}/>,
        children: [
            { path: 'meeting', element: <AdminMeetings /> },   
            { path: 'meeting/detail/:meeting_id', element: <AdminMeetingDetail /> },   
            { path: 'meeting/edit/:meeting_id', element: <AdminMeetingEdit /> },   

            { path: 'child', element: <AdminChilds /> },   
            { path: 'child/detail/:child_id', element: <AdminChildDetail /> },   
            { path: 'child/edit/:child_id', element: <AdminChildEdit /> },   
            { path: 'child/edit/password/:child_id', element: <AdminChildPasswordEdit /> },   
    
            { path: 'parent', element: <AdminParents /> },   
            { path: 'parent/detail/:father_id', element: <AdminParentDetail /> },   
            { path: 'parent/edit/:father_id', element: <AdminParentEdit /> },   
            { path: 'parent/edit/password/:father_id', element: <AdminParentPasswordEdit /> },   
            { path: 'parent/register', element: <AdminParentAdd /> },   
        ]
    },
    {
        path: 'p-account',
        element: <DashboardLayout side={<ParentSide/>}/>,
        children: [
            { path: 'meeting', element: <ParentMeetings /> },
            { path: 'meeting/detail/:meeting_id', element: <ParentMeetingDetail /> },
            { path: 'meeting/new', element: <ParentMeetingAdd /> },
            { path: 'meeting/edit/:meeting_id', element: <ParentMeetingEdit /> },

            { path: 'favorite', element: <ParentFavorite /> },
            { path: 'search', element: <ParentSearch /> },

            { path: 'child', element: <ParentChilds /> },
            { path: 'child/add', element: <ParentChildAdd /> },
            { path: 'child/edit/hire-date/:child_id', element: <ParentChildEdit /> },
            { path: 'child/detail/:child_id', element: <ParentChildDetail /> },

            { path: 'profile', element: <ParentProfileDetail /> },
            { path: 'profile/edit/:father_id', element: <ParentProfileEdit /> },
            { path: 'profile/edit/password/:father_id', element: <ParentProfilePasswordEdit /> },
            { path: 'profile/withdrawal', element: <ParentProfileWithdrawal /> },
        ]
    },
    {
        path: 'c-account',
        element: <DashboardLayout side={<ChildSide/>}/>,
        children: [
            { path: 'meeting', element: <ChildMeetings /> },
            { path: 'meeting/detail/:meeting_id', element: <ChildMeetingDetail/> },

            { path: 'search', element: <ChildSearch /> },
            { path: 'parent', element: <ChildParents /> },
            { path: 'parent/detail/:father_id', element: <ChildParentDetail /> },

            { path: 'profile', element: <ChildProfileDetail /> },
            { path: 'profile/edit/:child_id', element: <ChildProfileEdit /> },
            { path: 'profile/password-edit/:child_id', element: <ChildProfilePasswordEdit /> },
            { path: 'profile/withdrawal', element: <ChildProfileWithdrawal /> },
        ]
    },
    {
        path: 'admin',
        element: <MainLayout />,
        children: [
            { path: 'login', element: <AdminLogin /> },
        ]
    },
    {
        path: 'p-account',
        element: <MainLayout />,
        children: [
            { path: 'register/:token', element: <ParentSignUp /> },
            { path: 'register/complete/:token', element: <SignUpComplete /> },
            { path: 'register/error/:token', element: <SignUpError /> },
            
            { path: 'forgot-password', element: <ParentForgotPassword /> },
            { path: 'forgot-password/reset/:token', element: <ParentForgotPasswordReset /> },
            { path: 'forgot-password/complete', element: <PasswordResetComplete /> },
            
            { path: 'login', element: <ParentLogin /> },
            { path: 'withdrawal/complete', element: <WithdrawalComplete /> },
        ]
    },
    {
        path: 'c-account',
        element: <MainLayout />,
        children: [
            { path: 'register-temporary', element: <ChildSignUpTemporary /> },
            { path: 'register/:token', element: <ChildSignUp /> },
            { path: 'register/complete/:token', element: <SignUpComplete /> },
            { path: 'register/error/:token', element: <SignUpError /> },

            { path: 'forgot-password', element: <ChildForgotPassword /> },
            { path: 'forgot-password/reset/:token', element: <ChildForgotPasswordReset /> },
            { path: 'forgot-password/complete', element: <PasswordResetComplete /> },
            
            { path: 'login', element: <ChildLogin /> },
            { path: 'withdrawal/complete', element: <WithdrawalComplete /> },
        ]
    },
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: 'contact-us', element: <Contact /> },
            { path: 'contact-us/complete', element: <ContactComplete /> },
            { path: 'unknown-error', element: <UnknownError /> },
            { path: 'terms', element: <Terms /> },
            { path: 'privacy-policy', element: <PrivacyPolicy /> },
        ]
    },
];

export default routes;







