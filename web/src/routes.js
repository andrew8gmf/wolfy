import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import SignUp from "./pages/SignUp";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={() => <h1>Login</h1>} />
      <Route path="/signup" component={SignUp} />
      <Route path="/app" component={() => <h1>App</h1>} />
      <Route path="*" component={() => <h1>Page not found</h1>} />
    </Switch>
  </BrowserRouter>
);

export default Routes;