import React, { Component, Fragment } from 'react';
import { withAlert } from 'react-alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../css/common/Common.css';

class Alerts extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      messageIcon: '',
      messageType: '',
      messageText: ''
    }
  }

  handleMessageShow = (messageIcon, messageType, messageText) => {
    this.setState({ messageIcon, messageType, messageText });
    setTimeout(() => { this.setState({ messageIcon: '', messageType: '', messageText: '' }); }, 8000);
  }

  componentDidUpdate = (prevProps) => {
    const { message } = this.props;

    if (message !== prevProps.message) {
      if (message.loginSuccess) { this.handleMessageShow('check', 'success', message.loginSuccess); }
      if (message.logoutSuccess) { this.handleMessageShow('check', 'success', message.logoutSuccess); }
      if (message.registerSuccess) { this.handleMessageShow('check', 'success', message.registerSuccess); }
      if (message.postCreatedSuccess) { this.handleMessageShow('check', 'success', message.postCreatedSuccess); }
    }
  }

  render() {
    return (
      <Fragment>
        {(this.state.messageIcon && this.state.messageType && this.state.messageText) &&
          <div className={`alert alert-${this.state.messageType} alert-dismissible fade show message`} role="alert">
            <i className={`fas fa-${this.state.messageIcon} prefix mr-1`} aria-hidden="true"></i> {this.state.messageText}
            <button type="button" className="close" onClick={() => this.setState({ messageType: '', messageText: '' })}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        }
      </Fragment>
    );
  }
}

Alerts.propTypes = {
  error: PropTypes.object.isRequired,
  message: PropTypes.object,
};

const mapStateToProps = (state) => ({
  error: state.errors,
  message: state.messages,
});

export default connect(mapStateToProps, {})(withAlert()(Alerts));