import React from 'react';
import '../css/common/Common.css';

export default function Login (props) {
  const {non_field_errors, username, password, form_username, form_password } = props.formProps;

  return (
    <form onSubmit={props.handleSubmit}>
      <div className={"modal-body mx-3 " + (non_field_errors ? 'mt-3 mb-5' : 'my-5')}> 
        { non_field_errors && 
          <div className="ml-5 mb-4">
            <ul className="non_field_error_list">
              { non_field_errors.map((error, index) =>
                <li key={index} className="help-block"><em>{ error }</em></li>
              )}
            </ul>
          </div>
        }
        
        <div className="md-form mb-3">
          <i className="fas fa-user icon prefix grey-text" aria-hidden="true"></i>
          <input 
            type="text" 
            name="form_username" 
            placeholder="Username" 
            className="form-control validate input" 
            onChange={(event) => props.handleSetState({ [event.target.name]: event.target.value })}
            value={form_username}
          />
        </div>
        { username && 
          <div className="mb-3 ml-5">
            <ul className="non_field_error_list">
              { username.map((error, index) =>
                <li key={index} className="help-block"><em>{ error }</em></li>
              )}
            </ul>
          </div>
        }
    
        <div className="md-form mb-3">
          <i className="fas fa-key icon prefix grey-text" aria-hidden="true"></i>
          <input 
            type="password" 
            name="form_password" 
            placeholder="Password"  
            className="form-control validate input"
            onChange={(event) => props.handleSetState({ [event.target.name]: event.target.value })}
            value={form_password}
          />
        </div>
        { password && 
          <div className="mb-3 ml-5">
            <ul className="non_field_error_list">
              { password.map((error, index) =>
                <li key={index} className="help-block"><em>{ error }</em></li>
              )}
            </ul>
          </div>
        }

        <div className="checkbox">
          <label><input type="checkbox" name="remember" /> Remember me</label>
        </div>
        <div className="options text-center text-md-right mt-1">
          <p>Not a member? <a href="" className="blue-text" id="register" onClick={(event) => props.handleTabClick(event)}>Register Now!</a></p>
          <p>Forgot <a href="#" className="blue-text">Password?</a></p>
        </div>
    
      </div>
      <div className="form-actions modal-footer d-flex justify-content-center">
        <button type="submit" className="btn btn-primary">Login <i className="fas fa-sign-in-alt ml-1" aria-hidden="true"></i></button>
      </div>
    </form>
  );
}