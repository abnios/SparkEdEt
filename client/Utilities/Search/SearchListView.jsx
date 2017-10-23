import React, { Component } from 'react';
import { PropTypes } from 'prop-types';


export default class SearchListView extends Component {


  geturlCategory(category,ids){

    var category = this.props.result.category;
    var ids = this.props.result._ids;
    var id = this.props.result._id;

    var url = "";

    if(category == 'section'){

      url = '/contents/'+id;

  }else if (category == "topic") {

    let sectionId = ids.sectionId;

    url = "/contents/"+sectionId+"?rs="+id;

  }else if (category == "resource" && ids !==undefined) {

    let topicId = ids.topicId;

    url = "/view_resource/"+topicId+"?rs="+id;

  }
return url;
}


  render() {
    return(
<tr >
  <td>
  [{this.props.result.category.toUpperCase()}] <a className="results" href={this.geturlCategory()}>{this.props.result.name}</a>
  </td>
</tr>

    )
  }
}

SearchListView.propTypes = {
  result: PropTypes.object.isRequired,
}
