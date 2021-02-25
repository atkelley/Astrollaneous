import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Gravatar from 'react-gravatar';
import { getConvertedDateString, getConvertedDateTime } from '../common/Common';
import UserDataService from "../../services/user.service";
import PostDataService from "../../services/post.service";
import Loader from '../common/Loader';
import '../css/layout/Blog.css';
import '../css/layout/User.css';

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      posts: null,
      comments: null,
      showTruncatedText: {}
    }
  }

  componentDidMount = () => {
    this.getUser(this.props.match.params.id);
    this.getUserPosts(this.props.match.params.id);
    this.getUserComments(this.props.match.params.id);
  }

  getUser = async (id) => {
    await UserDataService.getUser(id)
    .then(response => {
      this.setState({ user: response.data[0].fields });
    })
    .catch(error => {
      console.log(error);
    });
  }

  getUserPosts = async (id) => {
    await UserDataService.getUserPosts(id)
      .then(response => {
        let showTruncatedText = {};

        response.data.forEach((post, index) => {
          showTruncatedText[index] = true;
        });
        
        this.setState({ posts: response.data, showTruncatedText });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getUserComments = async (id) => {
    await UserDataService.getUserComments(id)
      .then(response => {
        this.asyncForEach(response.data, async (comment) => {
          comment.title = await this.getPostTitle(comment.post);
        });

        this.setState({ comments: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  }

  asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  setTruncatedTextState = (index) => {
    let showTruncatedText = this.state.showTruncatedText;
    showTruncatedText[index] = !this.state.showTruncatedText[index];
    this.setState({ showTruncatedText });
  }

  getPostTitle = async (id) => {
    return await PostDataService.getPost(id)
    .then(response => {
      return response.data.post.title;
    })
    .catch(error => {
      console.log(error);
    });
  }

  render() {
    const { user, posts, comments } = this.state;

    return (
      <div className="container main-container">
        {(user && Object.keys(user).length !== 0 && posts && comments) ?
          <div className="row user-title-row">
            <div className="col-md-4">
              <h4><Gravatar email={user.email} className="user-gravatar" /><strong>{user.username}</strong></h4>
            </div>
            <div className="col-md-4">
              <div className="row">
                <h6 className="user-title"><em>Posts: {posts.length}</em></h6>
              </div>
              <div className="row">
                <h6 className="user-title"><em>Comments: {comments.length}</em></h6>
              </div>
            </div>
            <div className="col-md-4">
              <div className="row">
                <h6><em>Joined: {getConvertedDateString(user.date_joined)}</em></h6>
              </div>
              <div className="row">
                <h6><em>Last Login: {getConvertedDateString(user.last_login)} at {getConvertedDateTime(user.last_login)}</em></h6>
              </div>
            </div>
          </div>      
        :
          <Loader />
        }
        <hr className="user-title-hr" />
        {posts ?
          <Fragment>
            {posts.length > 0 ?
              posts.map(({ user, title, created_date, image_url, text, text_html }, index) => {
                return (
                  <Fragment key={index}>
                    <div className="row daily-row">
                      <div className="col-md-12">
                        <h1>{ title }</h1>
                        <p className="lead"><em>Posted by <Link to={`/user/${user.id}`}>{ user.username }</Link> on { getConvertedDateString(created_date) } at { getConvertedDateTime(created_date) }</em></p>
                        {(image_url) &&
                          <Fragment>
                            <img className="img-fluid" src={ image_url } alt="" />
                            <hr />
                          </Fragment>
                        }
          
                        {this.state.showTruncatedText[index] ? <p>{text.substring(0, 200) + " ..."}</p> : <span dangerouslySetInnerHTML={{__html: text_html}}></span>}
                        
                        <div className="post-button-box">
                          {this.state.showTruncatedText[index] ?
                            <button type="button" className="btn btn-success" value="hidden" onClick={() => this.setTruncatedTextState(index)}>
                              <span className="fa fa-plus" aria-hidden="true"></span>
                              <span className="icon-label">Show More</span>
                            </button>
                          :
                            <button type="button" className="btn btn-success" value="hidden" onClick={() => this.setTruncatedTextState(index)}>
                              <span className="fa fa-minus" aria-hidden="true"></span>
                              <span className="icon-label">Show Less</span>
                            </button>
                          }
                        </div>
                      </div>
                    </div> 
                    <hr />
                  </Fragment>
              )})
            :
              <p><em>{user.username} has not posted...yet.</em></p>
            }
          </Fragment>
        :
          <Loader />
        }

        <h4>Comments:</h4>
        {comments ?
          <Fragment>
            {comments.length > 0 ?
              comments.map((comment, index) => {
                return (
                  <div key={index} className="comment-wrapper">
                    <div className="comment-title">
                      <em>
                        <a href="#">{ comment.user.username }</a> on { getConvertedDateString(comment.created_date) } at { getConvertedDateTime(comment.created_date) } from the post "<strong>{comment.title}</strong>"
                      </em>
                    </div>
                    
                    <div className="comment-body comment-body-unauth">{ comment.text }</div>
                    <br />
                  </div> 
              )})
            :
              <p><em>{user.username} has not commented on any posts...yet.</em></p>
            }
          </Fragment>
        :
          <Loader />
        }
      </div>
    )
  };
}

export default User;