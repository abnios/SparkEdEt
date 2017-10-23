import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import ReactDOM from 'react-dom';
import {createContainer} from 'meteor/react-meteor-data';
import {toastMsg} from '../Notifications/SysMsg.jsx';
import Header from '../layouts/Header.jsx';

export class EditAccounts extends Component {

  handleChange() {}

  handleSubmit(event) {
    event.preventDefault();
    var namef = $('#fname').val();
    var namel = $('#lname').val();
    var gender = $('#gender').val();
    var userId = getUserId();

    Meteor.users.update({
      _id: userId
    }, {
      $set: {
        'profile.fname': namef,
        'profile.lname': namel,
        'profile.gender': gender
      },
      // {'profile.lname': namel}
    },)
    toastMsg(true, "User updated!");

  }

  render() {
    {
      var user = this.props.user;

      if (user == undefined) {

        return <p>No user</p>;
      }

    }
    return (
      <div>
        <Header/>

        <div className="container">

          <form className="formCenter" onSubmit={this.handleSubmit.bind()}>
            <h2 className="formTitle">Edit {user.profile.fname} {user.profile.lname}<span></span>
            </h2>
            <h6 className='msg'></h6>

            <div className="row">
              <div className="input-field">
                <input id="email" type="email" readOnly value={user.emails[0].address} className="validate field" placeholder='email'/>
              </div>
            </div>

            <div className="row">
              <div className="input-field">
                <input id="fname" type="text" defaultValue={user.profile.fname} onChange={function() {}} className="validate field" placeholder="First name"/>
              </div>
            </div>
            <div className="row">
              <div className="input-field">
                <input id="lname" type="text" defaultValue={user.profile.lname} onChange={function() {}} className="validate field" placeholder='Last Name'/>
              </div>
            </div>
            <div className="row">
              <div className="input-field ">
                <select id='gender' required="true" className="browser-default" defaultValue={user.profile.gender}>
                    <option >Male</option>
                    <option >Female</option>

                </select>
              </div>
            </div>
            <br/>
            <button className="btn waves-effect waves-light icon-edit" type="submit" name="action">
              Update

            </button>
            <a className="btn waves-effect waves-light icon-edit pull-right" href="/dashboard/accounts" type="submit" name="action">
              Done

            </a>
          </form>
        </div>

      </div>

    )
  }

}

export function getUserId() {

  var userId = FlowRouter.getParam('_id');
  //validate for errors
  return userId;
}

export default createContainer(() => {
  return {
    user: Meteor.users.findOne({_id: getUserId()}),
    // users.Meteor.users.update({}),
  };
}, EditAccounts);
