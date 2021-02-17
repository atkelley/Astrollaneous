import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';
import Contact from './Contact';
import Register from './Register';
import Login from './Login';
import Header from './Header';
import Navbar from './Navbar';
import CreatePost from './CreatePost';
import UpdatePost from './UpdatePost';
import Blog from './Blog';
import User from './User';

class HeaderContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Fragment>
        <Header />
        <Navbar />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/blog" exact component={Blog} />
        <Route path="/blog/create" exact component={CreatePost} />
        <Route path="/blog/update/:id" exact component={UpdatePost} />
        <Route path="/user/:id" exact component={User} />
        <Route path="/contact" exact component={Contact} />
      </Fragment>
    )
  };
}

export default HeaderContainer;