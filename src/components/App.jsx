import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import Parse from "parse";
import Button from "react-bootstrap/Button";
import "react-toastify/dist/ReactToastify.css";

import Auth from "./Auth";
import Oauth from "./Oauth";
import Projects from "./Projects";
import OneProject from "./OneProject";

import * as util from "../util";

class App extends React.Component {
  get isLoggedIn() {
    return !!Parse.User.current();
  }

  componentDidMount() {
    if (window.location.pathname.startsWith("/projects")) {
      if (!this.isLoggedIn) {
        return util.relativeRedirect("/signup");
      }
    }
  }

  logout() {
    Parse.User.logOut();
    util.relativeRedirect("login", false);
  }

  renderProjectsButton() {
    if (!window.location.pathname.startsWith("/projects/")) {
      return null;
    }
    return (
      <Button
        variant="outline-info"
        onClick={() => {
          util.relativeRedirect("/projects");
        }}
      >
        Back to Projects
      </Button>
    );
  }

  renderAccountButtons() {
    if (!this.isLoggedIn) {
      return null;
    }
    return (
      <LogoutContainer>
        {this.renderProjectsButton()}
        <Button variant="outline-danger" onClick={() => this.logout()}>
          Logout
        </Button>
      </LogoutContainer>
    );
  }

  render() {
    const redirectUrl = "/projects";
    throw new Error("2/11: 4");
    return (
      <Container>
        <ToastContainer />
        {this.renderAccountButtons()}
        <Router>
          <Switch>
            <Route path="/signup" component={Auth} />
            <Route path="/login" component={Auth} />
            <Route path="/oauth" component={Oauth} />
            <Route path="/projects/:projectSlug" component={OneProject} />
            <Route path="/projects" component={Projects} />
            <Redirect to={redirectUrl} />
          </Switch>
        </Router>
      </Container>
    );
  }
}

export default App;

const Container = styled.div`
  text-align: center;
`;

const LogoutContainer = styled.div`
  button {
    margin: 8px 10px;
  }
`;
