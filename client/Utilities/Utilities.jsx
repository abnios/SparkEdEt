import React,{ Component }  from 'react';
import { PropTypes } from 'prop-types';
import {Meteor} from 'meteor/meteor';

export class SearchView extends Component{
        handleSearch(event){
          event.preventDefault();
          $('#submit').trigger('click');
        }
        getQuery(){
          var query = FlowRouter.getQueryParam(this.props.query);
          query = query === undefined ? null :query;
          return query;
        }
        render(){
          return(
             <form action={this.props.action} name={this.props.formName} method='get' >
                <div className="row">
                  <input  className="col input" name={this.props.query} type="search" defaultValue={this.getQuery()} id="search" placeholder={this.props.placeholder} />
                    {/* <i role='submit' onClick={this.handleSearch.bind(this)} role="submit" href={this.props.action}></i> */}
                    <input id="submit" type="submit"  className="hidden" hidden />
                </div>
              </form>
                )
            }
}

SearchView.propTypes = {
  action:PropTypes.string.isRequired,
  query:PropTypes.string.isRequired,
  placeholder:PropTypes.string.isRequired,
}


export class SearchField extends Component{
        handleSearch(event){
          event.preventDefault();
          $('#submit').trigger('click');
        }
        getQuery(){
          var query = FlowRouter.getQueryParam(this.props.query);
          query = query === undefined ? null :query;
          return query;
        }
        render(){
          return(
             <form action={this.props.action} name={this.props.formName} method='get' >
                <div className="row">
                  <input  className="" name={this.props.query} type="search" defaultValue={this.getQuery()} id="searchField" placeholder={this.props.placeholder} />
                    {/* <i role='submit' onClick={this.handleSearch.bind(this)} role="submit" href={this.props.action}></i> */}
                    <input id="submit" type="submit"  className="hidden" hidden />
                </div>
              </form>
                )
            }
}


SearchField.propTypes = {
  action:PropTypes.string.isRequired,
  query:PropTypes.string.isRequired,
  placeholder:PropTypes.string.isRequired,
}

export function initInput(){
  $(document).ready(function() {
  Materialize.updateTextFields();
});
}
export function filterUrl(filter){
  var val = FlowRouter.getQueryParam(filter);
  var path = location.pathname+"?"+filter+"="+true;
  location.href = path;
}

export function setActiveItem(id,items,clas){
  // console.log(id,items);

  $('.'+items).each(function(k,v){
    $(v).removeClass('active-item').addClass(clas);
  });
  $('#'+id).addClass('active-item').removeClass(clas);
}


export class FloatingButton extends Component{

  constructor(){
    super();
    Meteor.subscribe('bookmarks');
  }

  displayFeedback(event) {
    event.preventDefault();
      $('#feedback').openModal();

  }

  triggerBookMark(event) {
    event.preventDefault();
    var title =$('.bmk').html();
    var descrip =$('.bmk-descrip').html();
    $('#bmk-title').val(title);
    $('#bmk-description').val(descrip);
    $('#bookmark-add').openModal();

  }




render(){


        Meteor.setTimeout(function() {
          $(".plus-icon").mouseover(function(){
            $(".more-items").removeClass("fa-plus").addClass("fa-times");
          });
          $(".plus-icon").mouseout(function(){
            $(".more-items").removeClass("fa-times").addClass("fa-plus");
          });

        }, 10);
  //"more options" icon rotation

  return(
    <div className="fixed-action-btn plus-icon" >
      <a href=""  className="btn-floating btn-large waves-effect waves-light blue " >
        <i className="fa fa-plus center more-items" ></i>

      </a>
      <ul>
        <li>
            <a href="#" title="Provide feedback" className="btn-floating  waves-effect waves-light blue" onClick={this.displayFeedback.bind(this)}>
              <i className="fa fa-comments center"></i>
            </a>
          </li>
          <li >
            <a onClick={this.triggerBookMark.bind(this)} title="Bookmark" href="#" target="_blank" className="btn-floating blue">
              <i className="fa fa-bookmark"></i>
            </a>
          </li>
      </ul>
    </div>
  );

}


}
