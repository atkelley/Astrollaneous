import React, { Component, Fragment } from 'react';
import { getRoverData } from '../apis/nasa';
import Loader from '../common/Loader';
import Rover from '../iterables/Rover';
import '../css/common/Common.css';
import '../css/tabs/Rovers.css';

const DEFAULT_TAB = 'curiosity';

class Rovers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      rover: null
    }
  }

  componentDidMount = () => {
    this.getRoverData(DEFAULT_TAB);
  }

  getRoverData = async (name) => {
    this.setState({ isLoaded: false });
    
    try {
      const { data: { rover } } = await getRoverData.get(`${name}/`, {params: { api_key: `${process.env.NASA_API_KEY}` } } );
      this.setState({ rover, isLoaded: true });
    } catch(error) {
      console.log(error);
    }
  }

  handleTabClick = (event) => {
    event.preventDefault();
    this.handleTabChange(event);
    this.getRoverData(event.target.id);
  }

  handleTabChange = (event) => {
    $('#nav-tabs a').each(function() { 
      if($(this).is(`#${event.target.id}`)) {
        if(!$(this).is('.show, .active')) {
          $(this).toggleClass('show active');
        }
      } else {
        $(this).removeClass('show active');
      }
    });  
  }

  render() {
    return (
      <Fragment>
        <div className="container main-container">
          <div className="row">
            <div className="col-md-12">
              <nav>
                <div className="nav nav-tabs" id="nav-tabs" role="tablist">
                  <a className="nav-link active" id="curiosity" href="" role="tab" onClick={(event) => this.handleTabClick(event)}>Curiosity</a>
                  <a className="nav-link" id="spirit" href="" role="tab" onClick={(event) => this.handleTabClick(event)}>Spirit</a>
                  <a className="nav-link" id="opportunity" href="" role="tab" onClick={(event) => this.handleTabClick(event)}>Opportunity</a>
                </div>
              </nav>
              { this.state.isLoaded ? <Rover rover={this.state.rover} showModal={this.props.showModal} /> : <Loader /> }
            </div>
          </div>
        </div>
      </Fragment>
    )
  };
}

export default Rovers;