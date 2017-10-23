import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _Bookmark } from '../../Collections/collections';


Meteor.methods({
    updateBookmark: function(bookmark, userId,title, description,url, color, path){
      _Bookmark.update({_id:bookmark},{
        $set:{
          user:userId,
          title: title,
          description: description,
          url: url,
          color:color,
          path:path,
          createdAt: new Date(),
      }},  {upsert:true});
    }
});
