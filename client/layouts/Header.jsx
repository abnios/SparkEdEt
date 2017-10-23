import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {SearchView} from '../Utilities/Utilities.jsx';
import AccountsUIWrapper from '../Accounts/AccountsUIWrapper.jsx';
import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';
import {Tracker} from 'meteor/tracker';
import {toggleModal} from '../Utilities/Modal/Modal.jsx';
import {_Feedback, _Notifications, _Institution, _Bookmark, _Sliding} from "../../Collections/collections.js";
import {toastMsg} from "../Notifications/SysMsg.jsx";
import Notifications from '../Notifications/Notifications.jsx';
import Bookmark from '../Bookmark/Bookmark.jsx';


export  class Header extends Component {


    openSettings(event) {
        // event.preventDefault();
        // toggleModal('#modal-settings', true);
        Meteor.logout(function(error){
          if(!error){
            FlowRouter.go('/login');
          } else {
            return null;
          }
        });
    }
    // user.profile.fname + " " + user.profile.lname;
    getUserName() {
        let user = Meteor.user();
        if (user) {
            return `${user.profile.fname} ${user.profile.lname}`
        } else {
            return "";
        }
    }

    getEmail(){
      email = Meteor.user();
      if (email) {
        return email.emails[0].address;
      } else {
        return "";
      }
    }
    viewDashBoard(event) {
        FlowRouter.go('/dashboard/accounts');

    }

    //show dashboard link only when the user has an admin role
    dashBoard() {
            if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
          
                return (
                    <div className="valign center-align" id="dashStylesDrop">
                        <span
                          className="dashLink link waves-effect waves-teal btn-flat"
                          onClick={this.viewDashBoard.bind(this)}>dashboard</span>
                    </div>
                )
            }else{
              return(
                <div>
                </div>
              )
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        // let userId = Meteor.userId();
        let userName = Meteor.user().profile.lname + " " + Meteor.user().profile.fname
        let name = $('#name').val();
        let feedback = $('#textarea').val();
        let _id = new Meteor.Collection.ObjectID().valueOf();
        let path = window.location.href;
        let feedlink = "/feedback";


        _Feedback.insert({
            _id: _id,
            title: name,
            feedback: feedback,
            link: path,
            createdAt: new Date(),
            createdBy: userName
        });

        //insert message to notify
        const msg = "You have a new feedback from " + userName;

        $('.clear').val('');
        $('#feedback').closeModal();

        toastMsg(true, "Your feedback has successfully been submitted");
    }

    //Show Notifications Modal
    showNotification(event){
        event.preventDefault();
        toggleModal('#notification-page', true);
      }

    //Notifications Number
    countNotifications(){
      let count = this.props.notificationsCount;
      if(count == undefined){
        return null;
      }else if (count<1){
        return (<a href="#" className="fa fa-bell fa-2x" onClick={this.showNotification.bind(this)} ></a>)
      }
      else {
        return (
          <a href="#" onClick={this.showNotification.bind(this)} >
            <div id="notificationBellContainer">
              <i className="fa fa-bell fa-2x block" id="usrIcon" >
              </i>
              <span className="danger-bg">{count}</span>
          </div>
          </a>
        )

      }
    }
    //go the notification source
    handleUrl(unitId, id, event) {
        event.preventDefault();
       //remove what's clicked
       Meteor.call('markRead', id);
        // });
        window.location = `/contents/${unitId}?ref=home`;
    }
    //Show Notifications
    renderNotifications(){
      let notifications = this.props.notifications;
      let date = "";

      if(notifications === undefined ){
        return(
          <li className="collection-item"> You don't have any notifications yet!</li>
        )
      } else {
        return notifications.map((note)=>(
                  <li className="collection-item" key={note._id} onClick={this.handleUrl.bind(this, note.unitId, note._id)}>
                    <a className="notification-item " id="note" href=''>
                    {note.title}
                    <span className="notification-date right">
                    {/* {note.createdAt.toString()} */}
                    {
                    // date = note.createdAt;
                    note.createdAt.getDate()  + "-" + ("0"+(note.createdAt.getMonth()+1)).slice(-2) + "-" + note.createdAt.getFullYear() + " " +
note.createdAt.getHours() + ":" + ("0" + note.createdAt.getMinutes()).slice(-2)

                    }
                    </span>
                    <span>
                      {
                        Session.set('notificationId', note._id)
                      }
                    </span>
                  </a>
                  </li>
      ));
      }
    }
    //update the notification collection on the click
    readAll(event){
      event.preventDefault();
      window.location = '/notifications';

    }


        addBookMark(event) {
        event.preventDefault();

       var userId = Meteor.userId();
        var title = $('#bmk-title').val();
        var description = $('#bmk-description').val();
        var url = window.location.href;
        var path = window.location.pathname;
          var bookmarkData = _Bookmark.findOne({url:url});
          var bookmark = null;
          var msg = "Saved!";
          if(typeof bookmarkData == 'object'){
            bookmark = bookmarkData._id;
            msg = "Updated!";
          }
          var color = this.color;
          Meteor.call('updateBookmark', bookmark, userId,title, description,url, color, path);

        $('.clear').val('');
        $('#bookmark-add').closeModal();
        Materialize.toast(msg, 3000);
      }

        setColor(color,event){
          event.preventDefault();
          this.color  = color;
          $('.color-test').css({color:color});
          console.log(color);
        }


    showBookMarks(event){
       event.preventDefault();
       toggleModal('#bookmarks-view', true);
     }


    render() {
        Meteor.setTimeout(function(){
          $('.button-collapse').sideNav({
            menuWidth: 300, // Default is 240
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: true // Choose whether you can drag to open on touch screens
          });

        $('.dropdown-button').dropdown({
            inDuration: 0,
            outDuration: 0,
            constrainWidth: false, // Does not change width of dropdown to that of the activator
            hover: false, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: true, // Displays dropdown below the button
            alignment: 'left', // Displays dropdown with edge aligned to the left of button
            stopPropagation: false // Stops event propagation
          });

          $("#testingArrow").toggle();
            // });
            $("#search").on("focus",function(){
              $("#titles").css("display","none");
            });
            $("#search").on( "blur", function(){
              $("#titles").show();
          });
        }, 10);

          //Render the name of the institution
          let inst = this.props.institution;
          let name = '';
          let tag = '';
          let id = '';
          let image = ''
          // console.log(this.getUserName())
          if(inst){
            name = inst.name;
            tag = inst.tagline;
            id = inst._id;
            image = inst.file.name;
            // image = 'hgIcon.png';
            //Keep the institution Id in Session
            Session.set('id', id);
            // Session.set('title', name  );
            // return name
          } else {
            // return ''
          }
        return (
              <div className="content-div">
              <div className="navbar-fixed">
              <nav>
                <div className="nav-wrapper">
                    <a href="/" className="brand-logo">
                      <p id="titles">
                          <img src={`/uploads/${image}`}  alt="logo" id="hLogo" />
                          <span id="hTitle">{name}</span>
                          <span id="hSubTitle">{tag}</span>

                      </p>
                    </a>
                  <ul className="right hide-on-med-and-down" id="menu-list">
                    <li className="">
                        <SearchView action={"/results"} placeholder={"Search"} query={"q"}/>
                    </li>
                    <li className="navItem">
                          <a href="/general_info">General Resource</a>
                    </li>
                    <li className="navItem">
                            {this.countNotifications()}
                    </li>

                    <li className="navItem">
                      <a href="#" className={
                          this.props.count > 0 ? 'fa fa-star fa-2x' : 'fa fa-star-o fa-2x'
                      }
                      data-activates="slide-out" onClick={this.showBookMarks.bind(this)}><span className="new"></span>
                    </a>
                    </li>
                    {/*settings dropdown-----  */}
                    {/* <i className="fa fa-sort-asc" id="testingArrow"></i> */}
                    <li className="navItem">
                          {/* <!-- Dropdown Trigger --> */}
                         <a className='dropdown-button' href='#'
                            data-activates='dropdown1'>
                            <i className="fa fa-user fa-2x" id="usrIcon"></i>
                        </a>
                         {/* <!-- Dropdown Structure --> */}
                        <ul id='dropdown1' className='dropdown-content'>
                           <li id="dropBody">
                             <div id="accName">
                               {" " + this.getUserName()}
                               <span id="userEmail">
                                  {this.getEmail()}
                               </span>
                               <span id="uiWrapper">
                                 {/* <AccountsUIWrapper/> */}
                               <a href='#' onClick={this.openSettings.bind(this)}>
                                   <span className="btn-flat" id="accounts-button">
                                       Logout
                                   </span>
                               </a>
                              </span>
                             </div>
                           </li>
                           <li id="dropFooter">
                             {this.dashBoard()}
                             {/* <span className="btn-flat" onClick={this.logOutUser.bind(this)}>sign out</span> */}
                           </li>
                        </ul>
                    </li>
                    {/*-------end settings drop down  */}
                  </ul>

                  {/* Notification component as sidenav can be changed */}
                  <div id="bars">
                    <a href="#" data-activates="mobile-demo" className="button-collapse">
                      <i  className="fa fa-bars "></i>
                    </a> </div>
                  <ul className="side-nav" id="mobile-demo">
                    <li><SearchView action={"/results"} placeholder={"Search here"} query={"s"}/></li>
                    <li>
                      <a href="/general_info" className="fa fa-book"> General muks Resource</a>
                    </li>
                    <li>
                      <a className="fa fa-user" href='#' onClick={this.openSettings.bind(this)}>
                        <span className="userName">{" " + this.getUserName()}</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
                  {/*======end fixed top navbar======*/}

                {/* Open Modal for FeedBack */}
                <div id="modal-settings" className="modal">
                  <div ref='modal_upload' className="modal-content">
                    <a href="" id="closeModal" className=" pull-right fa fa-close modal-action modal-close waves-effect waves-green "></a>
                    <div className=''>
                      <div className='col m6 m-modal'>
                        <AccountsUIWrapper/>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="feedback" className="modal">
                    <div className="modal-content">
                        <a href="" className="pull-right modal-action modal-close fa fa-times waves-effect"></a>
                        <form className="col s12" onSubmit={this.handleSubmit.bind(this)}>
                            <h3 className="feedback-title blue-text">Your FeedBack</h3>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input id="name" type="text" className="clear validate" placeholder="Title" required/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <textarea id="textarea" className="clear materialize-textarea" required placeholder="Your FeedBack"></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn waves-effect waves-light left fa fa-send-o" role='submit'> Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
                {/* Add navbar-fixed to make the nav fixed on top */}
                {/* Notifications for the Modal */}
                <div id="notification-page" className="modal">
                  <a href="" className="pull-right modal-action modal-close fa fa-times waves-effect"></a>
                    <div className="modal-content">
                        <div className="row">
                          <ul className="collection">

                            {this.renderNotifications()}

                          </ul>

                          </div>
                    </div>
                    <div className="modal-footer">
                      <a href="" className="" onClick={this.readAll.bind(this)} >See More</a>
                    </div>
                </div>
                <div id="bookmarks-view" className="modal">
                    <div className="modal-content">
                        <a href="" className="pull-right modal-action modal-close fa fa-times waves-effect"></a>

                        <Bookmark />

                    </div>
                </div>
                <div id="bookmark-add" className="modal">
                    <div className="modal-content">
                        <a href="" className="pull-right modal-action modal-close fa fa-times waves-effect"></a>

                        <form className="col s12" onSubmit={this.addBookMark.bind(this)}>
                            <h3 className="feedback-title color-test">Add Bookmark</h3>
                            <div className="row">
                                <div className="input-field col s12">
                                  <span className="c-grey">Title</span>
                                    <input id="bmk-title" maxLength="50" type="text" className="clear validate" placeholder="Title" required/>
                                    <input type="color"  defaultValue="#008000"  onClick={this.setColor.bind(this,'#008000')} id="bmk-color-green"/>
                                    <input type="color"  defaultValue="#ffeb3b" onClick={this.setColor.bind(this,'#ffeb3b')} id="bmk-color-yellow"/>
                                    <input type="color" defaultValue="#f44336" onClick={this.setColor.bind(this,'#f44336')} id="bmk-color-red"/>
                                    <input type="color"  defaultValue="#9c27b0" onClick={this.setColor.bind(this,'#9c27b0')} id="bmk-color-purple"/>
                                    <input type="hidden"  defaultValue="#9c27b0"  disabled id="bmk-color"/>

                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                  <span className="c-grey">Short Description</span>

                                    <textarea id="bmk-description" className="clear materialize-textarea" maxLength="70"  placeholder="short description"></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn blue waves-effect waves-light left fa fa-send-o" role='submit'> Add</button>
                            </div>
                        </form>
                    </div>
                </div>
        </div>//content-div ends

        );
    }
}
export default createContainer(() => {
      Meteor.subscribe('notifications');
      Meteor.subscribe('institution');
      Meteor.subscribe('bookmarks');
      Meteor.subscribe('slidings');

  return {
    notificationsCount: _Notifications.find({read: false}).count(),
    notifications: _Notifications.find({read: false}, {limit:5}).fetch().reverse(),
    institution: _Institution.findOne({}, {sort: {createdAt:-1}}),
    count: _Bookmark.find({user:Meteor.userId()},{sort:{color:1}}).count(),
    slidings: _Sliding.find({}).fetch(),
  }
}, Header)
