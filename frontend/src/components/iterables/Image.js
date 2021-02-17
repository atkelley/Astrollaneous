import React, { Component, Fragment } from 'react';
import axios from 'axios';

class Image extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showTruncatedText: true,
      imageUrl: ''
    }
  }

  togglePostText = () => {
    this.setState({ showTruncatedText: !this.state.showTruncatedText });
  }

  componentDidMount = () => {
    this.getImageFile();
  }

  componentDidUpdate(prevProps) {
    if (this.props.image.json_url !== prevProps.image.json_url) {
      this.getImageFile();
    }
  }

  getImageFile = async () => {
    try {
      const { data } = await axios.get(this.props.image.json_url);
      let imageUrl = data.filter(clip => {
        return (clip.substring(clip.length - 9) == '~orig.jpg' || clip.substring(clip.length - 10) == '~large.jpg' || clip.substring(clip.length - 11) == '~medium.jpg' || clip.substring(clip.length - 4) == '.jpg');
      });
      this.setState({ imageUrl: imageUrl[0].replaceAll(' ', '%20') });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <Fragment>
        <div className="slides fade-in" value={this.props.index}>
          <div className="slides-wrapper">
            <div className="slide-counter">{ this.props.index + 1 } / { this.props.total }</div>
            <a data-toggle="modal" data-target='#modal' onClick={() => this.props.showModal({'isImage': true, 'modalUrl': this.state.imageUrl, 'modalAuthor': this.props.image.author })}>
              <img src={ this.props.image.preview_image } alt={ this.props.image.title } />
            </a>
            <span className="prev" onClick={() => this.props.handleNextSlide(-1)}>&#10094;</span>
            <span className="next" onClick={() => this.props.handleNextSlide(1)}>&#10095;</span> 
          </div>
          {this.state.showTruncatedText ?
            <Fragment> 
              {this.props.image.description.length > 150 ? (
                <Fragment>
                  <div className="slide-description">{ this.props.image.description.substring(0, 150) + "... "}
                    <span className="toggle-click" onClick={() => this.togglePostText()}> Show More</span>
                  </div>
                </Fragment>
              ) : (
                <div className="slide-description">{ this.props.image.description }</div>
              )}            
            </Fragment>
          :
            <Fragment>
              <div className="slide-description">{ this.props.image.description }
                <span className="toggle-click" onClick={() => this.togglePostText()}> Show Less</span>
              </div>
            </Fragment>
          }
        </div>
      </Fragment>
    )
  }
}

export default Image;