import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { getUser } from "../../services/auth";

class App extends Component {
  render() {
    return (
      <>
        {getUser().email}
      </>
    );
  }
}

export default withRouter(App);