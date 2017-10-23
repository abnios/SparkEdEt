import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _SearchData, _Deleted, _Feedback, _Notifications, _Institution,_Resources, _Settings, _Bookmark, _Sliding } from '../Collections/collections';

Meteor.users.allow({
  remove:function(){
    return true;
  },
  update:function(){
    return true;
  }
});

_Resources.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }

});

_Institution.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});


_Sliding.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});

_SearchData.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});
_Deleted.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});
_Feedback.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});
_Settings.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});
_Bookmark.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});
