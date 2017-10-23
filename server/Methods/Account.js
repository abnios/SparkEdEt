import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

Meteor.methods({
  checkAccount:function(email){
    var user = Accounts.findUserByEmail(email);
    if(!user){
      return 'Sorry email not identified';
    } else if ((!user.profile.status || user.profile.status == 2)) {
      return 'Sorry account not activated. Inform Adminstrator';
    }
    return false;
  },
  accountExist:function(email){
    var user = Accounts.findUserByEmail(email);
    if(user){
      return 'Sorry email already registered.';
    }
    return false;
  },
  makeAdmin: function(){
    if (Meteor.users.find().count() === 1) {
        Roles.addUsersToRoles(this.userId, 'admin');
          Meteor.users.update({_id:this.userId},
              {$set:{'profile.status': 1}}
          );
      }
  }
});
