import React from 'react';


// ADD/EDIT COMMENT
const CommentModal = ({ commentId, commentText, handleCommentState, handleCommentSubmit }) => {
  return (
    <div className="modal fade bd-example-modal-lg" id='commentModal' tabIndex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleCommentSubmit}>
            <div className="modal-header">
              {(commentId < 0) ? <h2 className="modal-title">Add Comment</h2> : <h2 className="modal-title">Edit Comment</h2>}
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <i className="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>

            <div className="modal-body">
              <textarea 
                type="text" 
                name="text" 
                placeholder="Enter Text..." 
                rows={10}
                className="form-control validate input" 
                onChange={(event) => handleCommentState(event.target.value)}
                value={commentText}
                required
              />
            </div>

            <div className="modal-footer">
              {(commentId < 0) ? 
                <button type="submit" className="btn btn-primary">Add Comment</button>
              : 
                <button type="submit" className="btn btn-primary">Edit Comment</button>
              }
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CommentModal;