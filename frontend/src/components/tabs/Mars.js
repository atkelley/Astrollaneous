import React, { Component, Fragment } from 'react';
import { getConvertedDateString } from '../common/Common';
import { getMarsWeatherData } from '../apis/nasa';
import Loader from '../common/Loader';
import '../css/common/Common.css';
import '../css/tabs/Mars.css';

class Mars extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weatherData: [],
      isLoaded: false,
      selectedSol: null,
      selectedSolData: {},
      selectedTemps: [],
      selectedSpeeds: [],
      selectedPressures: []
    };
  }

  componentDidMount() {
    this.getMarsWeather();
  }

  getMarsWeather = async () => {
    try {
      let weatherData = [];
      const { data } = await getMarsWeatherData.get();
      
      Object.keys(data).forEach((key) => {
        if (Number.isInteger(parseInt(key))) {
          let solDataObj = {};
          let sol = data[key];

          for (const [metric, value] of Object.entries(sol)) {
            switch(metric) {
              case 'Season':
                solDataObj['season'] = value;
                break;
              case 'First_UTC':
                solDataObj['date_string'] = getConvertedDateString(value);
                break;
              case 'WD':
                solDataObj['most_common_wind_direction'] = (value['most_common']) ? value['most_common']['compass_point'] : 'N/A';
                break;
              case 'AT':
                delete value['ct'];
                value['unit'] = '°C';
                solDataObj[metric] = value;
                break;
              case 'HWS':
                delete value['ct'];
                value['unit'] = 'm/s';
                solDataObj[metric] = value;
                break;
              case 'PRE':
                delete value['ct'];
                value['unit'] = 'Pa';
                solDataObj[metric] = value;
                break;
              default:
                break;
            }
          }

          weatherData.unshift({[key]: solDataObj});  
        }
      });

      let defaultSol = weatherData[0];

      this.setState({
        weatherData,
        selectedSolData: defaultSol,
        selectedSol: Object.keys(defaultSol)[0],
        selectedTemps: (Object.values(defaultSol)[0]['AT'] == undefined) ? ['N/A', 'N/A', 'N/A'] : this.parseMetricObject(Object.values(defaultSol)[0]['AT']),
        selectedSpeeds: (Object.values(defaultSol)[0]['HWS'] == undefined) ? ['N/A', 'N/A', 'N/A'] : this.parseMetricObject(Object.values(defaultSol)[0]['HWS']),
        selectedPressures: (Object.values(defaultSol)[0]['PRE'] == undefined) ? ['N/A', 'N/A', 'N/A'] : this.parseMetricObject(Object.values(defaultSol)[0]['PRE']),
        isLoaded: true
      });
    } catch(error) {
      console.log(error);
    }
  }

  parseMetricObject = (solMetricObject) => {
    let solMetricArray = [];
    const { unit, ...metrics } = solMetricObject;
  
    for(const value of Object.values(metrics)) {
      solMetricArray.push(`${Math.round(value * 100) / 100} ${unit}`);
    }

    return solMetricArray;
  }

  convertMetric = (unit, value) => {
    switch (unit) {
      case('°C'):
      case('°F'):
        return (unit == '°C') ? `${(Math.round(((value - 32) * 5/9) * 100) / 100)} ${unit}` : `${(Math.round(((value * 9/5) + 32) * 100) / 100)} ${unit}`;
      case('m/s'):
      case('mph'):
        return (unit == 'm/s') ? `${(Math.round((value / 2.237) * 100) / 100)} ${unit}` : `${(Math.round((value * 2.237) * 100) / 100)} ${unit}`;
      case('Pa'):
      case('mm Hg'):
        return (unit == 'Pa') ? `${(Math.round((value * 133) * 100) / 100)} ${unit}` : `${(Math.round((value / 133) * 100) / 100)} ${unit}`;
      default:
        break;
    }
  }

  convertMetricObject = (object, newUnit) => {
    let solMetricArray = [];
    const { unit, ...values } = object;
  
    for(const value of Object.values(values)) {
      solMetricArray.push(this.convertMetric(newUnit, value));
    }

    return solMetricArray;
  }

  selectSol = (event) => {
    this.state.weatherData.forEach(sol => {
      let selectedSol = Object.keys(sol)[0];

      if (selectedSol == event.target.value) {
        this.setState({ 
          selectedSol, 
          selectedSolData: sol,
          selectedTemps: (Object.values(sol)[0]['AT'] == undefined) ? ['N/A', 'N/A', 'N/A'] : this.parseMetricObject(Object.values(sol)[0]['AT']),
          selectedSpeeds: (Object.values(sol)[0]['HWS'] == undefined) ? ['N/A', 'N/A', 'N/A'] : this.parseMetricObject(Object.values(sol)[0]['HWS']),
          selectedPressures: (Object.values(sol)[0]['PRE'] == undefined) ? ['N/A', 'N/A', 'N/A'] : this.parseMetricObject(Object.values(sol)[0]['PRE']),
        });
      }
    });

    for(let metric of ['temp', 'pressure', 'speed']) {
      let units = document.getElementsByClassName(metric);
      units[0].className = metric;
      units[1].className = `${metric} toggle`;
    }
  }

  metricClickHandler = (event) => {
    let clicked = document.getElementById(event.target.id);
    let clickedClassList = clicked.className.split(' ');
  
    if (clickedClassList.length > 1) {
      let selectedRow = document.getElementsByClassName(clickedClassList[0]);
      let first = selectedRow[0];
      let second = selectedRow[1];

      if (second === clicked) {
        let x = first.className;
        first.className = second.className;
        second.className = x;
      } else {
        let x = second.className;
        second.className = first.className;
        first.className = x;
      }

      if (clicked.id == '°F') {
        this.setState({
          selectedTemps: (Object.values(this.state.selectedSolData)[0]['AT'] == undefined) ? ['N/A', 'N/A', 'N/A'] : this.convertMetricObject(Object.values(this.state.selectedSolData)[0]['AT'], clicked.id)
        });
      } 

      if (clicked.id == '°C') {
        this.setState({
          selectedTemps: (Object.values(this.state.selectedSolData)[0]['AT'] == undefined) ? ['N/A', 'N/A', 'N/A'] : this.parseMetricObject(Object.values(this.state.selectedSolData)[0]['AT'])
        });
      }
      
      if (clicked.id == 'mph') {
        this.setState({
          selectedSpeeds: (Object.values(this.state.selectedSolData)[0]['HWS'] == undefined) ? ['N/A', 'N/A', 'N/A'] : this.convertMetricObject(Object.values(this.state.selectedSolData)[0]['HWS'], clicked.id)
        });
      }

      if (clicked.id == 'm/s') {
        this.setState({
          selectedSpeeds: (Object.values(this.state.selectedSolData)[0]['HWS'] == undefined) ? ['N/A', 'N/A', 'N/A'] : this.parseMetricObject(Object.values(this.state.selectedSolData)[0]['HWS'])
        });
      }

      if (clicked.id == 'mm Hg') {
        this.setState({
          selectedPressures: (Object.values(this.state.selectedSolData)[0]['PRE'] == undefined) ? ['N/A', 'N/A', 'N/A'] : this.convertMetricObject(Object.values(this.state.selectedSolData)[0]['PRE'], clicked.id)
        });
      }

      if (clicked.id == 'Pa') {
        this.setState({
          selectedPressures: (Object.values(this.state.selectedSolData)[0]['PRE'] == undefined) ? ['N/A', 'N/A', 'N/A'] : this.parseMetricObject(Object.values(this.state.selectedSolData)[0]['PRE'])
        });
      }
    }
  }

  render() {
    return (
      <Fragment>
        { this.state.isLoaded ?
          <Fragment>
            <div className="container mars-container">
              <div className="row">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-3 mars-header__left">
                      <img src="/static/mySpaceStuff/img/mars-icon.png" className="mars-header__icon" alt="Mars Icon" />
                    </div>
                    <div className="col-md-9">
                      <div className="row">
                        <h2><strong>Mars Daily Weather</strong></h2>
                        <p className="mars-text">The InSight lander is taking daily weather measurements on Mars from <a className="mars-insight-link" data-toggle="modal" data-target="#mainModal"><b>Elysium Planitia</b></a> (a flat, smooth plain near Mars’ equator).</p>
                        <p className="mars-text"><a href="https://mars.nasa.gov/insight/" target="_blank" rel="noopener noreferrer">Click for more information about NASA's InSight program.</a></p>
                      </div>
                      <div className="row">
                        <div className="mars-header__dropdown-box">
                          <select className="mars-header__select" value={this.state.selectedSol} onChange={(event) => this.selectSol(event)}>
                            {this.state.weatherData.map((day, index) => {
                              return (
                                <Fragment key={index}>
                                {Object.entries(day).map(([key, value]) => {
                                  return (<option className="mars-header__option" key={key} value={key}>Sol {key} - {value.date_string}</option>);
                                })};
                                </Fragment>
                              )
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <table className="mars-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th className="mars-table__cell">Avg.</th>
                      <th className="mars-table__cell">Min.</th>
                      <th className="mars-table__cell">Max.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="mars-table__row-title">Temperature (<span className='temp' id="°C" onClick={this.metricClickHandler}>°C</span> | <span className='temp toggle' id="°F" onClick={this.metricClickHandler}>°F</span>)</td>
                      {this.state.selectedTemps.map((temp, index) => {
                        return (
                          <td key={index} className="mars-table__cell">{temp}</td>
                        )
                      })}
                    </tr>
                    <tr>
                    <td className="mars-table__row-title">Pressure (<span className='pressure' id="Pa" onClick={this.metricClickHandler}>Pa</span> | <span className='pressure toggle' id="mm Hg" onClick={this.metricClickHandler}>mm Hg</span>)</td>
                      {this.state.selectedPressures.map((pressure, index) => {
                        return (
                          <td key={index} className="mars-table__cell">{pressure}</td>
                        )
                      })}
                    </tr> 
                    <tr>
                      <td className="mars-table__row-title">Wind Speed (<span className='speed' id="m/s" onClick={this.metricClickHandler}>m/s</span> | <span className='speed toggle' id="mph" onClick={this.metricClickHandler}>mph</span>)</td>
                      {this.state.selectedSpeeds.map((speed, index) => {
                        return (
                          <td key={index} className="mars-table__cell">{speed}</td>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal fade bd-example-modal-lg" id="mainModal" tabIndex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-body embed-responsive-16by9">
                    <img itemProp="image" src="/static/mySpaceStuff/img/mars-surface.jpg" className="img-rounded" style={{ width: "100%", height: "auto" }} />
                    <p className="modal-title float-left" id="modalLabel"><em>NASA/JPL-Caltech &copy; 2021</em></p>
                    <button type="button" className="btn btn-secondary button-float-right" data-dismiss="modal">Close</button>
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

export default Mars;