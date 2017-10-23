

export function   handleCheckboxChange(id) {
      var checkbox = $(".chk"+id);
      checkbox.prop("checked", !checkbox.prop('checked'));//toggle state
      var checkBoxes =  $(".chk").toArray();
      var checkBoxAl =  $(".chk-all");
      var isCheckAll = true;

    checkBoxes.forEach(function(v,k,boxes){
        let isChecked = $(v).prop('checked');
        if(!isChecked){
          isCheckAll = false;
          return false;
        }
    });

      if(isCheckAll){
        checkBoxAl.prop("checked", true);
      }else{
        checkBoxAl.prop("checked", false);
      }
  }

  /*get marked checkbox values
  Returns array of id
  */
  export function   getCheckBoxValues(checkboxes) {
        var checkBoxes =  $('.'+checkboxes).toArray();
        var values = [];

      checkBoxes.forEach(function(v,k,boxes){
          let isChecked = $(v).prop('checked');
          if(isChecked){
          let id = $(v).attr('id');
          values.push(id);
          }
      });
    return values;
    }



  export function handleCheckAll(parent,children) {
    var checkBox =    $(".chk-all");
    var checkBoxes =    $(".chk");
    checkBoxes.prop("checked", !checkBox.prop("checked"));
    checkBox.prop("checked", !checkBox.prop("checked"));
    }
