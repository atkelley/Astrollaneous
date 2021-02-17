import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withAlert } from 'react-alert';
import { Link } from 'react-router-dom';
import { logout } from '../../actions/auth';
import Combo from './Combo';
import Contact from './Contact';
import '../css/layout/Header.css';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event: null
    }
  }

  render() {
    return (
      <div className="astro-banner">
        <Combo event={this.state.event} />
        <Contact />

        <nav className="navbar navbar-expand-lg mynav" role="navigation" id="navbar">
          <div className="container">
            <div className="navbar-nav align-items-center">
              <Link to="/" className="btn btn-link"><img src="/static/mySpaceStuff/img/astro-logo.png" alt="astro-logo" /></Link>
            </div>
  
            <div className="navbar-nav ml-auto">
              { this.props.auth.isAuthenticated ? 
                <Fragment>
                  <button className="btn btn-link" type="button" name="button" onClick={() => this.props.logout()}>Logout</button>
                  <Link className="btn btn-link" to="/blog/create">Create Post</Link>
                </Fragment>
              : 
                <Fragment>
                  <button className="btn btn-link openTab" data-toggle="modal" data-target='#comboModal' id="login" onClick={(event) => this.setState({ event })}>Login</button>
                  <button className="btn btn-link openTab" data-toggle="modal" data-target='#comboModal' id="register" onClick={(event) => this.setState({ event })}>Register</button>
                </Fragment>
              }
              
              <Link className="btn btn-link" to="/blog">Blog</Link>
              <button className="btn btn-link" data-toggle="modal" data-target='#contactModal'>Contact</button>

              <form className="form-inline my-2 my-lg-0">
                <input className="form-control-sm mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                <button className="btn btn-sm btn-outline-secondary my-2 my-sm-0" type="submit">Search</button>
              </form>
            </div>
          </div>
        </nav>
      </div>
    )
  };
}

Header.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps, { logout })(withAlert()(Header));