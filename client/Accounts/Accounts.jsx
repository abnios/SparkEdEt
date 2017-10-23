import React, {Component} from 'react';
import {Accounts} from 'meteor/accounts-base';
import {createContainer} from 'meteor/react-meteor-data';
import {_Programs, _School} from '../../Collections/collections.js';
import {printMsg, toastMsg} from '../Notifications/SysMsg.jsx';
import {login, isLoggedOut, checkPassword} from './AccountFunction.js';
import RegisterHeader from '../layouts/RegisterHeader.jsx';
import Sidenav from '../Dashboard/Sidenav.jsx';
//import {toastMsg} from '../../Notifications/SysMsg.jsx';
import {ModalDialog, toggleModal} from '../Utilities/Modal/Modal.jsx';

export class SignUp extends Component {
  constructor() {
    super();
    this.renderPrograms = this.renderPrograms;
  }
  handleSubmit(event) {

    event.preventDefault();
    var fname = $('#fname').val();
    var lname = $('#lname').val();
    var email = $('#email').val();
    var password = $('#password').val();
    var password2 = $('#password2').val();
    // var schoolId = $('#school').val();
    var programId = $('#program').val();
    var year = $('#year').val();
    var gender = $('#gender').val();

    let pwdResults = checkPassword(password, password2);

    if (!pwdResults.status) {
      printMsg(pwdResults.status, pwdResults.msg);
      return;
    }

    Meteor.call('accountExist', email, function(err, result) {

      if (result) {
        printMsg(false, result);
        return;
      } else {

        var profile = {
          'gender': gender,
          'fname': fname,
          'lname': lname,
          // 'schoolId':schoolId,
          // 'programId': programId,
          'year': year,
          'status': 0
        };

        Accounts.createUser({
          'email': email,
          'password': password,
          'profile': profile
        }, function(error) {

          if (error != undefined) {
            printMsg(false, error.reason);
          } else {
            // printMsg(true, 'account created');
            toastMsg(true, 'Account created successfully');
            window.location = '/';
            toastMsg(true, 'Account created successfully');
            $('.field').val('');
          }
        });
      }

    });

  }

  renderPrograms() {
    var count = 1;
    // var programs = this.props.programs;
    if (this.props.programs == undefined) {
      return null;
    }
    return this.props.programs.map((program) => (

      <option key={count++} value={program._id}>{program.name}</option>
    ))
  }

  // renderSchools(){
  //   var count = 1;
  //   if(this.props.schools == undefined){
  //     return null;
  //   }
  //   return this.props.schools.map((school)=>(
  //     <option key={count++} value={school._id}>{school.name}</option>
  //   ))
  // }

  render() {
    $('select').material_select();
    return (
      <div>
        <RegisterHeader/>
        <div className="col m10 container">
          <div className="card">
            <div className="card-panel">

              <form className="m6 form" onSubmit={this.handleSubmit.bind(this)}>
                <h2 className="formTitle">Create a User</h2>
                <h6 className='msg'></h6>

                <div className="row">
                  <div className="input-field ">
                    <input id="fname" required type="text" className="validate field" placeholder='First Name'/>

                  </div>
                  <div className="input-field ">
                    <input id="lname" type="text" required className="validate field" placeholder='Last Name'/>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field ">
                    <input id="email" type="email" required className="validate field" placeholder='Email'/>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field">
                    <input id="password" type="password" required className="validate field" placeholder='Password'/>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field ">
                    <input id="password2" type="password" required className="validate field" placeholder='Confirm Password'/>
                  </div>
                </div>
                {/* <h6 className="light">Year of Study</h6> */}


                <div className="input-field ">
                  <select id='gender' required="true" className=" field">
                    <option defaultValue>Choose your Gender</option>
                    <option >Male</option>
                    <option >Female</option>

                  </select>
                </div>
                <br/>

                <br/>
                <button className="btn waves-effect waves-light fa fa-paper-plane addBtn" type="submit" name="action">
                  Sign Up
                </button>
                <div className="reg">
                  If you already have an account Please
                  <a href="/login">
                    Log In</a>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export class Signin extends Component {

  constructor() {
    super();
    isLoggedOut();
  }

  handleLogin(event) {

    event.preventDefault();

    let email = $('#email').val();
    let password = $('#password').val();

    login(email, password);
  }

  render() {

    return (
      <div>
        <RegisterHeader/>
        <div className="container">
          <form className=" m4 s12" onSubmit={this.handleLogin.bind(this)}>
            <h2 className="formTitle">Sign in</h2>
            <h6 className='msg'></h6>
            <div className="row">
              <div className="input-field ">
                <input id="email" type="email" className="validate field" placeholder='Email'/>
              </div>
            </div>
            <div className="row">
              <div className="input-field">
                <input id="password" type="password" className="validate field" placeholder='Password'/>
              </div>
            </div>

            <button id="loginButton" className="btn waves-effect waves-light fa fa-paper-plane" type="submit" name="action">
              Sign in
            </button>
            <div className="reg">

              If you don't have an account Please
              <a href="/register">Register</a>
            </div>

          </form>
        </div>
      </div>

    )
  }
}

export default createContainer(() => {
  Meteor.subscribe('programs');
  return {programs: _Programs.find().fetch()}
}, SignUp)
