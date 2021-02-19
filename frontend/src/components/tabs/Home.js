import React, { Component, Fragment } from 'react';
import { getConvertedDateString, capitalizeEveryFirstLetter } from '../common/Common';
import { getDailyPhotoData } from '../apis/nasa';
import Loader from '../common/Loader';
import '../css/tabs/Home.css';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: '',
      author: '',
      isLoaded: false,
      isImage: true,
      date: getConvertedDateString(),
      hdUrl: '',
      url: ''
    }
  }

  componentDidMount() {
    this.getPicOfTheDay();
  }

  getPicOfTheDay = async () => {
    try {
      let thumbnailUrl = '../images/default-space-thumbnail.jpg';
      const { data } = await getDailyPhotoData.get();
      let isImage = (data.media_type == 'image') ? true : false;

      if (!isImage) {
        if (data.url.includes('youtube')) {
          let youtubeId = data.url.substring(30, data.url.length - 6);
          thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
        }
      }

      this.setState({
        isImage,
        isLoaded: true,
        title: data.title,
        description: data.explanation.split('Gallery:')[0],
        author: ((data.copyright) ? capitalizeEveryFirstLetter(data.copyright) : 'NASA'),
        hdUrl: (data.media_type == 'image') ? data.hdurl : data.url,
        url: (data.media_type == 'image') ? data.url : thumbnailUrl,
      });
    } catch(error) {
      console.log(error);
      this.setState({
        isLoaded: true,
        title: 'Chandra Spots a Mega-Cluster of Galaxies in the Making',
        description: `Astronomers using data from NASA's Chandra X-ray Observatory and other telescopes have put together a detailed map of a rare collision between four galaxy clusters. Eventually all four clusters — each with a mass of at least several hundred trillion times that of the Sun — will merge to form one of the most massive objects in the universe. Galaxy clusters are the largest structures in the cosmos that are held together by gravity. Clusters consist of hundreds or even thousands of galaxies embedded in hot gas, and contain an even larger amount of invisible dark matter. Sometimes two galaxy clusters collide, as in the case of the Bullet Cluster, and occasionally more than two will collide at the same time. The new observations show a mega-structure being assembled in a system called Abell 1758, located about 3 billion light-years from Earth. It contains two pairs of colliding galaxy clusters that are heading toward one another. Scientists first recognized Abell 1758 as a quadruple galaxy cluster system in 2004 using data from Chandra and XMM-Newton, a satellite operated by the European Space Agency (ESA). Each pair in the system contains two galaxy clusters that are well on their way to merging. In the northern (top) pair seen in the composite image, the centers of each cluster have already passed by each other once, about 300 to 400 million years ago, and will eventually swing back around. The southern pair at the bottom of the image has two clusters that are close to approaching each other for the first time.`,
        author: 'X-ray: NASA/CXC/SAO/G.Schellenberger et al.; Optical:SDSS',
        isImage: true,
        hdUrl: '/static/mySpaceStuff/img/backup_image_large.jpg',
        url: '/static/mySpaceStuff/img/backup_image.jpg'
      });
    }
  }

  render() {
    console.log('testing:', process.env);
    return (
      <Fragment>
        { this.state.isLoaded ?
          <div className="container main-container">
            <div className="row">
              <div className="col-md-12">
                <h1 className="daily-headline"><strong>Astronomy Picture of the Day:</strong></h1>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-md-4">
                <a data-toggle="modal" data-target='#modal' onClick={() => this.props.showModal({'isImage': this.state.isImage, 'modalUrl': this.state.hdUrl, 'modalAuthor': this.state.author })}>
                  <img className="daily-image" src={ this.state.url } alt={this.state.title} />
                </a>
              </div>
              <div className="col-md-8">
                <div className="row">
                  <h6><em>{this.state.date}</em></h6>
                </div>
                <div className="row">
                  <h3>{this.state.title}</h3>
                </div>
                <div className="row">
                  <p className="daily-description">{ this.state.description }</p>
                </div>
              </div>
            </div>
          </div>            
        :
          <Loader />
        }
      </Fragment>
    )
  };
}

export default Home;