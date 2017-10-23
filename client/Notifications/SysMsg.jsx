import React,{ Component } from 'react';


export default class ResultMsg extends Component{


}

export function printMsg(status,msg){
  if(status){
    $('.msg').addClass('green accent-3').removeClass('red accent-2').html(msg);
  }else{
    $('.msg').addClass('red accent-2').removeClass('green accent-3').html(msg);
  }
}


export function toastMsg(status,msg){
  if(status){
    Materialize.toast(msg, 4000);
  }else{
    Materialize.toast(msg, 9000);
  }

}
