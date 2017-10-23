import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {  _Programs } from '../../Collections/collections';



Meteor.methods({

     addProgram: function(id, program, programCode, details){
       if (Roles.userIsInRole(this.userId, ['admin'])) {
         _Programs.insert({
           _id:id,
           name:program,
           code:programCode,
           details:details,
           createdAt: new Date(),
           createdBy: this.userId
         }); //You can also trigger if something wrong happens
       } else {
         throw new Meteor.Error('oops', 'You are not allowed to not make changes');
       }
     },

    editProgram: function(id,program, pcode, duration){
      if (Roles.userIsInRole(this.userId, ['admin'])) {

            _Programs.update(
              {_id:id},
              {$set:{"name":program, "code":pcode, 'details.duration': duration}}
            );

      } else {
        throw new Meteor.Error('oops', 'You are not allowed to not make changes');
      }
    },
    removeProgram: function(id){
      if (Roles.userIsInRole(this.userId, ['admin'])) {

            _Programs.remove(id);

      } else {
        throw new Meteor.Error('oops', 'You are not allowed to not make changes');
      }
    },

});
