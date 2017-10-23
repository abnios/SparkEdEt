import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _Sliding } from '../../Collections/collections';

Meteor.methods({
  addSliding: function(id,sku,file){
      if (Roles.userIsInRole(this.userId, ['admin'])) {
            _Sliding.insert({
              name:sku,
              // tag:skuTag,
              file: file,
              createdAt:new Date(),
              CreatedBy:this.userId
          });
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },

 editSliding: function(slidingId,slidingName){
   if (Roles.userIsInRole(this.userId, ['admin'])) {
     console.log('editing slider1')
       _Sliding.update(
         {_id:slidingId},
         {$set:{"name":slidingName}}
       );
       console.log('editing slider')
     } else {
       throw new Meteor.Error('oops', 'You are not allowed to not make changes');
     }
 },

 removeSliding:function(id){
   if (Roles.userIsInRole(this.userId, ['admin'])) {
     _Sliding.remove(id);
   } else {
     throw new Meteor.Error('oops', 'You are not allowed to not make changes');
   }
 }
});
