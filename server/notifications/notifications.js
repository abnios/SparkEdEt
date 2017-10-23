import { _Notifications } from "../../Collections/collections.js";
import { Meteor } from 'meteor/meteor';

Meteor.methods({
  dropNotifications: function(){
    //Remove the notifications that have been read 
    _Notifications.remove({read:true});
  }
});
