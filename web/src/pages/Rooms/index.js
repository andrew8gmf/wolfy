import React, { Component } from "react";
import { StyledContainer, StyledRow, Left, Center, Right} from "./styles";

import { withRouter } from "react-router-dom";
import { getUser } from "../../services/auth";

class Rooms extends Component {
  render() {
    return (
      <StyledContainer fluid>
        <StyledRow>
          <Left>Options</Left>
          <Center xs={8}>Rooms / User logged: {getUser().username}</Center>
          <Right>Friends list</Right>
        </StyledRow>
      </StyledContainer>
    );
  }
}

export default withRouter(Rooms);