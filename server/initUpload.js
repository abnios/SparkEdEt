import { Meteor } from 'meteor/meteor';
import { _Resources } from '../Collections/collections.js';

// TODO:  limit the size of the uploaded logo

Meteor.startup(function () {
  UploadServer.init({
    tmpDir: process.env.PWD + '/public/uploads/tmp',
    uploadDir: process.env.PWD + '/public/uploads/',
    // tmpDir: "C:\\Users\\ABEDNEGO\\manoap\\public\\uploads\\tmp",
    // uploadDir: "C:\\Users\\ABEDNEGO\\manoap\\public\\uploads",
    checkCreateDirectories: false, //create the directories for you, I don't want this
    acceptFileTypes:/(\.|\/)(pdf|mp4|png|jpg|jpeg)$/i,
  });
});
