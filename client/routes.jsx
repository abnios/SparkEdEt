import React, {Component} from 'react';
import {mount} from 'react-mounter';

import Home from './Home.jsx';
import Unit from './Dashboard/Unit.jsx';
import AutoSync from './Sync/AutoSync.jsx';

import ManageUnits from './Dashboard/ManageUnits';
import ViewResourceApp from './content/ViewResourceApp.jsx';
import  SignUp, {Signin} from './Accounts/Accounts.jsx';
import ContentsApp from './content/ContentsApp.jsx';
import SearchResults from './Search/SearchResults.jsx';
import ManageAccounts from './Accounts/ManageAccounts.jsx';
import EditAccounts from './Accounts/EditAccounts.jsx'
import PasswordRecovery from './Accounts/PasswordRecovery.jsx'
import EditUnit from './Dashboard/EditUnit.jsx';
import EditResources from './Dashboard/EditResources.jsx';
import NotFound from './layouts/NotFound.jsx';
import OverView from './Dashboard/Statistics/Overview.jsx';
import UserStatistics from './Dashboard/Statistics/UserStatistics';
import GeneralInfo from './Dashboard/GeneralInfo.jsx';
import Header from './layouts/Header.jsx';
import AddGeneralResource from './Dashboard/AddGeneralResource.jsx';
import AllTopics from './Dashboard/AllTopics.jsx';
import AllResources from './Dashboard/AllResources.jsx';
import Feedback from './Dashboard/Feedback.jsx';
import School from './Dashboard/School.jsx';
import Program from './Dashboard/Program.jsx';
import Courses from './Dashboard/Courses.jsx';
import DisplayResource from './Dashboard/DisplayResource.jsx';
import Institution from './Dashboard/Settings/Institution.jsx';
import Sliding from './Dashboard/Settings/Sliding.jsx';
import SyncSettings from './Dashboard/Settings/SyncSettings.jsx';
import Notifications from './Notifications/Notifications.jsx'
// import Notifications from './Notifications/Notifications.jsx';

// TODO: access routes according to rules

let exposed;
exposed = FlowRouter.group({});
loggedIn = FlowRouter.group({
    triggersEnter: [
        function(){
            if (!(Meteor.loggingIn() || Meteor.userId())) {
                return FlowRouter.go("/login");
            }
        }
    ]
});

adminRoutes = FlowRouter.group({
  triggersEnter: [
    function(){
      if (!(Meteor.loggingIn() || Meteor.userId())) {
        return FlowRouter.go('/login');
      } else if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
        return FlowRouter.go('/');
      }
    }
  ]
});

adminRoutes.route('/dashboard/setsync',{
  name: 'SyncSettings',
  action(){
    mount(SyncSettings, {});
  }
})

loggedIn.route('/', {
    name: 'Home',
    action() {
        mount(Home, {});
    }
});

exposed.route('/register', {
    name: 'Signup',
    action() {
        mount(SignUp, {});
    }
});

exposed.route('/login', {
    name: 'Login',
    action() {
        mount(Signin, {});
    }
});

loggedIn.route('/view_resource/:_id', {
    name: 'Home',
    action() {
        mount(ViewResourceApp, {});
    }
});

loggedIn.route('/file_upload/:_id', {
    action: function() {
        BlazeLayout.render("file_upload", {});
    }
});

adminRoutes.route('/dashboard/unit/:_id', {
    name: 'New Unit',
    action(params, queryParams) {
        mount(Unit,{})
        }
});

adminRoutes.route('/dashboard/accounts', {
    name: 'ManageAccounts',
    action() {
        mount(ManageAccounts, {});

    }
});

loggedIn.route('/contents/:_id', {
    name: 'Contents',
    action(params, queryParams) {
        mount(ContentsApp, {});
        // console.log("This is my blog post:", params);
    }
});

loggedIn.route('/contents/', {
    name: 'Contents',
    action(params, queryParams) {
        mount(ContentsApp, {});
    }
});

loggedIn.route('/results', {
    name: 'Results',
    action() {
        mount(SearchResults, {});
    }
});

adminRoutes.route('/dashboard/editaccounts/:_id', {
    name: 'EditAccounts',
    action() {
        mount(EditAccounts, {});
    }

});

adminRoutes.route('/dashboard/edit_resources/:_id', {
    name: 'EditResources',
    action() {
        mount(EditResources, {});
    }
});

adminRoutes.route('/dashboard/edit_unit/:_id', {
    name: 'EditUnit',
    action() {
        mount(EditUnit, {})
    }
});

adminRoutes.route('/dashboard/units/:_id', {
    name: 'ManageUnits',
    action(params, queryParams) {
        mount(ManageUnits, {})
    }
});


loggedIn.route('/dashboard/units/', {
    name: 'SearchUnits',
    action(params, queryParams) {
        mount(ManageUnits, {})
    }
});

loggedIn.route('/sync', {
    name: 'Sync',
    action() {
        mount(AutoSync, {});
    }
});

loggedIn.route('/request', {
    name: 'Request',
    action() {
        mount(ProcessRequest, {});
    }
});
adminRoutes.route('/dashboard/overview', {
    name: 'OverView',
    action() {
        mount(OverView, {});
    }
});

loggedIn.route('/user_details/:_id', {
    name: 'UserStatistics',
    action() {
        mount(UserStatistics, {})
    }
});

loggedIn.route('/general_info', {
    name: 'GeneralInfo',
    action() {
        mount(GeneralInfo, {})
    }
});

loggedIn.route('/egranary', {
    name: 'AddGeneralResource',
    action() {
        mount(AddGeneralResource, {})
    }
});

loggedIn.route('/feedback', {
    name: 'Feedback',
    action() {
        mount(Feedback, {})
    }
});

exposed.notFound = {
    action: function() {
        mount(NotFound, {});
    }
};

adminRoutes.route('/dashboard/list_topics', {
    name: 'AllTopics',
    action() {
        mount(AllTopics, {})
    }
});

adminRoutes.route('/dashboard/list_resources', {
  name: 'AllResources',
  action(){
    mount(AllResources, {})
  }
});

adminRoutes.route('/dashboard/school', {
   name: 'School',
   action(){
     mount(School, {})
   }
});
adminRoutes.route('/dashboard/program/:_id', {
   name: 'Program',
   action(params){
     mount(Program, {})
   }
});
adminRoutes.route('/dashboard/course/:_id', {
  name: 'Courses',
  action(params,queryParams){
    mount(Courses, {})
  }
});

adminRoutes.route('/dashboard/settings', {
  name: 'Institution',
  action(){
    mount(Institution, {})
  }
});
// adminRoutes.Router.route("/dashboard/settings", {
//   name:"Sliders",
//   action(){
//     mount(Sliders,{})
//   }
// });

loggedIn.route('/slidings', {
    name: 'Sliding',
    action() {
        mount(Sliding, {})
    }
});

loggedIn.route('/notifications', {
  name: 'Notifications',
  action(){
    mount(Notifications, {})
  }
});


adminRoutes.route('/dashboard/view_resource/:_id', {
  name: 'DisplayResource',
  action(queryParams){
    mount(DisplayResource, {})
  }
});
