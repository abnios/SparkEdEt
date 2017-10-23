import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { isLoggedIn } from './AccountFunction.js';
import { Tracker } from 'meteor/tracker';
import { Meteor } from 'meteor/meteor';



export default class AccountsUIWrapper extends
Component {

  // constructor(){
  //   super();
  //     isLoggedIn();
  //
  //     Tracker.autorun(()=>{
  //     if(!Meteor.userId()){
  //       console.log(Meteor.loggingIn());
  //       FlowRouter.go('/login');
  //     }
  //     },{});
  //
  //     }


  componentDidMount(){

    this.view = Blaze.render(
    Template.loginButtons,
      ReactDOM.findDOMNode(this.refs.container)
    );
  }

  componentWillUnMount(){
     // Clean up Blaze view
    Blaze.remove(this.view);
  }

  render(){

    // Just render a placeholder container that will be filled in
    return <span  ref='container' />
  }

   }
