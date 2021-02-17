import React, { Component, Fragment } from 'react';
import axios from 'axios';

class Audio extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showTruncatedText: true,
      audioUrl: ''
    }
  }

  togglePostText = () => {
    this.setState({ showTruncatedText: !this.state.showTruncatedText });
  }

  componentDidMount = () => {
    this.getAudioFile();
  }

  getAudioFile = async () => {
    try {
      const { data } = await axios.get(this.props.audio.json_url);
      let audioUrl = data.filter(clip => {
        return (clip.substring(clip.length - 9) == '~orig.mp3' || clip.substring(clip.length - 4) == '.mp3');
      });
      this.setState({ audioUrl: audioUrl[0].replaceAll(' ', '%20') });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div className="container audio-container">
        <div className="row">
          <div className="col-md-4">
            <audio controls src={ this.state.audioUrl } type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </div>

          <div className="col-md-8">
            <h5><strong>Title: </strong>{ (this.props.audio.title || this.props.audio.nasa_id) }</h5>
            <h6><strong>Date Created: </strong>{ this.props.audio.create_date }</h6>
            {this.state.showTruncatedText ?
              <Fragment> 
                {this.props.audio.description.length > 200 ? (
                  <Fragment>
                    <p>{ this.props.audio.description.substring(0, 200) + "..." }</p>
                    <span className="toggle-click" onClick={() => this.togglePostText()}>Show More</span>
                  </Fragment>
                ) : (
                  <p>{ this.props.audio.description }</p>
                )}            
              </Fragment>
            :
              <Fragment>
                <p>{ this.props.audio.description }</p>
                <span className="toggle-click" onClick={() => this.togglePostText()}>Show Less</span>
              </Fragment>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Audio;