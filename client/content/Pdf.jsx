import React, {Component} from 'react';
import { PropTypes } from 'prop-types';

export default class PDF extends Component {

  render() {
    return (
      <div>


      <object className="pdfViewer" data={'/uploads/'+this.props.pdf.file}  type="application/pdf">

      <iframe   src={"/uploads/"+this.props.pdf.file}>
      </iframe>


      </object>

</div>
    )
  }

}

PDF.propTypes = {
  pdf: PropTypes.object.isRequired
}
