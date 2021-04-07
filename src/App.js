import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Home from './components/Home'
import SignUp from './components/Signup'
import {AuthProvider} from './contexts/AuthContext'
import UserProfile from './components/Profiles/UserProfile'
import UpdateProfile from './components/Profiles/UpdateProfileUser'
import UpdateDisplayPhoto from './components/Profiles/UpdateDp'
import PostListing from './components/Profiles/PostListing'
import Login from './components/Login'
import Landing from './components/Landing'
import PrivateRoute from './components/PrivateRoute'

class App extends Component {
  render() {
    return (
      <React.Fragment>

        <Router>
          <Switch>
            <AuthProvider>
              <Route exact path = "/" component = {Landing}/>
              <Route path = "/signup" component = {SignUp}/>
              <Route path = "/login" component = {Login}/>
              <PrivateRoute path = "/profile" component = {UserProfile}/>
              <PrivateRoute path = "/profile-update" component = {UpdateProfile}/>
              <PrivateRoute path = "/listing-add" component = {PostListing}/>
              <PrivateRoute path = "/upload-dp" component = {UpdateDisplayPhoto}/>
            </AuthProvider>
          </Switch>
        </Router>
      </React.Fragment>

    );
  }
}

export default App;
