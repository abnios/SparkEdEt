import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _Units } from '../../Collections/collections';


Meteor.methods({
     addUnit: function(id, unit, count, programId,year,course){
       if (Roles.userIsInRole(this.userId, ['admin'])) {
         _Units.insert({
             _id: id,
             name: unit,
             topics: count,
             createdAt: new Date(),
             sync: {
                 kijabe: false,
                 kisumu: false
             },
             details:{
               programId:programId,
               year:year,
               courseId:course
             },
             createdBy: this.userId
         });
          //You can also trigger if something wrong happens
       } else {
         throw new Meteor.Error('oops', 'You are not allowed to not make changes');
       }
     },

    updateUnit: function(id,name){
      if (Roles.userIsInRole(this.userId, ['admin'])) {

        _Units.update(
          {_id:id},
          {$set:{"name": name}}
        )


      } else {
        throw new Meteor.Error('oops', 'You are not allowed to not make changes');
      }
    },
    removeUnit: function(id){
      if (Roles.userIsInRole(this.userId, ['admin'])) {

            _Units.remove(id);

      } else {
        throw new Meteor.Error('oops', 'You are not allowed to not make changes');
      }
    },
});
