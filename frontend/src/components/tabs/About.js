import React, { Component, Fragment } from 'react';
import '../css/common/Common.css';
import '../css/layout/About.css';

class About extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUrl: '',
      imageAuthor: '',
      imageNumber: 0
    }
  }

  onImageClick = (event) => {
    this.setState({
      imageUrl: event.target.dataset['url'],
      imageAuthor: event.target.dataset['author'],
      imageNumber: event.target.dataset['number']
    });
  }

  render() {
    return (
      <Fragment>
        <div className="modal fade bd-example-modal-lg" id={`modal-${this.state.imageNumber}`} tabIndex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-body embed-responsive-16by9">
                <img itemProp="image" src={ this.state.imageUrl } className="img-rounded" style={{ width: "100%", height: "auto" }} />
                <p className="modal-title float-left" id="modalLabel"><em>NASA &copy; 2021 - { this.state.imageAuthor }</em></p>
                <button type="button" className="btn btn-secondary button-float-right" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
        <div className="container main-container">
          <div className="row">
            <div className="col-md-8 about-section">
              <h4><strong>All Things Space-Related</strong></h4><hr />
              <p>
                This website is an aggregate of various resources that the modern, amateur astronomist
                would utilize in pursuing their interest in all things space-related. The "Mars" page compiles photos for the
                the three most widely-known rovers (Curiosity, Opportunity & Spirit), in addition to tracking current weather patterns
                on the famous Red planet. The "NEOs" page can show the user current where-abouts and trajectories
                of various "Near Earth Objects" (comets, meteorites, etc.), and classify which are potential dangers to Earth and estimate
                their times of impact. The "Satellites" page is a comprehensive tool for identifying the myriad, man-made devices orbiting our planet
                and describes what they do and who they belong to. "Space Weather" forecasts what to expect, in terms of space-related weather
                (solar wind, flares, etc.) and how that can effect the performance of our aforementioned, man-made objects. The "NASA" page is
                comprehensive searching tool of NASA's images and video archives and "Techport" is a page dedicated to highlighting some of NASA's
                most interesting, current technologies being developed.
              </p>
              <p>
                <em>Read the latest article from the 
                  <a href="https://www.spacetelescope.org/news/heic2021/" target="_blank" rel="noopener noreferrer"> Hubble Space Telescope site</a>.
                </em>
              </p>
            </div>
            <div className="col-md-4 about-column-image">         
              <a data-toggle="modal" data-target="#modal-1">
                <img 
                  className="about-image" 
                  src="../../static/images/thumb_heic2021a.jpg" 
                  alt='Hubble Identifies Strange Exoplanet That Behaves Like the Long-Sought “Planet Nine”.' 
                  onClick={(event) => this.onImageClick(event)} 
                  data-url="../../static/images/square_heic2021a.jpg" 
                  data-author="Hubble Space Telescope"
                  data-number="1"
                />
              </a>
              <p className="about-title">
                <em>Hubble Identifies Strange Exoplanet That Behaves Like the Long-Sought “Planet Nine”.</em>
              </p>
            </div>
          </div>
        </div>

        <div className="container main-container">
          <div className="row">
            <div className="col-md-4 about-column-image">
              <a data-toggle="modal" data-target="#modal-2">
                <img 
                  className="about-image" 
                  src="../../static/images/finalsunshielddeploy7gunn.jpg" 
                  alt='NASA’s Webb Sunshield Successfully Unfolds and Tensions in Final Tests.' 
                  onClick={(event) => this.onImageClick(event)} 
                  data-url="../../static/images/square_finalsunshielddeploy7gunn.jpg" 
                  data-author="NASA Goodard"
                  data-number="2"
                />
              </a>
              <p className="about-title">
                <em>NASA’s Webb Sunshield Successfully Unfolds and Tensions in Final Tests.</em>
              </p>
            </div>
            <div className="col-md-8 about-section">
              <h4><strong>Django, React & Bootstrap</strong></h4><hr />
              <p>
                This website (version 2.0.1) was created with Python (version 3.8.0), Django (version 3.0.1), Bootstrap4, HTML5 and CSS3.
                It consumes from various NASA and Hubble telescope APIs, using Python's requests library. This website was conceived as a project to learn more about Django
                Full Stack Development, and pursue a life-long goal of learning more about astronomy. Originally, it was a blog project from an online course,
                designed to demonstrate the basic MVT structure of Django. That component is now used to log the progress of this website's continous development,
                as well as, journal various points of interest related to astronomy. It is a long-term goal to refine this website's content
                further and enhance its functionality to attract paid memberships and ad placements (via Google Adsense, affiliate marketing, etc.).
              </p>
              <p>
                <em>Read the latest article from the 
                  <a href="http://www.nasa.gov/feature/goddard/2020/webb-sunshield-successfully-unfolds-and-tensions-in-final-tests" target="_blank" rel="noopener noreferrer"> NASA Goodard site</a>.
                </em>
              </p>
            </div>
          </div>
        </div>

        <div className="container main-container">
          <div className="row">
            <div className="col-md-8 about-section">
              <h4><strong>Who We Are</strong></h4><hr />
              <p>
                We are a group of space-enthusiasts who met through a Web Development Full Stack Bootcamp in Boston. This bootcamp focused on the basics (HTML, CSS, Javascript)
                and introduced us to many different Javascript libraries, like Node.js (a runtime environment), Mustache.js (a templating library) and React.js (a front-end framework). Additionally,
                we were exposed to both MySQL and Mongo/Mongoose database management systems, JSON, AJAX, Bootstrap, Heroku and APIs. Future plans include experimenting with putting Angular and Java into
                this architecture, as well as incorporating cloud development (most likely through AWS) when launching this website to its permanent online location. For questions or additional
                information, feel free to reach out to us through our contact form in the header of this website.
              </p>
              <p>
                <em>Read the latest article from the 
                  <a href="https://spacetelescopelive.org/2020-12-24T16:02:17+00:00" target="_blank" rel="noopener noreferrer"> Space Telescope Live site</a>.
                </em>
              </p>
            </div>
            <div className="col-md-4 about-column-image">
              <a data-toggle="modal" data-target="#modal-3">
                <img 
                  className="about-image" 
                  src="../../static/images/thumb_SK67197.jpg" 
                  alt='COS/FUV Gain Map and Aperture Placement at LP6.' 
                  onClick={(event) => this.onImageClick(event)} 
                  data-url="../../static/images/square_SK67197.jpg" 
                  data-author="Space Telescope Live"
                  data-number="3"
                />
              </a>
              <p className="about-title">
                <em>COS/FUV Gain Map and Aperture Placement at LP6.</em>
              </p>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default About;