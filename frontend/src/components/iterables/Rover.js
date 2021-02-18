import React, { Component } from 'react';
import { getRoverData } from '../apis/nasa';
import { getConvertedDateString, capitalizeEveryFirstLetter, reformatDateString, getNewSlideIndex } from '../common/Common';
import DatePicker from "react-datepicker";
import Loader from '../common/Loader';
import "react-datepicker/dist/react-datepicker.css";
import '../css/common/Common.css';
import '../css/tabs/Nasa.css';

class Rover extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDateType: 'earth',
      selectedEarthDate: new Date(),
      selectedSolNumber: '1',
      selectedCamera: 'ALL',
      selectedCameraType: '',

      cameraData: {},
      slideIndex: 0,
      isLoaded: false,
      isLoading: false,
    }
  }

  handleNextSlide = (value) => {
    this.setState({ slideIndex: getNewSlideIndex(value, this.state.slideIndex, this.state.cameraData[this.state.selectedCameraType]) });
  }

  componentDidMount = () => {
    this.setState({
      selectedEarthDate: new Date(this.props.rover.max_date),
      selectedSolNumber: this.props.rover.max_sol - 1,
      selectedCamera: 'ALL',
      cameraData: {},
      slideIndex: 0,
      isLoaded: false,
      isLoading: false
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    let cameraData = {}

    try {
      this.setState({ isLoading: true, isLoaded: false });
      const { data: { photos } } = await getRoverData.get(`${this.props.rover.name.toLowerCase()}/photos`, {
        params: {
          ...(this.state.selectedDateType == 'earth' ? { earth_date: `${this.state.selectedEarthDate.getFullYear()}-${this.state.selectedEarthDate.getMonth()+1}-${this.state.selectedEarthDate.getDate()}` } : {}),
          ...(this.state.selectedDateType == 'sol' ? { sol: this.state.selectedSolNumber } : {}),
          ...(this.state.selectedCamera != 'ALL' ? { camera: this.state.selectedCamera.toLowerCase() } : {}),
          api_key: `${(process.env.NASA_API_KEY) || env['NASA_API_KEY']}`
        },
      });

      photos.forEach(photo => {
        (cameraData[photo.camera.name]) ? cameraData[photo.camera.name].push(photo.img_src) : cameraData[photo.camera.name] = [photo.img_src];
      });

    } catch (error) {
      console.log(error);
    }
    
    this.setState({ 
      cameraData,
      selectedCameraType: (Object.keys(cameraData).length > 0) ? Object.keys(cameraData)[0] : '',
      selectedDateType: 'earth',
      selectedEarthDate: new Date(this.props.rover.max_date),
      selectedSolNumber: this.props.rover.max_sol - 1,
      selectedCamera: 'ALL',
      isLoading: false, 
      isLoaded: true 
    });
  }

  render() {
    const { name, status, launch_date, landing_date, max_date, max_sol, cameras } = this.props.rover;

    return (
      <div className="container main-container">
        <div className="row">
          <div className="col-md-4">
            
            <div className="row">
              <a className="rover-image-anchor" data-toggle="modal" data-target='#modal' onClick={() => this.props.showModal({'isImage': true, 'modalUrl': `/static/mySpaceStuff/img/${ name.toLowerCase() }_large.jpg`, 'modalAuthor': 'NASA' })}>
                <img src={`/static/mySpaceStuff/img/${ name.toLowerCase() }.jpg`} alt={ name } className="rover-image" />
              </a>
            </div>

            <div className="rover-stats">
              <p className="rover-stats-title">Rover: <a href={`https://en.wikipedia.org/wiki/${ name }_(rover)`} target="_blank" rel="noopener noreferrer">{ name }</a></p>
              <p>Launched: { getConvertedDateString(launch_date) }</p>
              <p>Landed: { getConvertedDateString(landing_date) }</p>
              <p>Latest: { getConvertedDateString(max_date) }</p>
              <p>Status: 
                {status == 'active' ? 
                  <span className="rover-active"> { capitalizeEveryFirstLetter(status) }</span>
                :
                  <span className="rover-complete"> { capitalizeEveryFirstLetter(status) }</span>
                } 
              </p>
            </div>

            <div className="row">
              <div className="rover-table-container">
                {cameras && 
                  <table className="rover-table">
                    <thead className="thead-dark">
                      <tr>
                        <th>Acronym</th>
                        <th>Camera</th>
                      </tr>
                    </thead>
                    <tbody>
                      { cameras.map((camera, index) => {
                        return <tr key={index}><td>{camera.name}</td><td>{camera.full_name}</td></tr>
                      })}
                    </tbody>
                  </table>
                }
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="rover-search">
              <div className="rover-search-title"><strong>Search Rover Photos by date (either Earth or Sol number) or camera (or both!)</strong></div>
            
              <form onSubmit={(event) => this.handleSubmit(event)}>        
                <div className="row">
                  <div className="col-md-5">
                    <label htmlFor="earth">
                      <div className="rover-search-dates">
                        <div className="rover-first-line">
                          <input 
                            id="earth"
                            type="radio" 
                            name="date_type_selector" 
                            value="earth"  
                            className="rover-search-date-checkbox"
                            onChange={(event) => this.setState({ selectedDateType: event.target.value })} 
                            checked={(this.state.selectedDateType == 'earth')}
                          /> 
                          <p className="rover-search-earth-title">By Earth</p>
                          <DatePicker
                            selected={this.state.selectedEarthDate}
                            onChange={(date) => this.setState({ selectedEarthDate: date })}
                          />
                        </div>
                      
                        <p className="rover-search-earth-text"><em>Date range: </em></p>
                        <p className="rover-search-earth-text"><em>{ reformatDateString(landing_date) } to { reformatDateString(max_date) }</em></p>
                      </div>
                    </label>

                    <label htmlFor="sol">
                      <div className="rover-search-dates">
                        <div className="rover-first-line">
                          <input 
                            id="sol" 
                            type="radio" 
                            name="date_type_selector" 
                            value="sol" 
                            className="rover-search-date-checkbox"
                            onChange={(event) => this.setState({ selectedDateType: event.target.value })} 
                            checked={(this.state.selectedDateType == 'sol')}
                          /> 
                          <p className="rover-search-sol-title">By Sol</p>
                          <input 
                            id="number"
                            type="number" 
                            min="1" 
                            max={this.props.max_sol} 
                            className="rover-search-sol-input"
                            value={this.state.selectedSolNumber}
                            onChange={(event) => this.setState({ selectedSolNumber: event.target.value })}
                          />
                        </div>

                        <p className="rover-search-sol-text"><em>Sol range: </em></p>
                        <p className="rover-search-sol-text"><em>Day 1 to Day { max_sol - 1 }</em></p>
                      </div>
                    </label>
                  </div>

                  <div className="col-md-7">
                    <div className="rover-search-cameras">
                      <p>By Camera:</p>
                      <div key={-1} className="form-check">
                        <input 
                          id='ALL' 
                          type="radio" 
                          name="camera_selector" 
                          value='ALL' 
                          className="form-check-input" 
                          onChange={(event) => this.setState({ selectedCamera: event.target.value })} 
                          checked={(this.state.selectedCamera == 'ALL' )} 
                        />
                        <label className="form-check-label" forhtml='ALL'>ALL (all available rover photos)</label>
                      </div>

                      { cameras.map((camera, index) => {
                        return (
                          <div key={index} className="form-check">
                            <input 
                              id={ camera.name } 
                              type="radio" 
                              name="camera_selector" 
                              value={ camera.name } 
                              className="form-check-input" 
                              onChange={(event) => this.setState({ selectedCamera: event.target.value })} 
                              checked={(this.state.selectedCamera == camera.name )} 
                            />
                            <label className="form-check-label" forhtml={ camera.name }>
                              { camera.name } ({ camera.full_name })
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="row rover-submit">
                  <div className="col-md-12">
                    <button type="submit" className="btn btn-primary btn-block rover-submit-button">Search</button>
                  </div>
                </div>       
              </form>
            </div>

            {this.state.isLoading &&
              <Loader />
            }

            {(!jQuery.isEmptyObject(this.state.cameraData)) &&
              <div className="container main-container rover-container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="results-header-tab-selector rover-tabs-box">
                      {Object.keys(this.state.cameraData).map((name, index) => {
                        return (
                          <button 
                            key={ index } 
                            className={ `results-header-tab ${index == 0 ? 'front' : ''}${this.state.selectedCameraType == name ? ' active' : ''}${(index == Object.keys(this.state.cameraData).length - 1) ? ' back' : ''}` } 
                            onClick={(event) => this.setState({ selectedCameraType: event.target.value, slideIndex: 0 })} 
                            value={ name }>{ name }
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {(this.state.cameraData[this.state.selectedCameraType] && (this.state.cameraData[this.state.selectedCameraType].length > 0)) &&
                  <div className="slideshow-container">
                    <div className="slides fade-in" value={ this.state.slideIndex }>
                      <div className="slides-wrapper">
                        <div className="slide-counter">{ this.state.slideIndex + 1 } / { this.state.cameraData[this.state.selectedCameraType].length }</div>
                        <a data-toggle="modal" data-target='#modal' onClick={() => this.props.showModal({'isImage': true, 'modalUrl': this.state.cameraData[this.state.selectedCameraType][this.state.slideIndex], 'modalAuthor': capitalizeEveryFirstLetter(name) })}>
                          <img src={ this.state.cameraData[this.state.selectedCameraType][this.state.slideIndex] } alt={`${ name } - ${ this.state.selectedCameraType } - ${ this.state.slideIndex + 1 }`} />
                        </a>
                        <span className="prev" onClick={() => this.handleNextSlide(-1)}>&#10094;</span>
                        <span className="next" onClick={() => this.handleNextSlide(1)}>&#10095;</span> 
                      </div>
                      <div className="slide-description">{`${ name } - ${ this.state.selectedCameraType } - ${ this.state.slideIndex + 1 }`}</div>
                    </div>
                  </div>
                }
              </div>
            }
            {(jQuery.isEmptyObject(this.state.cameraData) && this.state.isLoaded)  &&
              <div className="container main-container rover-container">
                <div className="row">
                  <div className="col-md-12">
                    No results found.
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Rover;