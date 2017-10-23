import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Accounts} from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor';
import Header from '../layouts/Header.jsx';
import {checkPassword} from './AccountFunction.js';
import { Session } from 'meteor/session';

export class PasswordRecovery extends Component{

  constructor() {
      super();
      this.state = {
          subscription: {
              users: Meteor.subscribe('allUsers')
          }
      }
    }

handleReset(event){
  event.preventDefault();
  var currentUser = Session.get('userId');
  // var userId = $('.userId').val();

  // var pwdResults = checkPassword(password, password2);
  var password = $('#password').val();
  var password2 = $('#password2').val();

  var pwdResults = checkPassword(password, password2);

  if (!pwdResults.status){
      printMsg(pwdResults.status, pwdResults.msg);
      return;
  }


}

handleId(event){
  event.preventDefault();
  var email = $('#email').val();
  var user = Meteor.users.findOne({'emails.address': email});
  // var Id = ;
  // console.log(Id);
  // $('#user').(Id);
  Session.set('userId', user._id);


  // if(users == undefined){
  //   return null;
  // } else {
  //   console.log(users);
  // }

  // for(user in users){
  //   console.log(users);
  // }
  // users.map((user) =>
// );
  // this.setState({id: user[0]._id})
  // console.log(this.state.id);
  // Accounts.setPassword(user[0]._id, )

}

  render(){
    return(
      <div>
        <Header />
        <div className="container">
            <form className=" m4 s12" onSubmit={this.handleReset.bind(this)}>
                <h2 className="formTitle">Password Recovery</h2>
                <h6 className='msg'></h6>
                <div className="row">
                    <div className="input-field ">
                        <input id="email" type="email" className="validate field" placeholder='Email' onChange={this.handleId.bind(this)} required/>
                          <input type="hidden" className="currentUser" id="user"/>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field">
                        <input id="password" type="password" className="validate field" placeholder='Password' required/>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field">
                        <input id="password2" type="password" className="validate field" placeholder='Reset Password' required/>
                    </div>
                </div>

                <button className="btn waves-effect waves-light fa fa-paper-plane" type="submit" name="action"> Submit
                </button>
                {/* <div className="reg">

                    If you don't have an account Please  <a href="/register">Register</a>
                </div> */}

            </form>
      </div>
      </div>
    );
  }
}

export default createContainer(()=>{
  return {
    users: Meteor.users.find().fetch(),
  }

}, PasswordRecovery)
