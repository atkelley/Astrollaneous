import React, { Component, Fragment } from 'react';
import SatelliteDataService from "../../services/satellite.service";
import Loader from '../common/Loader';

import '../css/common/Common.css';
import '../css/tabs/Satellites.css';

const DEFAULT_CHECKED = 'noaa';

class Satellites extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isLoaded: false,
      checked: DEFAULT_CHECKED,
      satellite: {}
    }
  }

  componentDidMount = () => {
    this.fetchSatelliteData(DEFAULT_CHECKED);
  }

  componentWillUnmount = () => { 
    if ($("#cesiumContainer").length) {
      var viewer = new Cesium.Viewer("cesiumContainer", { shouldAnimate: true, });
      viewer.entities.removeAll();
      viewer.dataSources.removeAll();
      viewer.destroy();
    }
  }

  fetchSatelliteData = async (name) => {
    if(!this.state.isLoading) {
      this.setState({ isLoading: true });

      await SatelliteDataService.getSatellite(name)
      .then(response => {
        if (response.status == 200) {
          this.setState({ isLoaded: true, isLoading: false, satellite: response.data });
          Cesium.Ion.defaultAccessToken = process.env.CESIUM_TOKEN;
          var viewer = new Cesium.Viewer("cesiumContainer", { shouldAnimate: true, });
          viewer.entities.removeAll();
          viewer.dataSources.add( Cesium.CzmlDataSource.load(`/static/mySpaceStuff/tle2czml/tle_${name}.czml`) );
          let collapseTop = document.getElementById('collapseTop');
          collapseTop.classList.remove("show");
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  handleOnChange = (event) => {
    this.setState({ isLoading: true, isLoaded: false });
    this.fetchSatelliteData(event.target.value);
  }

  render() {
    return (
      <Fragment>
        {this.state.satellite &&
          <div className="container">
            <div className="row">
              <div className="col-md-12 satellites-top">
                <div className="accordion" id="accordionTop">
                  <div className="" id="headingTop">
                    <h2 className="mb-0">
                      <span className="satellite-title-box" type="button" data-toggle="collapse" data-target="#collapseTop" aria-expanded="true" aria-controls="collapseTop">
                        <span className="satellite-title">{this.state.satellite.title}</span>
                        <span className="satellite-icon"><i className="fas fa-angle-down"></i></span>
                      </span>
                    </h2>
                  </div>
                  <div id="collapseTop" className="collapse" aria-labelledby="headingTop" data-parent="#accordionTop">
                    <div className="satellite-text">
                      <hr className="satellite-rule" />
                      <p>{this.state.satellite.text}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        <div className="container">
          <div className="row">
            <div className="col-md-9 satellites-left">
              { this.state.isLoaded ? <div id="cesiumContainer" className="fullSize"></div> : <Loader />}
            </div>

            <div className="col-md-3">
              <div className="satellites-right">
                <div id="accordion">
                  <div className="card">
                    <div className="card-header" id="headingTwo">
                      <h5 className="mb-0">
                        <span className="satellite-tab" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                          <span>Weather & Earth</span><span className="satellite-icon"><i className="fas fa-angle-down"></i></span>
                        </span>
                      </h5>
                    </div>
                    <div id="collapseTwo" className="collapse show" aria-labelledby="headingTwo" data-parent="#accordion">
                      <div className="card-body">
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="noaa" onChange={(event) => this.handleOnChange(event)} onClick={(event) => this.setState({ checked: event.target.value })} checked={(this.state.checked == 'noaa')} />
                          <label className="form-check-label" forhtml="exampleRadios1">NOAA</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="goes" onChange={(event) => this.handleOnChange(event)} onClick={(event) => this.setState({ checked: event.target.value })} checked={(this.state.checked == 'goes')} />
                          <label className="form-check-label" forhtml="exampleRadios1">GOES</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="argos" onChange={(event) => this.handleOnChange(event)} onClick={(event) => this.setState({ checked: event.target.value })} checked={(this.state.checked == 'argos')} />
                          <label className="form-check-label" forhtml="exampleRadios1">ARGOS</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header" id="headingThree">
                      <h5 className="mb-0">
                        <span className="satellite-tab" data-toggle="collapse" data-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                          <span>Communications</span><span className="satellite-icon"><i className="fas fa-angle-down"></i></span>
                        </span>
                      </h5>
                    </div>
                    <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                      <div className="card-body">
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="ses" onChange={(event) => this.handleOnChange(event)} onClick={(event) => this.setState({ checked: event.target.value })} checked={(this.state.checked == 'ses')} />
                          <label className="form-check-label" forhtml="exampleRadios1">SES</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="orbcomm" onChange={(event) => this.handleOnChange(event)} onClick={(event) => this.setState({ checked: event.target.value })} checked={(this.state.checked == 'orbcomm')} />
                          <label className="form-check-label" forhtml="exampleRadios1">Orbcomm</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="swarm" onChange={(event) => this.handleOnChange(event)} onClick={(event) => this.setState({ checked: event.target.value })} checked={(this.state.checked == 'swarm')} />
                          <label className="form-check-label" forhtml="exampleRadios1">Swarm</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header" id="headingFour">
                      <h5 className="mb-0">
                        <span className="satellite-tab" data-toggle="collapse" data-target="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
                          <span>Navigation</span><span className="satellite-icon"><i className="fas fa-angle-down"></i></span>
                        </span>
                      </h5>
                    </div>
                    <div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-parent="#accordion">
                      <div className="card-body">
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="galileo" onChange={(event) => this.handleOnChange(event)} onClick={(event) => this.setState({ checked: event.target.value })} checked={(this.state.checked == 'galileo')} />
                          <label className="form-check-label" forhtml="exampleRadios1">Galileo</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="beidou" onChange={(event) => this.handleOnChange(event)} onClick={(event) => this.setState({ checked: event.target.value })} checked={(this.state.checked == 'beidou')} />
                          <label className="form-check-label" forhtml="exampleRadios1">BeiDou</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="gps-ops" onChange={(event) => this.handleOnChange(event)} onClick={(event) => this.setState({ checked: event.target.value })} checked={(this.state.checked == 'gps-ops')} />
                          <label className="form-check-label" forhtml="exampleRadios1">GPS</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header" id="headingFive">
                      <h5 className="mb-0">
                        <span className="satellite-tab" data-toggle="collapse" data-target="#collapseFive" aria-expanded="true" aria-controls="collapseFive">
                          <span>Scientific</span><span className="satellite-icon"><i className="fas fa-angle-down"></i></span>
                        </span>
                      </h5>
                    </div>
                    <div id="collapseFive" className="collapse" aria-labelledby="headingFive" data-parent="#accordion">
                      <div className="card-body">
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="geodetic" onChange={(event) => this.handleOnChange(event)} onClick={(event) => this.setState({ checked: event.target.value })} checked={(this.state.checked == 'geodetic')} />
                          <label className="form-check-label" forhtml="exampleRadios1">Geodetic</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="science" onChange={(event) => this.handleOnChange(event)} onClick={(event) => this.setState({ checked: event.target.value })} checked={(this.state.checked == 'science')} />
                          <label className="form-check-label" forhtml="exampleRadios1">Space & Earth Science</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="engineering" onChange={(event) => this.handleOnChange(event)} onClick={(event) => this.setState({ checked: event.target.value })} checked={(this.state.checked == 'engineering')} />
                          <label className="form-check-label" forhtml="exampleRadios1">Engineering</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header" id="headingOne">
                      <h5 className="mb-0">
                        <span className="satellite-tab" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                          <span>Special Interest</span><span className="satellite-icon"><i className="fas fa-angle-down"></i></span>
                        </span>
                      </h5>
                    </div>
                    <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                      <div className="card-body">
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="education" onChange={(event) => this.handleOnChange(event)} onClick={(event) => this.setState({ checked: event.target.value })} checked={(this.state.checked == 'education')} />
                          <label className="form-check-label" forhtml="exampleRadios1">Education</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="amateur" onChange={(event) => this.handleOnChange(event)} onClick={(event) => this.setState({ checked: event.target.value })} checked={(this.state.checked == 'amateur')} />
                          <label className="form-check-label" forhtml="exampleRadios1">Amateur radio</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="radar" onChange={(event) => this.handleOnChange(event)} onClick={(event) => this.setState({ checked: event.target.value })} checked={(this.state.checked == 'radar')} />
                          <label className="form-check-label" forhtml="exampleRadios1">Radar</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    )
  };
}

export default Satellites;