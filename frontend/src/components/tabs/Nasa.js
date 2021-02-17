import React, { Component, Fragment } from 'react';
import { capitalizeEveryFirstLetter, getConvertedDateString, getNewSlideIndex } from '../common/Common';
import { getNasaData } from '../apis/nasa';
import Loader from '../common/Loader';
import Image from '../iterables/Image';
import Video from '../iterables/Video';
import Audio from '../iterables/Audio';
import '../css/common/Common.css';
import '../css/tabs/Nasa.css';

class Nasa extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slideIndex: 0,
      selectedCollectionType: '',
      selectedCollection: [],
      convertedResults: {},
      searchTerm: '',
      isLoaded: false,
      isLoading: false,
      value: '',
      checkboxes: {
        'image': {checked: true },
        'video': {checked: true },
        'audio': {checked: true },
      }
    }
  }

  componentDidMount = () => {
    this.setState({
      checkboxes: {
        'image': {checked: true },
        'video': {checked: true },
        'audio': {checked: true },
      }
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    let convertedResults = {};
    let searchTerm = this.state.value;

    if (searchTerm && (this.state.checkboxes['image'].checked || this.state.checkboxes['video'].checked || this.state.checkboxes['audio'].checked)) {
      this.setState({ isLoading: true, isLoaded: false });

      try {
        const { data } = await getNasaData.get('/search', { params: { q: searchTerm } } );

        data.collection.items.forEach(item => {
          let searchObject = {
            'title': item.data[0].title,
            'nasa_id': item['data'][0]['nasa_id'],
            'create_date': getConvertedDateString(item.data[0].date_created),
            'description': (item.data[0].description || item.data[0].title),
            'json_url': item['href']
          }

          if (item.data[0].media_type == 'image') {
            searchObject.preview_image = item['links'][0]['href'];
            searchObject.author = item['data'][0]['photographer'];
          }

          if (item.data[0].media_type == 'video') {
            searchObject.preview_image = item['links'][0]['href'];
          }

          if (this.state.checkboxes[item.data[0].media_type].checked){
            (convertedResults[item.data[0].media_type]) ? convertedResults[item.data[0].media_type].push(searchObject) : convertedResults[item.data[0].media_type] = [searchObject];
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
    
    this.setState({ 
      value: '', 
      slideIndex: 0,
      selectedCollectionType: Object.keys(convertedResults)[0],
      convertedResults, 
      isLoading: false, 
      isLoaded: true, 
      searchTerm,
      checkboxes: {
        'image': {checked: true },
        'video': {checked: true },
        'audio': {checked: true },
      }
    });
  }

  selectCollection = (event) => {
    this.setState({ 
      slideIndex: 0,
      selectedCollectionType: event.target.value, 
      selectedCollection: this.state.convertedResults[event.target.value] 
    });
  }

  getHeaderTitle = () => {
    return `${ this.state.convertedResults[this.state.selectedCollectionType].length } ${ this.state.selectedCollectionType } result${(this.state.convertedResults[this.state.selectedCollectionType].length == 1) ? '' : 's'} for "${ this.state.searchTerm }":`;
  }

  handleNextSlide = (value) => {   
    this.setState({ slideIndex: getNewSlideIndex(value, this.state.slideIndex, this.state.convertedResults[this.state.selectedCollectionType]) });
  }

  onChangeCheckbox = (event) => {
    let checkboxes = this.state.checkboxes;
    checkboxes[event.target.value].checked = !checkboxes[event.target.value].checked;
    this.setState({ checkboxes });
  }

  render() {  
    return (
      <Fragment>
        <div className="container main-container">
          <div className="row daily-row">
            <div className="col-md-12">
              <form onSubmit={(event) => this.handleSubmit(event)}>
                <div className="nasa-search-input-container">
                  <input 
                    type="text"
                    name="nasa-search-input-field" 
                    className="nasa-search-input-field" 
                    placeholder='Search for...(e.g. "Orion")' 
                    value={this.state.value} 
                    onChange={(event) => this.setState({value: event.target.value})}   
                  />
                  <button type="submit" className="nasa-search-input-button"><i className="fa fa-search"></i></button><br />
                </div>
                <div className="nasa-search-checkbox-container">
                  {Object.keys(this.state.checkboxes).map((checkbox, index) => {
                    return (
                      <div key={index} className="nasa-search-checkbox">
                        <label>
                          <input 
                            type="checkbox" 
                            name="nasa_search_checkboxes" 
                            value={checkbox} 
                            onChange={(event) => this.onChangeCheckbox(event)} 
                            checked={this.state.checkboxes[checkbox].checked}
                          />{ capitalizeEveryFirstLetter(checkbox) }
                        </label>
                      </div>
                    )
                  })}
                </div>
              </form>
            </div>
          </div>
        </div>

        {this.state.isLoading &&
          <Loader />
        }

        {(this.state.isLoaded && !jQuery.isEmptyObject(this.state.convertedResults)) &&
          <div className="container main-container">
            <div className="row">
              <div className="col-md-12">
                <div className="results-header">
                  <h3 className="results-header-title"><strong>{ this.getHeaderTitle() }</strong></h3>
                  <div className="results-header-tab-selector">
                    {Object.keys(this.state.convertedResults).map((name, index) => {
                      return (
                        <button 
                          key={ index } 
                          className={ `results-header-tab ${index == 0 ? 'front' : ''}${this.state.selectedCollectionType == name ? ' active' : ''}${(index == Object.keys(this.state.convertedResults).length - 1) ? ' back' : ''}` } 
                          onClick={(event) => this.setState({ selectedCollectionType: event.target.value, slideIndex: 0 })} 
                          value={ name }>{ capitalizeEveryFirstLetter(name) }
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <hr />
            {this.state.selectedCollectionType == 'image' &&
              <div className="slideshow-container">
                <Image 
                  image={this.state.convertedResults[this.state.selectedCollectionType][this.state.slideIndex]} 
                  index={this.state.slideIndex} 
                  total={this.state.convertedResults[this.state.selectedCollectionType].length} 
                  showModal={(data) => this.props.showModal(data)} 
                  handleNextSlide={(value) => this.handleNextSlide(value)}
                />
              </div>
            }

            {this.state.selectedCollectionType == 'video' &&
              this.state.convertedResults[this.state.selectedCollectionType].map((item, index) => {
                return <Video key={index} video={item} showModal={(data) => this.props.showModal(data)} />
              })
            }

            {this.state.selectedCollectionType == 'audio' &&
              this.state.convertedResults[this.state.selectedCollectionType].map((item, index) => {
                return <Audio key={index} audio={item} />
              })
            }
          </div>
        }
        {(this.state.isLoaded && jQuery.isEmptyObject(this.state.convertedResults)) &&
          <div className="container main-container">
            <div className="row">
              <div className="col-md-12">
                No results found.
              </div>
            </div>
          </div>
        }
      </Fragment>
    )
  };
}

export default Nasa;