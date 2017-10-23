import { Meteor }  from 'meteor/meteor';
import { printMsg } from '../Notifications/SysMsg.jsx';


export function login(email,password){


  Meteor.call('checkAccount',email,function(err,result){
    // console.log(result);
    if(result){
      printMsg(true,result);
    }else{
      Meteor.loginWithPassword(email,password,
        (error) => {
          if(error != undefined){
          printMsg(false,error.reason);
          }else{
          printMsg(true,'You are now logged in');
            location.href = '/';
          }
        }
      );
    }


  });


}

/**isLoggedIn
checks if user is logged in.else redirect the user  to the
login page if not logged in
@return null


**/
export function isLoggedIn(){

  if(!Meteor.userId()){
      location.assign = '/login';
  }

}

/**isLoggedOut
checks if user is logged out. redirect the user  to the
home page if  logged in
@return null


**/
export function isLoggedOut(){

  if(Meteor.userId()){
   FlowRouter.go('/');

  }

}


export function checkPassword(password,password2){
  var msg = '';
  var status = false;

  if($.trim(password) !== $.trim(password2)){
  return {msg:'Passowrds donot match',
  status:false}
  }else if(password.length < 6 ){
  return {msg:'Passowrd length must be greater five(5)',
  status:false}
  }else{
  return {msg:'Passowrd ok',
  status:true}
  }

  }





export function getUserData(){


  if(Meteor.userId()){
   return Meteor.userId();

 }
 return null;
}


// export function newPassword(){
//
//     Meteor.call('setPassword', function(error){
//       if(error){
//         Materialize.toast(error.reason);
//       } else {
//         Materialize.toast('error.reason');
//
//         // Materialize.toast('Successfully  Changed the Password');
//         // FlowRouter.go('/login');
//       }
//     });
//
//
// }
