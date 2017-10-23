import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {_Notifications} from "../../Collections/collections.js";
import {Session} from 'meteor/session';
import Header from '../layouts/Header.jsx';

export class Notifications extends Component {

    renderNotifications(){

        if (this.props.notifications == undefined) {
            return null;
        } else if (this.props.notificationsCount == 0) {
            return <li className="collection-item col m12 s12">
                <a className="notification-item" href="#">You have no new notifications</a>
            </li>
        }
        return this.props.notifications.map((notification) => (

            <li className="collection-item " key={notification._id}>
                <a className="notification-item black-text" id="note" href={'/contents/' + notification.unitId + '?ref=home'}>
                    {notification.title}
                    <span className="notification-date right ">
                        {notification.createdAt.toString()}
                    </span>
                </a>
            </li>

        ));
    }

    render() {
        var hour = 60 * 60 * 1000;
        var day = hour * 24;
        var expDate = day * 30;
        //Empty the notification collection after a 30days
        Meteor.setInterval(function(){
            Meteor.call('dropNotifications');
        }, 60 * 60 * 1000);

        return (
            <div>
                <Header/>
                <div className="container">
                    <div>
                        <h3 className="center blue-text">
                            All Notifications</h3>
                    </div>

                    <ul className="collection">
                        {this.renderNotifications()}
                    </ul>

                </div>

            </div>

        )
    }
}

export default createContainer(() => {
  Meteor.subscribe('notifications');

    return {

        //Show the newly created N notifications
        notifications: _Notifications.find().fetch().reverse(),
    }
}, Notifications)
