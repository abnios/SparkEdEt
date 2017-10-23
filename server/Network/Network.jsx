import { HTTP } from 'meteor/http'
import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup

});
//methods
//check internet connection
Meteor.methods({
  checkNetwork:function(){
    try{
      const url = 'http://date.jsontest.com/';
     HTTP.call("GET",url);
      return true;
    } catch(e) {
      return false;
    }
  }
});


//get json file sync file from host
Meteor.methods({
  getSyncFile:function(){
    try{
      const url = 'http://date.jsontest.com/';//get file
    var file = HTTP.call("GET",url);
      return file;
    } catch(e) {
      return false;
    }
  }
});
