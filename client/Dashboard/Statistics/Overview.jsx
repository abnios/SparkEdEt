import React, {Component} from 'react';
import Header from '../../layouts/Header.jsx';
import {createContainer} from 'meteor/react-meteor-data';
import Sidenav from '../Sidenav.jsx';
import { _Statistics } from '../../../Collections/collections.js';


export  class OverView extends Component {

  constructor() {
      super();

      this.state = {
          subscription: {
              users: Meteor.subscribe('allUsers'),
              statistics: Meteor.subscribe('allUsers'),
          }
      }
    }

    userStatistics(id) {
        FlowRouter.go(`/user_details/${id}`);
    }

    exportUsersageDataToCSV(event) {

      var error = false;
      var errorNames = [];

      this.props.users.map((user) =>{

        var name = user.profile.fname+" "+user.profile.fname;
        errorNames.push(name)
        var nameFile = name+'.csv';
        var query = {user:user._id};


        Meteor.call('getCSVData','statistics',query,user,function(err, fileContent) {
          if(fileContent){
            var blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
            saveAs(blob, nameFile);
          }else {
            error = true;
          }
        })



      });

      if(error){
        Materialize.toast("Sorry Statistics for "+ errorNames.JSON.stringify()+" downloaded",4000);
      }else {
        Materialize.toast("Statistics for all Users successfuly downloaded",4000);

      }
    }

    renderUsers() {
        var users = this.props.users;
        var count = 1;

        return users.map((user) => {
            var email = user.emails;

            if (email == undefined) {
                email = '';
            } else {
                email = email[0].address;
            }

            return <tr key={user._id} onClick={this.userStatistics.bind(this, user._id)} className="link-section">
                <td>{count++}</td>
                <td>{user.profile.fname} {user.profile.lname}</td>
                <td>
                    {email}</td>
                <td>{user.profile.gender}</td>
            </tr>
        })
    }



    render() {

        return (
            <div>
                <Header/>


                <div className="row">
                <div className="col m3">
                <Sidenav stats={' dash-active'}/>
                <h4></h4>
                </div>

                <div className="col m1">
                </div>

                <div className="col m8 ">

                <div className="col m10 container">
                    <div>
                        <div className="col  s12">
                            <h4>Users OverView</h4>
                            {/* <a className="btn m4" href="/overview?sch=kijabe">Kijabe</a>
                            <a className="btn m4" href="/overview?sch=kisumu">Kisumu</a> */}
                            <div>

                              <a className="btn s6 right" href="/overview"> Clear</a>
                            </div>
                            <button className="btn green darken-1 fa fa-download" onClick={this.exportUsersageDataToCSV.bind(this)}> Export</button>


                        </div>

                    </div>
                    <table className="highlight">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Gender</th>
                            </tr>
                        </thead>

                        <tbody>

                            {this.renderUsers()}

                        </tbody>
                    </table>
                </div>
                </div>
            </div>
            </div>
        )
    }
}


export function getSch() {
    var sch = FlowRouter.getQueryParam('sch');
    var query = {'profile.stats':1};

    if (sch == undefined || sch == null) {
        return query;
    }
    query['profile.sch'] = sch;

    return query;
}

export default createContainer(() => {
    return {
        users: Meteor.users.find(getSch()).fetch(),
    }
}, OverView);
