import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {  _Deleted } from '../../Collections/collections';

Meteor.methods({
   insertDeleted: function(id){
     if (Roles.userIsInRole(this.userId, ['admin'])) {
       _Deleted.insert({_id:id,col:'school',sync:{kijabe:false,kisumu:false}});
     } else {
       throw new Meteor.Error('oops', 'You are not allowed to not make changes');
     }
   }
});
