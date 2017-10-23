import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _School } from '../../Collections/collections';

Meteor.methods({
  addSchool: function(id,sku,skuCode){
      if (Roles.userIsInRole(this.userId, ['admin'])) {
            _School.insert({
              name:sku,
              code:skuCode,
              createdAt:new Date(),
              CreatedBy:this.userId
          });
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },

 editSchool: function(schoolId,schoolName,scode){
   if (Roles.userIsInRole(this.userId, ['admin'])) {
       _School.update(
         {_id:schoolId},
         {$set:{"name":schoolName, "code":scode}}
       );
     } else {
       throw new Meteor.Error('oops', 'You are not allowed to not make changes');
     }
 },

 removeSchool:function(id){
   if (Roles.userIsInRole(this.userId, ['admin'])) {
     _School.remove(id);
   } else {
     throw new Meteor.Error('oops', 'You are not allowed to not make changes');
   }
 }
});
