import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _Sliding } from '../../Collections/collections';

Meteor.methods({
  addSliding: function(id,sku,skuTag,file){
      if (Roles.userIsInRole(this.userId, ['admin'])) {
            _Sliding.insert({
              name:sku,
              tag:skuTag,
              file: file,
              createdAt:new Date(),
              CreatedBy:this.userId
          });
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },

 editSliding: function(slidingId,slidingName,stag){
   if (Roles.userIsInRole(this.userId, ['admin'])) {
       _Sliding.update(
         {_id:slidingId},
         {$set:{"name":slidingName, "tag":stag}}
       );
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
