import React, { Component, Fragment, forwardRef } from 'react';
import DatePicker, { CalendarContainer } from "react-datepicker";
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
      isLoading: false,
      selectedDate: null,
      selectedProjectId: null,
      selectedProjects: [],
    }
  }

  componentDidMount() {
    this.getTechporDataList();
  }

  getTechporDataList = async () => {
    this.setState({  
      isLoading: true
    });

    try {
      await getTechportData.get('').then(res => {
        let projectDatesObject = {};
        if (res.data.projects && res.data.projects.length > 0) {
          res.data.projects.forEach((project) => {
            if (project.lastUpdated in projectDatesObject) {
              projectDatesObject[project.lastUpdated].push(project.projectId);
            } else {
              projectDatesObject[project.lastUpdated] = [project.projectId];
            }
          });
        }
        
        let projectDates = Object.keys(projectDatesObject);
        const mostRecentDate = new Date(projectDates[0]);

        this.setState({
          isLoading: false,
          selectedDate: mostRecentDate,
          selectedProjects: projectDatesObject[projectDates[0]],
          projectDatesObject
        });
      });
    } catch(error) {
      console.log(error);
    }
  }

  handleDateSelect = (date) => {   
    const selectedDateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    if (selectedDateString in this.state.projectDatesObject) {
      const selectedDate = new Date(selectedDateString);

      this.setState({
        selectedProjects: this.state.projectDatesObject[selectedDateString],
        selectedDate
      });
    }
  }  

  handleProjectSelect = (index) => {
    this.setState({ 
      selectedProjectId: this.state.selectedProjects[index],
      previous: ((index == 0) ? this.state.selectedProjects.length - 1 : index - 1),
      next: ((index == this.state.selectedProjects.length - 1) ? 0 : index + 1)
    });
  }

  render() {
    const MyContainer = ({ className, children }) => {
      return (
        <CalendarContainer className={className}>
          <div>{children}</div>
        </CalendarContainer>
      );
    };
    const hasProjects = (date) => {
      const selectedDateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      if (selectedDateString in this.state.projectDatesObject) {
        return true;
      } else {
        return false
      }
    };

    const TechportCustomInput = forwardRef(({ value, onClick, onChange }, ref) => (
      <input
        value={value}
        className="techport-custom-input"
        onClick={onClick}
        onChange={onChange}
        ref={ref}
      ></input>
    ));
    return (
      <Fragment>
        { this.state.selectedProjectId && 
          <TechportModal previous={this.state.previous} next={this.state.next} project={this.state.selectedProjectId} handleProjectSelect={this.handleProjectSelect} />
        }
        { !this.state.isLoading ?
          <Fragment>
            <div className="container main-container">
            <div className="row">
              <div className="col-md-4">
                <div className="techport-search-input">
                  <div className="techport-search-box">
                    <h6>Search by Date:</h6>
                    <DatePicker
                      selected={this.state.selectedDate}
                      onChange={(date) => this.handleDateSelect(date)}
                      customInput={<TechportCustomInput />}
                      popperPlacement="right"
                      calendarContainer={MyContainer}
                      closeOnScroll={true}
                      filterDate={hasProjects}
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
                  <h1><strong>{this.state.selectedProjects.length} Projects found:</strong></h1>
                  <hr />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <table>
                    <tbody>
                      {this.state.selectedProjects.length > 0 &&
                        this.state.selectedProjects.map((projectId, index) => {
                          return (
                            <tr key={index} className="techport-result">
                              <td className="techport-result-cell">
                                <button className="btn btn-outline-secondary" data-toggle="modal" data-target='#techportModal' onClick={() => this.handleProjectSelect(index)}>{projectId}</button>
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
        :
        <Loader />
      }
      </Fragment>
    )
  }
}

export default Techport;