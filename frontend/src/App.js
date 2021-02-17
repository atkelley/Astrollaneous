import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import Alerts from './components/layout/Alerts';
import { loadUser } from './actions/auth';
import { Provider } from 'react-redux';
import history from './history';
import store from './store';

import HeaderContainer from './components/layout/HeaderContainer';
import Home from './components/tabs/Home';
import Mars from './components/tabs/Mars';
import Nasa from './components/tabs/Nasa';
import Rovers from './components/tabs/Rovers';
import Satellites from './components/tabs/Satellites';
import Techport from './components/tabs/Techport';
import About from './components/tabs/About';
import Footer from './components/layout/Footer';

import Login from './components/accounts/Login';
import Register from './components/accounts/Register';
import Modal from './components/common/Modal';
import './components/css/common/Common.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalUrl: '',
      modalAuthor: '',
      isImage: false
    }
  }

  showModal = ({ isImage, modalUrl, modalAuthor = '' }) => {
    this.setState({ isImage, modalUrl, modalAuthor });
  }

  componentDidMount = () => {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <AlertProvider template={AlertTemplate}>
          <Modal isImage={this.state.isImage} modalUrl={this.state.modalUrl} modalAuthor={this.state.modalAuthor} />

          <Router history={history}>
            <HeaderContainer />
            <Alerts />
            
            <Switch>
              <Route path="/" exact render={props => <Home showModal={(data) => this.showModal(data)} />} />
              <Route path="/mars" exact component={Mars} />
              <Route path="/nasa" exact render={props => <Nasa showModal={(data) => this.showModal(data)} />} />
              <Route path="/rovers" exact render={props => <Rovers showModal={(data) => this.showModal(data)} />} />
              <Route path="/satellites" exact component={Satellites} />
              <Route path="/techport" exact component={Techport} />
              <Route path="/about" exact component={About} />
              <Route path="/login" exact component={Login} />
              <Route path="/register" exact component={Register} />
            </Switch>

            <Footer />
          </Router>
        </AlertProvider>
      </Provider>
    )
  }
}

export default App;