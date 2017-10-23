import { Meteor } from 'meteor/meteor';
import {_Institution} from '../../Collections/collections.js';
import {Accounts} from 'meteor/accounts-base';

/*
  The file contains the initial database of the Institution and the users
*/
Meteor.startup(() => {
  // code to run on server at startup
  //Add the name of the institution at when there is nothing at startup of the application
  //create roles on server startup

  if(_Institution.find().count() === 0){
    let title = "Add The Name Of The University"; //The initial name of the _Institution
    let tagline = "The Tagline goes here"; // initial tagline for the _Institution

    _Institution.insert({
      name:title,
      tagline:tagline,
      file: {name:'hgIcon.png'}
    });
  }

  //Add Add the Admin account on startup if there is no account created
  //this needs to be worked in such a way that the password isn't a plain text


});
