import React from 'react';
import queryString from 'query-string'
import Parse from 'parse'
import styled from 'styled-components';

import  * as api from '../api';
import * as util from '../util';


class Oauth extends React.Component {
  state = {}
  setError(message) {
    this.setState({error: message});
  }
  async componentDidMount() {
    const currentUser = Parse.User.current();
    if (!currentUser) {
      return util.relativeRedirect('/signup');
    }
    const {error, ...params} = queryString.parse(window.location.search);

    if (!params.code) {
      return this.setError('Please install the Sentry Integration before proceeding');
    }
    if (error) {
      return this.setError(error);
    }
    try {
      await api.sentryOauth(params);
      util.setSentryInstalled(true)
      return util.relativeRedirect('/projects', false)
    } catch(err) {
      return this.setError(err.message || 'Unkown error');
    }
  }
  render() {
    const message = this.state.error || 'Please wait...';
    return (
      <Content>
        {message}
      </Content>
    )
  }
}


export default Oauth;


const Content = styled.h3`
  margin: 50px;
`;
