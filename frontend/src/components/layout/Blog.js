import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PostDataService from "../../services/post.service";
import CommentDataService from "../../services/comment.service";
import CommentModal from './CommentModal';
import DeleteModal from './DeleteModal';
import Loader from '../common/Loader';
import Post from '../iterables/Post';
import '../css/common/Common.css';
import '../css/layout/Blog.css';

class Blog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      posts: [],

      isPost: false,
      deleteId: -1,
      deleteTitle: '',

      postId: -1,
      postTitle: '',
      commentId: -1,
      commentText: ''
    }
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts = async () => {
    await PostDataService.getPosts()
      .then(response => {
        this.setState({ posts: response.data, isLoaded: true });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleDeleteSubmit = () => {
    if (this.state.isPost) {
      this.handlePostDelete();
    } else {
      this.handleCommentDelete();
    }
  }

  handlePostDelete = async () => {
    await PostDataService.delete(this.state.deleteId)
    .then(response => {
      this.setState({ isPost: false, deleteId: -1, deleteTitle: '' });
    })
    .catch(error => {
      console.log(error);
    });
  }

  handleCommentDelete = async () => {
    await CommentDataService.delete(this.state.deleteId)
    .then(response => {
      this.setState({ isPost: false, deleteId: -1 });
    })
    .catch(error => {
      console.log(error);
    });
  }

  showDeleteModal = (isPost, deleteId, deleteTitle) => {
    this.setState({ isPost, deleteId, deleteTitle });
  }

  showCommentModal = (postId, postTitle, commentId, commentText) => {
    this.setState({ postId, postTitle, commentId, commentText });
  };

  handleCommentSubmit = (event) => {
    event.preventDefault();
    
    if (this.state.commentId < 0) {
      this.handleCommentAdd();
    } else {
      this.handleCommentEdit();
    }
  }

  handleCommentAdd = async() => {
    const { postId, postTitle, commentText } = this.state;

    await CommentDataService.create({ postId, postTitle, commentText, user: this.props.user })
    .then(response => {
      this.setState({ postId: -1, postTitle: '', commentText: '' });
      $('#commentModal').css('display','none');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      window.location.reload();
    })
    .catch(error => {
      console.log(error);
    });
  }

  handleCommentEdit = async() => {
    const { commentId, postId, commentText } = this.state;

    await CommentDataService.update(commentId, { postId, commentText })
    .then(response => {
      this.setState({ commentId: -1, postId: -1, commentText: '' });
      $('#commentModal').css('display','none');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      window.location.reload();
    })
    .catch(error => {
      console.log(error);
    });
  }

  handleCommentState = (commentText) => {
    this.setState({ commentText });
  }

  render() {
    if (window.location.href.includes('?')) {
      return <Redirect to="/blog" />;
    }

    return (
      <Fragment>
        <DeleteModal isPost={this.state.isPost} title={this.state.deleteTitle} handleDeleteSubmit={this.handleDeleteSubmit} />
        <CommentModal commentId={this.state.commentId} postId={this.state.postId} commentText={this.state.commentText} handleCommentState={this.handleCommentState} handleCommentSubmit={this.handleCommentSubmit} />

        { this.state.isLoaded ?
          this.state.posts.map(post => {
            return <Post key={post.id} post={post} showDeleteModal={this.showDeleteModal} showCommentModal={this.showCommentModal} />
          })
        :
          <Loader />
        }
      </Fragment>
    )
  };
}

Blog.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(Blog);