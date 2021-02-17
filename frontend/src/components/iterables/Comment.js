import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { getConvertedDateString, getConvertedDateTime } from '../common/Common';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


const Comment = ({ comment: { id, user, created_date, text, post }, isAuthenticated, user: authUser, showDeleteModal, showCommentModal }) => {
  return (
    <div className="comment-wrapper">
      <div className="comment-title">
        <em><Link to={`/user/${user.id}`}>{ user.username }</Link> on { getConvertedDateString(created_date) } at { getConvertedDateTime(created_date) }</em>
      </div>

      {(isAuthenticated && authUser.id == user.id) 
        ?
        <Fragment>
          <div className="comment-body">{ text }</div>
          <div className="comment-delete">
            <button type="button" className="btn-comment comment_delete" data-toggle="modal" data-target='#deleteModal' onClick={() => showDeleteModal(false, id, '')}>Delete</button>
          </div>
          <div className="comment-edit">
            <button type="button" className="btn-comment comment_edit" data-toggle="modal" data-target='#commentModal' onClick={() => showCommentModal(post, id, text)}>Edit</button>
          </div>
        </Fragment>
        :
        <div className="comment-body comment-body-unauth ">{ text }</div>
      }
      <br />
    </div>
  )
}

Comment.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(mapStateToProps, {})(Comment);