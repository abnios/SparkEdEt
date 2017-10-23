import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {  _SearchData } from '../../Collections/collections';

Meteor.methods({

 removeSearchData: function(id){
   if (Roles.userIsInRole(this.userId, ['admin'])) {
     _SearchData.remove(id);
   } else {
     throw new Meteor.Error('oops', 'You are not allowed to not make changes');
   }
 },
 updateSearch: function(id, name){
    if (Roles.userIsInRole(this.userId, ['admin'])) {
     _SearchData.update(
       {_id:id},
       {$set:
         {name:name,_ids:{}}
       }
     );
   }
     else {
       throw new Meteor.Error('oops', 'You are not allowed to not make changes');
     }
 }
});
