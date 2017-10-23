import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {  _Notifications } from '../../Collections/collections';

Meteor.methods({
   insertNotification: function(_id, unitId, msg){
     if (Roles.userIsInRole(this.userId, ['admin'])) {
         _Notifications.insert({_id:_id, unitId:unitId, title: msg, createdAt: new Date(), read: false});
     } else {
       throw new Meteor.Error('oops', 'You are not allowed to not make changes');
     }
   },
   markRead: function(id){
     _Notifications.update({
         _id: id
     }, {
         $set: {
             read: true
         }
     }
   );
   }
});
