import React from 'react';

function Modal({ isImage, modalUrl, modalAuthor }) {
  return (
    <div className="modal fade bd-example-modal-lg" id='modal' tabIndex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className={isImage ? 'modal-content': 'modal-content video-modal-content'}>
          {isImage ?
            <div className="modal-body embed-responsive-16by9">
              <img itemProp="image" src={ modalUrl } className="img-rounded" width="100%" height="auto" />
              <p className="modal-title float-left" id="modalLabel"><em>NASA &copy; 2021 - { modalAuthor }</em></p>
              <button type="button" className="btn btn-secondary button-float-right" data-dismiss="modal">Close</button>
            </div>
          :
            <div className="modal-body embed-responsive embed-responsive-16by9">
              <iframe className="embed-responsive-item" width="100%" height="500px" src={ modalUrl } frameBorder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default Modal;