import React, { Component, Fragment } from 'react';
import axios from 'axios';

class Video extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showTruncatedText: true,
      videoUrl: ''
    }
  }

  togglePostText = () => {
    this.setState({ showTruncatedText: !this.state.showTruncatedText });
  }

  componentDidMount = () => {
    this.getVideoFile();
  }

  getVideoFile = async () => {
    try {
      const { data } = await axios.get(this.props.video.json_url);
      let videoUrl = data.filter(clip => {
        return (clip.substring(clip.length - 9) == '~orig.mp4' || clip.substring(clip.length - 11) == '~medium.mp4' || clip.substring(clip.length - 4) == '.mp4' || clip.substring(clip.length - 4) == '.mov');
      });
      this.setState({ videoUrl: videoUrl[0].replaceAll(' ', '%20') });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <Fragment>
        <div className="container video-container">
          <div className="row">
            <div className="col-md-4">
              <div className="video-image-wrapper">
                <a data-toggle="modal" data-target='#modal' onClick={() => this.props.showModal({'isImage': false, 'modalUrl': this.state.videoUrl })}>
                  <img className="video-image" src={ this.props.video.preview_image } />
                  <i className="fas fa-play fa-3x"></i>
                </a>
              </div>
            </div>

            <div className="col-md-8">
              <h5><strong>Title: </strong>{ (this.props.video.title || this.props.video.nasa_id) }</h5>
              <h6><strong>Date Created: </strong>{ this.props.video.create_date }</h6>
              {this.state.showTruncatedText ?
                <Fragment> 
                  {this.props.video.description.length > 300 ? (
                    <Fragment>
                      <p>{ this.props.video.description.substring(0, 300) + "..." }</p>
                      <span className="toggle-click" onClick={() => this.togglePostText()}>Show More</span>
                    </Fragment>
                  ) : (
                    <p>{ this.props.video.description }</p>
                  )}            
                </Fragment>
              :
                <Fragment>
                  <p>{ this.props.video.description }</p>
                  <span className="toggle-click" onClick={() => this.togglePostText()}>Show Less</span>
                </Fragment>
              }
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default Video;