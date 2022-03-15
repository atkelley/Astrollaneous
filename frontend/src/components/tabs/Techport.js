import React, { Component, Fragment } from 'react';
import DatePicker from "react-datepicker";
import { getTechportData } from '../apis/nasa';
import TechportModal from './TechportModal';
import Loader from '../common/Loader';

import "react-datepicker/dist/react-datepicker.css";
import '../css/common/Common.css';
import '../css/tabs/Techport.css';

class Techport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      next: 0,
      previous: 0,
      projects: [],
      isLoading: false,
      selectedDate: new Date(),
      selectedProjectId: null
    }
  }

  componentDidMount() {
    this.handleDateSelect();
  }

  handleDateSelect = async (date = new Date()) => {
    try {
      await getTechportData.get('', { params: { updatedSince: `${ date.getFullYear() }-${ date.getMonth() + 1 }-${ date.getDate() }` } }).then(res => {
        this.setState({
          selectedDate: date,
          projects: (res.data.projects || [])
        });
      });
    } catch(error) {
      console.log(error);
    }
  }  

  handleProjectSelect = (index) => {
    this.setState({ 
      selectedProjectId: this.state.projects[index].projectId,
      previous: ((index == 0) ? this.state.projects.length - 1 : index - 1),
      next: ((index == this.state.projects.length - 1) ? 0 : index + 1)
    });
  }

  render() {
    return (
      <Fragment>
        { this.state.selectedProjectId && 
          <TechportModal previous={this.state.previous} next={this.state.next} project={this.state.selectedProjectId} handleProjectSelect={this.handleProjectSelect} />
        }
        
        <div className="container main-container">
          <div className="row">
            <div className="col-md-4">
              <div className="techport-search-input">
                <div className="techport-search-box">
                  <h6>Search by Date:</h6>
                  <DatePicker
                    selected={this.state.selectedDate}
                    onChange={(date) => this.handleDateSelect(date)}
                    popperPlacement="right"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="techport-search-info">
                <div className="row">
                  <div className="col-md-12">
                    <span className="techport-chevron"><i className="fa fa-chevron-circle-left fa-3x" aria-hidden="true"></i></span>
                    <p>Explore various early-stage concepts, prototypes, or fully-developed technologies with TechPort, using the <strong>"Search By Date"</strong> calendar to the left.</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <p>TechPort is an aggregation of technology investment information from developers, designers, architects, and engineers from across NASA. Techport's primary goal is to actualize these opportunities for collaboration and partnerships, through robust analyses and data visualizations.</p>  
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <p>For more information, visit the Techport website <a href="https://techport.nasa.gov/home" target="_blank" rel="noopener noreferrer">here</a>.</p>  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container main-container techport-search-results-backdrop">
          <div className="techport-results">
            <div className="row">
              <div className="col-md-12">
                <h1><strong>{this.state.projects.length} Projects found:</strong></h1>
                <hr />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <table>
                  <tbody>
                    {this.state.projects.length > 0 &&
                      this.state.projects.map((project, index) => {
                        return (
                          <tr key={index} className="techport-result">
                            <td className="techport-result-cell">
                              <button className="btn btn-outline-secondary" data-toggle="modal" data-target='#techportModal' onClick={() => this.handleProjectSelect(index)}>{project.projectId}</button>
                            </td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default Techport;