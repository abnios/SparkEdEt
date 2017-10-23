import React, {Component} from 'react';
import { PropTypes } from 'prop-types';
import ViewResource from './ViewResource.jsx';

export default class ViewFrame extends Component {

  renderResources() {
    var index = 0;
    return this.props.resources.map((resource) => (<ViewResource key={index++} resource={resource}/>));
  }
  getUrl(event) {
    var sectionId = FlowRouter.getQueryParam('scid');
    if (!sectionId) {
      $('.p-topics').hide();
    }
    var url = '/contents/' + sectionId + '?rs=' + FlowRouter.getParam('_id');
    return url;
  }
  render() {
    return (
        <div className="resource-side-nav side-nav fixed">
            <div className="sideNavHeadingUnderline">
                <a title="Go back to Topics" id="backButtonLink" href={this.getUrl()}>
                    <i className="fa fa-chevron-circle-left fa-lg"/>
                </a>
                <p className="sideNavHeading">Resources</p>
            </div>
            {/*begin list */}
            <ul>
                {this.renderResources()}
            </ul>
            {/* end list (ul) */}
        </div>

);
}
}

ViewFrame.propTypes = {
//	topic: PropTypes.string.isRequired,
	resources: PropTypes.array.isRequired,
};
