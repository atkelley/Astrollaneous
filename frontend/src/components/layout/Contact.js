import React from 'react';
import '../css/common/Common.css';

const Contact = () => {
  return (
    <div className="modal fade bd-example-modal-lg" id='contactModal' tabIndex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form method="POST">
            <input type="hidden" name="csrfmiddlewaretoken" value="om0G3brkm2VbQIsICxGmm8H0xaZMXo4ce5AYSyt1E49kFVd1IfTA9TJSw1b3R1Jq" />
            <div className="modal-header text-center">
              <h2 className="modal-title w-100 font-weight-bold">Contact Us</h2>
            </div>
            <div className="modal-body mx-3">
              <div className="md-form mb-3">
                <i className="fas fa-envelope icon prefix grey-text" aria-hidden="true"></i>
                <input type="email" name="email" placeholder="Email" className="form-control validate input" required="" id="id_email" />
              </div>
          
              <div className="md-form mb-3">
                <i className="fas fa-tag icon prefix grey-text" aria-hidden="true"></i>
                <input type="text" name="subject" placeholder="Subject" className="form-control validate input" required="" id="id_subject" />
              </div>
          
              <div className="md-form">
                <i className="fas fa-comment-alt icon" aria-hidden="true"></i>
                <textarea name="message" cols="6" rows="4" placeholder="Message" className="form-control input" required="" id="id_message"></textarea>
              </div>
          
            </div>
            <div className="form-actions modal-footer d-flex justify-content-center">
              <button type="submit" className="btn btn-primary">Send <i className="fas fa-paper-plane ml-1" aria-hidden="true"></i></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;