import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

export class ModalDialog extends Component{
  constructor() {
    super();
      }

      render(){
        return(
          <div id={this.props.id} className="modal">
            <div ref='modal_upload' className="modal-content">
              <a href="#" className="pull-right modal-action modal-close fa fa-times waves-effect waves-green btn-flat">Cancel</a>
              <h4>{this.props.title}</h4>
              <p>{this.props.msg}</p>
            </div>
            <div className="modal-footer">
              <a href="#" id="closeModal" className="modal-action modal-close  waves-effect waves-green btn-flat">No</a>
              <a href="#" onClick={this.props.callBack} id="yes" className="modal-action  waves-effect waves-green btn-flat">Yes</a>
            </div>
          </div>
        )
      }
}

//propTypes
ModalDialog.propTypes = {

  msg: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  callBack: PropTypes.func.isRequired,
}
//collection container


//functions

export function toggleModal(selector,status){
    if(status){
      $(selector).openModal();
    }else {
      $(selector).closeModal();

      $('#closeModal').trigger('click');
      }

  }
