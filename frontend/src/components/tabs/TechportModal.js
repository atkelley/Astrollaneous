import React, { Component, Fragment } from 'react';
import { getTechportProjectData } from '../apis/nasa';

class TechportModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      project: null
    }
  }

  componentDidMount() {
    this.fetchProjectData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.project !== prevProps.project) {
      this.fetchProjectData();
    }
  }


  fetchProjectData = async () => {
    try {
      await getTechportProjectData.get(`${this.props.project}`, { params: { api_key: process.env.NASA_TECHPORT_API_KEY } }).then(res => {
        this.setState({
          project: res.data.project
        });
      });
    } catch(error) {
      console.log(error);
    }
  }

  render() {   
    return (
      <div className="modal fade bd-example-modal-xl" id='techportModal' tabIndex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content techport-search-results-backdrop">
            <div className="modal-body embed-responsive-16by9">     
              { this.state.project && 
                <div className="container">
                  <div className="row">
                    <div className="col-md-6">
                      <span className="techport-search-left">
                        <a onClick={() => this.props.handleProjectSelect(this.props.previous)}><span className="fas fa-arrow-left fa-3x" aria-hidden="true"></span></a>
                      </span>
                    </div>
                    <div className="col-md-6">
                      <span className="techport-search-right">
                        <a onClick={() => this.props.handleProjectSelect(this.props.next)}><span className="fas fa-arrow-right fa-3x" aria-hidden="true"></span></a>
                      </span>
                    </div>
                  
                    <div className="col-md-12">
                      <div className="techport-search-property-container">
                        <h4><strong>Project Name:</strong></h4>
                        <span>
                          <a href={`https://techport.nasa.gov/view/${ this.state.project.projectId }`} target="_blank" rel="noopener noreferrer">{ this.state.project.title }</a>
                          { this.state.project.acronym && 
                            <span> (<strong>{ this.state.project.acronym }</strong>)</span>
                          }
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="techport-search-property-container">
                        <h4><strong>Responsible Program:</strong></h4>
                        <span>{ this.state.project.program.title }({ this.state.project.program.acronym })</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="techport-search-property-container">
                        <h4><strong>Lead Organization:</strong></h4>
                        { this.state.project.leadOrganization &&
                          <span>{this.state.project.leadOrganization.organizationName} - {this.state.project.leadOrganization.city}, {this.state.project.leadOrganization.stateTerritory.name}</span>
                        } 
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="techport-search-property-container">
                        <h4><strong>Start Date:</strong></h4>
                        <span>{ this.state.project.startDateString }</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="techport-search-property-container">
                        <h4><strong>End Date:</strong></h4>
                        <span>{ this.state.project.endDateString }</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="techport-search-property-container">
                        <h4><strong>Status:</strong></h4>
                        <span>{ this.state.project.statusDescription }</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="techport-search-property-container">
                        <h4><strong>Project Manager(s):</strong></h4>
                          {(this.state.project.projectManagers && this.state.project.projectManagers.length > 0) ?
                            <span>
                              {this.state.project.projectManagers.map((projectManager, index) => {
                                return <li key={index}>{ projectManager.fullNameInverted }</li>
                              })}
                            </span>
                          :
                            <span>CLASSIFIED</span>
                          }
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="techport-search-property-container">
                        <h4><strong>Program Director(s):</strong></h4>
                          {(this.state.project.programDirectors && this.state.project.programDirectors.length > 0) ?
                            <span>
                              {this.state.project.programDirectors.map((programDirector, index) => {
                                return <li key={index}>{ programDirector.fullNameInverted }</li>
                              })}
                            </span>
                          :
                            <span>CLASSIFIED</span>
                          }
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="techport-search-property-container">
                        <h4><strong>Principal Investigator(s):</strong></h4>
                          {(this.state.project.principalInvestigators && this.state.project.principalInvestigators.length > 0) ?
                            <span>
                              {this.state.project.principalInvestigators.map((principalInvestigator, index) => {
                                return <li key={index}>{ principalInvestigator.fullNameInverted }</li>
                              })}
                            </span>
                          :
                            <span>N/A</span>
                          }
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="techport-search-property-container">
                        <h4><strong>Description:</strong></h4>
                          {this.state.project.description ?
                            <span dangerouslySetInnerHTML={{__html: this.state.project.description}}></span>
                          :
                            <span>N/A</span>
                          } 
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="techport-search-property-container">
                        <h4><strong>Benefits:</strong></h4>
                          { this.state.project.benefits ?
                            <span dangerouslySetInnerHTML={{__html: this.state.project.benefits}}></span>
                          :
                            <span>CLASSIFIED</span>
                          } 
                      </div>
                    </div>
              
                    { this.state.project.closeoutSummary &&
                      <div className="col-md-12">
                        <div className="techport-search-property-container">
                          <h4><strong>Closeout Summary:</strong></h4>
                            { this.state.project.closeoutSummary &&
                              <span dangerouslySetInnerHTML={{__html: this.state.project.closeoutSummary}}></span>
                            }
                          <br />

                            {(this.state.project.libraryItems && this.state.project.libraryItems.length > 0) &&
                              <Fragment>
                                <h4><strong>Closeout Document(s):</strong></h4>
                                  <span>
                                    { this.state.project.libraryItems.map((document, index) => {
                                      return <li key={index}><a href={`${ document.url }`}>{ document.title }</a></li>
                                    })}
                                  </span>
                                  <br />
                              </Fragment>
                            }
                        </div>
                      </div>
                    }

                  </div>
                  <div className="row daily-row">
                    <div className="col-md-6">
                      <span className="techport-search-left">
                        <a onClick={() => this.props.handleProjectSelect(this.props.previous)}><span className="fas fa-arrow-left fa-3x" aria-hidden="true"></span></a>
                      </span>
                    </div>
                    <div className="col-md-6">
                      <span className="techport-search-right">
                        <a onClick={() => this.props.handleProjectSelect(this.props.next)}><span className="fas fa-arrow-right fa-3x" aria-hidden="true"></span></a>
                      </span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  };
}

export default TechportModal;