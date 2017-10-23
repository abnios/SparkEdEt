import React, { Component } from 'react';
import Header from '../../layouts/Header.jsx';
import Sidenav from '../Sidenav.jsx'
import {createContainer} from 'meteor/react-meteor-data';
import { _Statistics } from '../../../Collections/collections.js';
import PageDetails from './PageDetails.jsx';

export  class UserStatistics extends Component {

  constructor() {
      super();

      this.state = {
          subscription: {
              users: Meteor.subscribe('allUsers')
          }
      };

    }

  exportUserDataToCSV(event) {
      var data = this.props.statistics;
      //var sortedData = [];
      var mUser = this.props.user;
      userStats = null;
      data.forEach(function(v, k, arr) {
        userStats = {};

        userStats['name'] = mUser.profile.fname + " " + mUser.profile.lname;
        userStats['email'] = mUser.emails[0].address;
        userStats['gender'] = mUser.profile.gender;

        $.map(v, function(col, index) {
          userStats[index] = col;;
        });
        data[k] = userStats;


    });


    var name = this.props.user.profile.fname+" "+this.props.user.profile.lname;
    var nameFile = name+'.csv';
    Meteor.call('DataToCSV',data.reverse(),function(err, fileContent) {
      if(fileContent){
        var blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
        saveAs(blob, nameFile);
      }
    })

  }



  renderPageData(){

    if(this.props.statistics == undefined){
      return null;
    }

    return this.props.statistics.map((page)=>(

      <tr key={page._id}>
        <td>{ page.page}</td>
        <td><a target={'_blank'} href={ page.url}>{ page.material}</a></td>
        <td>{ page.freq}</td>
        <td>{ new Date(page.date).toString()}</td>
      </tr>
    ));

  }
getBack(){
  FlowRouter.go('/dashboard/overview');
}

renderUserName(){
  var user = this.props.user;
  if(user == undefined){
    return null;
  }
  else {
    return <span>{user.profile.fname} {user.profile.lname}</span>;
  }

}
showNav(event){
  event.preventDefault();
  $('.sidenav').show("slow");
}


  render(){
    return(
  <div>
        <Header />

        <div className="row">
        <div className="col m3">
        <Sidenav stats={' dash-active'}/>
        <h4></h4>
        </div>


      <div className="col m8 ">
            <div className="">
                  <h4>Statistics for {this.renderUserName()}</h4>
            </div>
            <div className="row">
                <div className="col m3 ">
                  <button className="btn grey darken-1 fa fa-angle-left" onClick={this.getBack.bind(this)}> Users</button>
                </div>

                <div className="col m3 ">
                  <button className="btn green darken-1 fa fa-download" onClick={this.exportUserDataToCSV.bind(this)}> Export</button>
                </div>
           </div>

        <table className="highlight">
              <thead>
                  <tr>
                    <th>Page </th>
                    {/* <th>Url</th> */}
                    <th>Material</th>
                    <th>Frequency</th>
                    <th>Last Active</th>
                  </tr>
              </thead>

              <tbody>

                {this.renderPageData()}

              </tbody>
          </table>
      </div>
    </div>
    </div>
    )
  }
}

export function userId(){
  return FlowRouter.getParam('_id');
}

export default createContainer((param) => {
  Meteor.subscribe('statistics');
  return {
    statistics : _Statistics.find({user:userId()}).fetch(),
    user: Meteor.users.findOne({_id:userId()}),

  }
}, UserStatistics);
