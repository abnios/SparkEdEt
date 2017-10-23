import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _Courses } from '../../Collections/collections';

Meteor.methods({

     addCourse: function(id, course, courseCode, details){
       if (Roles.userIsInRole(this.userId, ['admin'])) {
         _Courses.insert({
           _id:id,
           name:course,
           code:courseCode,
           details:details,
           createdAt:new Date(),
           createdBy:this.userId
         });
          //You can also trigger if something wrong happens
       } else {
         throw new Meteor.Error('oops', 'You are not allowed to make changes');
       }
     },

    editCourse: function(id,course, courseCode, year){
      if (Roles.userIsInRole(this.userId, ['admin'])) {

        _Courses.update(
          {_id:id},
          {$set:{
            'name':course,
            'code': courseCode,
            'details.year': year
          }}
        );

      } else {
        throw new Meteor.Error('oops', 'You are not allowed to make changes');
      }
    },
    removeCourse: function(id){
      if (Roles.userIsInRole(this.userId, ['admin'])) {

            _Courses.remove(id);

      } else {
        throw new Meteor.Error('oops', 'You are not allowed to not make changes');
      }
    },

});
