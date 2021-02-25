import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getConvertedDateString, getConvertedDateTime } from '../common/Common';
import Comment from './Comment';

class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showTruncatedText: true
    }
  }

  render() {
    const { id, title, user: post_user, created_date, image_url, text, text_html, comments } = this.props.post;

    return (
      <div className="container main-container">
        <div className="row daily-row">
          <div className="col-md-12">
            <h1 className="mt-3">{ title }</h1>
            <p className="lead"><em>Posted by <Link to={`/user/${post_user.id}`}>{ post_user.username }</Link> on { getConvertedDateString(created_date) } at { getConvertedDateTime(created_date) }</em></p>
            <hr />
            { (image_url) &&
              <Fragment>
                <img className="img-fluid" src={ image_url } alt="" />
                <hr />
              </Fragment>
            }

            {this.state.showTruncatedText ?
              <p>{text.substring(0, 200) + " ..."}</p>
            :
              <Fragment>
                <span dangerouslySetInnerHTML={{__html: text_html}}></span>
                <hr />
                <h4>Comments:</h4>
                {comments.length > 0 ?
                  <Fragment>
                    {comments.map((comment, index) => {
                      return <Comment key={index} comment={comment} showDeleteModal={this.props.showDeleteModal} showCommentModal={this.props.showCommentModal} />
                    })}
                  </Fragment>
                :
                  <p><em>No comments posted...yet.</em></p>
                }
              </Fragment>
            }

            <hr />
            <div className="post-button-box">
              {this.state.showTruncatedText ?
                <button type="button" className="btn btn-success" value="hidden" onClick={() => this.setState({ showTruncatedText: !this.state.showTruncatedText })}>
                  <span className="fa fa-plus" aria-hidden="true"></span>
                  <span className="icon-label">Show More</span>
                </button>
              :
                <button type="button" className="btn btn-success" value="hidden" onClick={() => this.setState({ showTruncatedText: !this.state.showTruncatedText })}>
                  <span className="fa fa-minus" aria-hidden="true"></span>
                  <span className="icon-label">Show Less</span>
                </button>
              }

              {(this.props.isAuthenticated && this.props.user.id == post_user.id) &&
                <Fragment>
                  <button type="button" className="btn btn-danger" data-toggle="modal" data-target='#deleteModal' onClick={() => this.props.showDeleteModal(true, id, title)}>
                    <span className="fa fa-remove" aria-hidden="true"></span>
                    <span className="icon-label">Delete Post</span>
                  </button>

                  <Link to={`/blog/update/${id}`} type="button" className="btn btn-warning">
                    <span className="fa fa-edit" aria-hidden="true"></span>
                    <span className="icon-label">Edit Post</span>
                  </Link>
                </Fragment>
              }

              {this.props.isAuthenticated &&
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target='#commentModal' onClick={() => this.props.showCommentModal(id, -1, '')}>
                  <span className="far fa-comments" aria-hidden="true"></span>
                  <span className="icon-label">Add Comment ({comments.length})</span>
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Post.propTypes = {
  error: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object
};

const mapStateToProps = (state) => ({
  error: state.errors,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(mapStateToProps, {})(Post);