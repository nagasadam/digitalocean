
import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Login from "../pages/login";
import AdminLayout from '../layouts/Admin';

class Routes extends React.Component {
  render() {
    return (
      <div>
        <Router>
          <Route exact path="/" component={Login} />
          <Switch>
            <Route path="/admin" render={props => <AdminLayout {...props} />} />
            <Redirect to="/admin/dashboard" />
          </Switch>
        </Router>
      </div>
    )
  }
}
export default Routes;