import { Meteor } from 'meteor/meteor';
import { _Statistics } from '../../Collections/collections.js';



const db ={statistics:_Statistics};

Meteor.methods({

DataToCSV: function(collection) {
//  var collection = collection.find(query).fetch();
  var heading = true; // Optional, defaults to true
  var delimiter = "," // Optional, defaults to ",";
  return exportcsv.exportToCSV(collection, heading, delimiter);
}
})


Meteor.methods({

getCSVData: function(collection,query,mUser) {
 var data = db[collection].find(query).fetch();

if (data.length == 0) {
  return false;
}


 data.forEach(function(v,k,arr){


        v['name'] =mUser.profile.fname+" "+mUser.profile.lname;
        v['email'] =mUser.emails[0].address;
        v['gender'] =mUser.profile.gender;

 });





  var heading = true; // Optional, defaults to true
  var delimiter = ";" // Optional, defaults to ",";
  return exportcsv.exportToCSV(data, heading, delimiter);
}
})
