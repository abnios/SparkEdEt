import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import {createContainer} from 'meteor/react-meteor-data'; //helper for getting data from a Collection
import Header from './layouts/Header.jsx';
import Slider from './layouts/Slider.jsx';
import Footer from './layouts/Footer.jsx';
import {_Units, _Topics, _Programs, _Courses, _Sliding} from '../Collections/collections.js';
import Unit from './content/Unit.jsx';
import { FloatingButton } from './Utilities/Utilities.jsx';
import DataList from './Utilities/DataList.jsx';
import { Session } from 'meteor/session';

export  class Home extends Component {
  constructor(){
    super();
    this.filters = {};
  }


    showCourses(year){
      Session.set('programId',this.state.programId);
      Session.set('year',year);
     }

     showDuration(programId){
       var duration = 0;
       $.each(this.props.programs,(k,v)=>{
         if(v._id == programId){
           duration = v.details.duration;
           this.state={programId:programId};
           return;
         }
       })
       $("#year").html('<option value=""></option>');
       for (var i = 1; i <= duration; i++) {
           $("#year").append("<option >"+i+"</option>");
       }
      }


    filter(filter,event){

      var val =$("select[name="+filter+"]").val(); // get selected filters;
       if(filter == "program"){//show courses relevant to the program only
      // this.showCourses(val);
      this.showDuration(val);
    }else if (filter == "year") {
      this.showCourses(val);
      val = "yr"+val;
    }

    this.filters[filter] =val;
    var statusArr = [];
  //  var val = $("input[list="+filter+"]").val();
    var units = $('.cse-unit');  //get all units
    var $filters = this.filters;//

    $.each(units,function(k,v){
   statusArr =  $.map($filters, function( val, i ) {
      return $(v).hasClass(""+val+"");
});


    if($.inArray(false,statusArr) !== -1){
      $(this).hide('slow');
    }else {
        $(this).show('slow');
    }

    })

  }

    displayFeedback(event){
      event.preventDefault();

        $('#feedback').openModal();
    }
    getDataList(filter,name){

      var data =null;
      var isShowData =false; //don't show data parsed to datalist in browser

      if (filter == "program") {
         data = this.props.programs;
      }else if (filter == 'course') {
        isShowData = true;
        data = this.props.courses;
      }else if(filter == 'year' ){
        data =[];
      }else {
        data = [];
      }

      if(data == undefined){
        return;
      }

      return (<DataList showData={isShowData} options={data} name={filter} title={name} id={filter} change={this.filter.bind(this,filter)}  />);
    }


    renderUnits() {

        var index = 0;
        unitData = this.props.unit;
        if (unitData == undefined){
            return null;
        }

        return unitData.map((unit) => (<Unit key={index++} unit={unit}/>));
    }


    render() {
      // home page collapsible----
      let sl = this.props.slidings;
      image1= sl[0].file.name;
      tag1 = sl[0].name;
      image2=sl[1].file.name;
      tag2 = sl[1].name;
      image3=sl[2].file.name;
      tag3 = sl[2].name;
      console.log(sl.length);

      Meteor.setTimeout(function(){
        $('.collapsible').collapsible();
      $("#home-filter-collapse").click(function() {
        if ($("#filter-icon").hasClass("fa-sort-desc")) {
          $("#filter-icon").removeClass("fa-sort-desc").addClass("fa-sort-asc");
        }else {
          $("#filter-icon").removeClass("fa-sort-asc").addClass("fa-sort-desc");
        }
      });
    },10);

      // -------------------------end
        return (
          <div className="home-main">
            <div>
                <Header/>
            </div>
            <div>
                <ImgSlider/>
                {/* <p id="Picks">Available Resources</p> */}
            </div>
            <div className="container ">
                    <div className="row ">
                      {/* <div className="col m4">{this.getFilter("program","Program")}</div>
                      <div className="col m4">{this.getFilter("course","Course")}</div>
                      <div className="col m4">{this.getFilter("program","Year")}</div>
                          {this.renderUnits()} */}
                          {/* <<<<<<< HEAD */}
                        {/* {this.props.topics} */}
                        {/* {this.renderCourses()} */}
                          {/* ======= */}
      {/*FILTER FOR THE HOME PAGE  */}
              <ul id="home-filter-collapse" className="collapsible" data-collapsible="accordion">
                <li>
                  <div id="collapsible-header-id" className="collapsible-header row">
                      <div className="col s11 m11">
                        <span id="collapsible-header-text">Filter</span>
                      </div>
                      <div className="col s1 m1">
                        <div className="fa fa-sort-desc" id="filter-icon"></div>
                      </div>
                  </div>
                  <div className="collapsible-body">
                    <div className="row">
                        <div className="col m4 s12">
                          {this.getDataList("program","Program")}
                        </div>
                        <div className="col m4 s12">
                          {this.getDataList("year","Year")}
                        </div>
                        <div className="col m4 s12">
                          {this.getDataList("course","Course")}
                        </div>
                    </div>
                  </div>
                </li>
              </ul>
      {/*END FILTER*/}
      {this.renderUnits()}
{/* >>>>>>> 35812cd5ada66dadf2b9ff626e9f166eb91e02cb */}
              </div>
                    <FloatingButton />
              </div>
          </div>


        )
    }
}

export class ImgSlider extends Component {

    render(){
// console.log(image1)
        Meteor.setTimeout(function() {
            $('.slider').slider('start');
            $('.slider').slider({full_width: false});
        }, 5);

          // console.log(this.getUserName());
        // let slding = this.props.slidings;
        // console.log(this.props.unit)
        // firstImage();
        // console.log(this.getUserName());
        // if (this.props.slidings == undefined) {
        //   return null;
        // }

        return  (
            <div className="slider">
                <ul className="slides">
                    <li>

                        <img src={`/uploads/${image1}`} />
                        <div className="caption center-align">
                            <h4 className="light red-text text-lighten-1">{tag1}</h4>
                        </div>
                    </li>
                    <li>
                        <img src={`/uploads/${image2}`} />
                        <div className="caption left-align">
                            <h4 className="light green-text text-lighten-1">{tag2}</h4>
                        </div>
                    </li>
                    <li>
                        <img src={`/uploads/${image3}`} />
                        <div className="caption right-align">
                            <h4 className="light black-text text-lighten-1">{tag3}</h4>
                        </div>
                    </li>
                </ul>
            </div>

        );
    }
}
export default createContainer(() => {
  Meteor.subscribe('units');
  Meteor.subscribe('slidings');
  Meteor.subscribe('courses');
  Meteor.subscribe('programs');
    return {
        unit: _Units.find().fetch(),
        courses: _Courses.find({'details.programId':Session.get('programId'),'details.year':Session.get('year')}).fetch(),
        course: _Courses.find({}),
        programs: _Programs.find({}).fetch(),
        slidings: _Sliding.find({}).fetch(),
        // topics:_Topics.find({unitId:'jij'}).count(),
    }
}, Home);
