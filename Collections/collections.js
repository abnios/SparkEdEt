import { Mongo } from 'meteor/mongo';

export const _Resources = new Mongo.Collection('resource');
export const _SearchData = new Mongo.Collection('search');
export const _Topics = new Mongo.Collection('topic');
export const _Units = new Mongo.Collection('unit');
export const _Statistics = new Mongo.Collection('statistic');
export const _Egranary = new Mongo.Collection('egranary');
export const _Deleted = new Mongo.Collection('deleted');
export const _Feedback = new Mongo.Collection('feedback');
export const _Notifications = new Mongo.Collection('notification');
export const _School = new Mongo.Collection('school');
export const _Programs = new Mongo.Collection('program');
export const _Courses = new Mongo.Collection('course');
export const _Institution = new Mongo.Collection('institution'); //this can also contain the logo
export const _Sliding = new Mongo.Collection('sliding'); //this can also contain the logo
export const _Settings = new Mongo.Collection('settings'); //this can also contain the logo
export const _Bookmark = new Mongo.Collection('bookmarks'); //this can also contain the logo
