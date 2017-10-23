import React,{ Component } from 'react';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { _Units,_Topics,_Resources,_SearchData, _Statistics,_Deleted, _Egranary } from '../../Collections/collections.js';


export  class AutoSync extends Component{

      constructor(){
        super();

        this.mCollections = {unit:_Units,topic:_Topics,resource:_Resources,'deleted':_Deleted ,'egranary':_Egranary};

         this._SCHOOL = "kijabe";//config

        // this.url = 'http://192.168.8.150:3000/syncApp?sch='+this._SCHOOL+'&file=';
        this.url = 'http://52.42.16.134/syncApp?sch='+this._SCHOOL+'&file=';

          self = this;
          Session.set('syncedStats',false);



          //testing purposes =getResource(); START
          //
          // Meteor.call('getResource',[],function(err,result){
          //
          //   console.log(err,result);
          // })



          //testing purposes  = getResource()END




          Meteor.setTimeout(function(){
          //  self.syncStatistics();
          //  self.getSyncProgress();
          }, 3000)

      }



      componentDidMount(){
        this.checkConnection();
      }


      getSyncProgress(){


        Meteor.call('getResourceProgress',[],function(err,result){

          console.log(err,result);

          if(result){

            var resourceSize = result.resourceSize;
            var resourceIndex = result.resourceIndex;
            var resources = result.resources;
            var chunkSize = result.chunkSize;
            var resourceName = result.resourceName;

            $('.list').html('<li>'+
            'resourceName:' + resourceName+
            'resourceIndex:' + resourceIndex+
            'resources:' + resources+
            'chunkSize:' + chunkSize+
            'resourceSize:' + resourceSize+
            '</li>');

          }



        })


      }


      syncStatistics(){



        if(this.props.statistics == undefined){

          Meteor.setTimeout(function(){
            self.syncStatistics();
          }, 3000)
        }


        if(this.props.statistics.length > 0){
        //  console.log(this.props.statistics);

        var data = JSON.stringify(this.props.statistics);
        //console.log(data);
          Meteor.call('sendStatistics',data,function(err,result){
              $('.list').append('<li>'+"user usage Statistics sent! </li>");
          })

        }else{
          $('.list').append('<li>'+"no user usage Statistics found! </li>");

        }

        self.syncSUsers();


      }



            syncSUsers(){

            //  var data = JSON.stringify(this.props.users);
              //console.log(data);
                Meteor.call('sendUsers',function(err,result){
                    $('.list').append('<li>'+"user accounts sent! </li>");
                })

            }



      syncUnit(){


                $.ajax({

        dataType: "JSON",
        url: self.url+'unit',
        data: {},
        crossDomain:true,
        success: function(data,status){

          if(data == null || data == undefined){
            $('.list').append('<li>'+" No new SECTIONS found"+'</li>');

              self.syncTopic();
            return ;
          }

          var units = JSON.parse(data);


          console.log('unit=>',units,status);



          $('.list').append('<li>'+units.length+" SECTIONS found for sync"+'</li>');

          units.forEach(function(v,k,array){
              var unitId = v._id;
              var name = v.name;
              var topics = v.topics;
              var user = v.createdBy;
              var count = v.count;
              //insert unit
              _Units.update(
                {_id:unitId},
                  {$set:
                  {name:name,topics:count,createdAt:new Date(), createdBy: user
                 }},
                 {upsert:true}
                );

                _SearchData.update(
                  {_id:unitId},
                  {$set:
                    {name:name,_ids:{},category:'unit',createdAt:new Date()}
                  },
                  {upsert:true}
                );

            });


          self.syncTopic();
        },
        error:function(error){
         console.log('Error ',error);

        }
        });

      }


      syncTopic(){

                $.ajax({
        dataType: "json",
        url: self.url+'topic',
        data: {},
        success: function(data,status){

          if(data == null || data == undefined){
            $('.list').append('<li>'+" No new TOPICS found"+'</li>');
            self.syncResource();
            return ;
          }

          var topics = JSON.parse(data);

          $('.list').append('<li>'+topics.length+" TOPICS found for sync"+'</li>');

          topics.forEach(function(v,k,thisArray){
            var _id = v._id;
            var unitId = v.unitId;
            var name = v.name;
            var unit = v.unit;
            var user = v.createdBy;


            if(unitId == undefined || unit == undefined){

              _Topics.update(
                {_id:_id},
                {$set:{name:name}}
              );

              //index for search purposes
              _SearchData.update(
                {_id:_id},
                {$set: {name:name }}
              );

            }else{

            _Topics.update(
              {_id:_id},
              {$set:
              {unitId:unitId,name:name,unit:unit,createdAt:new Date(),createdBy: user}},
              {upsert:true}
            );

            //index for search purposes
            _SearchData.update(
              {_id:_id},
              {$set:
                {name:name,_ids:{unitId:unitId},category:'topic',createdAt:new Date()}},
                {upsert:true}

            );

          }


          });


          self.syncResource();
        },
        error:function(error){
        //  console.log(error.responseText);

        }
        });

      }





      syncResource(){
        var resourceFiles = [];//array for resources to be downloaded


                $.ajax({
        dataType: "json",
        url: self.url+'resource',
        data: {},

        success: function(data,status){

          if(data == null || data == undefined){
            $('.list').append('<li>'+" No new RESOURCES found"+'</li>');
            self.syncDelete();

            return ;
          }

          var resources = JSON.parse(data);

          //$('.list').append('<li>'+resources.length+" RESOURCES found for sync"+'</li>');
          resources.forEach(function(v,k,array){
            var resourceId = v._id;
            var topicId =v.topicId;
            var resource_name = v.name;
            var file = v.file;
            console.log(resource_name);
            if(file == undefined || file == null){
            //  jsut update to db, no need to get resource
              _Resources.update(
              {_id:resourceId},
              {$set:{name:resource_name}}
              )

              _SearchData.update(
                  {_id:resourceId},
                  {$set:{name:resource_name}}
              );

            }else{
              let resource = {name:file.name,url:file.url,size:file.size};
              resourceFiles.push(resource);

              _Resources.update(
              {_id:resourceId},
              {$set:{topicId:topicId,name:resource_name,file:file}},
              {upsert:true}
              )

              _SearchData.update(
                  {_id:resourceId},
                  {$set:{_ids:{topicId:topicId},name:resource_name,category:'resource',createdAt:new Date()}},
                {  upsert:true}

              );

            }

            $('.list').append('<li>'+resource_name+" resources found saved to database"+'</li>');



          });



      //    $('.list').append('<li>'+resources.length+" resources synced to local app :)</li>");


      if(resourceFiles.length > 1){
        console.log(resources);

        Meteor.call('getResource',resourceFiles,function(err,result){


          if(result == 202){
            $('.list').append('<li>'+resources.length+" ALL resources synced to local app :)</li>");

          }

          console.log(err,result);
        })

      }





          self.syncDelete();


        },
        error:function(error){
        //  console.log(error.responseText);

        }
        });
      }


      //check deletes




            syncDelete(){

                      $.ajax({
              dataType: "json",
              url: self.url+'delete',
              data: {},

              success: function(data,status){

                if(data == null || data == undefined){
                  self.syncEgranary();
                  return ;
                }

                var deletes = JSON.parse(data);

                var count  = 0;
                deletes.forEach(function(v,k,array){
                  var id = v._id;
                  var col =v.col;

                  _SearchData.remove(id);
                  self.mCollections[col].remove(id);

                  if(col == 'resource'){
                    var file = v.file;
                    Meteor.call('deleteFile',file,function(err,data){
                    })
                    _Deleted.update({_id:id},{$set:{col:col,file:file}},{upsert:true});

                  }else {
                    _Deleted.update({_id:id},{$set:{col:col}},{upsert:true});
                  }


                  count++;
                });
                $('.list').append('<li>'+count+" item(s) deleted</li>");
                self.syncEgranary();


              },
              error:function(error){
              //  console.log(error.responseText);

              }
              });
            }





//egranary

syncEgranary(){

          $.ajax({
  dataType: "json",
  url: self.url+'egranary',
  data: {},

  success: function(data,status){

    if(data == null || data == undefined){
      return ;
    }

    var egranaryData = JSON.parse(data);

    var count  = 0;
    egranaryData.forEach(function(v,k,array){
      var id = v._id;
      var name =v.name;
      var link =v.link;
      var text =v.text;


        _Egranary.update({_id:id},{$set:{name:name,link:link,text:text}},{upsert:true});



      count++;
    });
    $('.list').append('<li>'+count+" Egranary resources found and saved</li>");


  },
  error:function(error){
  //  console.log(error.responseText);

  }
  });
}





              checkConnection(){
                Meteor.call('checkNetwork',function(err,isOnline){
                  if(isOnline){
                    Session.set('isOnline',true);
                    $('.online').text("ONLINE");
                    $('.online').addClass('btn btn-primary');
                    self.syncUnit();
                  }else{
                    Session.set('isOnline',false);
                    $('.online').text("OFFLINE");
                    $('.online').removeClass('btn btn-primary');
                  }
                });
              }

      render(){



        return(
          <div>

            <span className=" online"></span>
            <ol className='list'>

            </ol>
          </div>
        )
      }


}


export default createContainer(() => {
return {
  statistics:_Statistics.find({}).fetch(),

}
},AutoSync);
