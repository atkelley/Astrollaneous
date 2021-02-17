import React, { Fragment } from 'react';


const DeleteModal = ({ isPost, title, handleDeleteSubmit }) => {
  return (
    <div className="modal fade show bd-example-modal-lg" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleDeleteSubmit}>
            <div className="modal-header">
              {isPost ? <h2 className="modal-title">Delete Post</h2> : <h2 className="modal-title">Delete Comment</h2>}
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <i className="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>

            <div className="modal-body text-center">
              {isPost ? <Fragment><p>Are you sure you want to delete <strong>"{title}"</strong></p></Fragment> : <p>Are you sure you want to delete this comment?</p>}
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-danger">Delete</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;