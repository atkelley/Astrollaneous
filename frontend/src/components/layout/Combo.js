import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login, register } from '../../actions/auth';
import Register from './Register';
import Login from './Login';
import '../css/common/Common.css';
import '../css/layout/Combo.css';

const defaultState = {
  form_email: '',
  form_username: '',
  form_password: '',
  form_password_confirmation: '',
  non_field_errors: '',
  email: '',
  username: '',
  password: '',
  password_confirmation: ''
}

class Combo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event: null, 
      formProps: { ...defaultState }
    }
  }

  handleSetState = (object) => {
    for (const key in object) {
      this.setState(prevState => ({ formProps: { ...prevState.formProps, [key]: object[key] } }) );
    }
  }

  handleLoginSubmit = (event) => {
    event.preventDefault();
    this.handleSetState({ non_field_errors: '', username: '', password: '' });
    this.props.login(this.state.formProps.form_username, this.state.formProps.form_password);   
  }

  handleRegisterSubmit = (event) => {
    event.preventDefault();
    this.handleSetState({ non_field_errors: '', username: '', email: '', password: '', password_confirmation: '' });
    const { form_username, form_email, form_password, form_password_confirmation } = this.state.formProps;

    (!form_password_confirmation) && (this.handleSetState({ password_confirmation: ['This field may not be blank.'] }));
    (form_password !== form_password_confirmation) && (this.handleSetState({ non_field_errors: ['Passwords do not match.'] }));
    this.props.register(form_username, form_email, form_password);
  }

  handleTabClick = (event) => {
    event.preventDefault();
    this.handleTabChange(event);
  } 

  componentDidUpdate(prevProps) {
    const { error, event } = this.props;

    if (event !== prevProps.event) {
      this.handleTabChange(this.props.event);
    }

    if (error !== prevProps.error && error.msg) {
      this.handleSetState(error.msg);
    }

    if(this.props != prevProps && this.props.isAuthenticated){ 
      this.setState({ formProps: { ...defaultState } });
      $('#comboModal').css('display','none');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    }
  }

  handleTabChange = (event) => {
    ['#nav-tabs a', '#tab-content div'].forEach(selector => {
      $(selector).each(function() { 
        if($(this).is(`#${event.target.id}`)) {
          if(!$(this).is('.show, .active')) {
            $(this).toggleClass('show active');
          }
        } else {
          $(this).removeClass('show active');
        }
      })  
    });

    this.setState({ formProps: { ...defaultState } });
  }

  render() {
    return (
      <div className="modal fade bd-example-modal-lg" id='comboModal' tabIndex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <nav>
              <div className="nav nav-tabs combo-tabs-box" id="nav-tabs" role="tablist">
                <a className="nav-link active combo-tab-link" id="login" href="" role="tab" onClick={(event) => this.handleTabClick(event)}>Account Login</a>
                <a className="nav-link combo-tab-link" id="register" href="" role="tab" onClick={(event) => this.handleTabClick(event)}>Create an Account</a>
              </div>
            </nav>
            <div className="tab-content" id="tab-content">
              <div className="tab-pane fade show active" id="login" role="tabpanel" aria-labelledby="login-tab">
                <Login handleTabClick={this.handleTabClick} formProps={this.state.formProps} handleSetState={this.handleSetState} handleSubmit={this.handleLoginSubmit} />
              </div>
              <div className="tab-pane fade" id="register" role="tabpanel" aria-labelledby="register-tab">
                <Register handleTabClick={this.handleTabClick} formProps={this.state.formProps} handleSetState={this.handleSetState} handleSubmit={this.handleRegisterSubmit} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Combo.propTypes = {
  login: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  error: state.errors,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login, register })(Combo);