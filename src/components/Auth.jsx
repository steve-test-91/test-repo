import React from 'react';
import styled from 'styled-components';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import isEmail from 'validator/lib/isEmail';
import { toast } from 'react-toastify';
import Parse from 'parse';

import * as util from '../util';

class Auth extends React.Component {
  state = {};

  showError(message) {
    return toast.error(message, {
      position: toast.POSITION.TOP_CENTER
    });
  }

  isLogin() {
    return window.location.pathname.includes('login');
  }

  get username() {
    const { email = '' } = this.state;
    return email.toLowerCase();
  }

  getCurrentUser() {
    const currentUser = Parse.User.current();
    return currentUser.fetch();
  }
  inputChange(field, e) {
    const { value } = e.target;
    this.setState({ [field]: value });
  }

  async handleAuth() {
    const { email, password } = this.state;
    //validate inputs
    if (!email) {
      return this.showError('Must specify an email');
    }
    if (!password) {
      return this.showError('Must specify a password');
    }

    if (!isEmail(email)) {
      return this.showError('Must specify a valid email');
    }

    try {
      if (this.isLogin()) {
        await this.login();
      } else {
        await this.signUp();
      }

      const user = await this.getCurrentUser();
      if (user.get('oauthComplete')) {
        return util.relativeRedirect('/projects');
      } else {
        return util.relativeRedirect('/oauth');
      }

    } catch(err) {
      console.error(err);
      return this.showError(err.message || 'Unexpected error')
    }
  }

  async login() {
    const { password } = this.state;
    await Parse.User.logIn(this.username, password);
  }

  async signUp() {
    let user = new Parse.User();
    const { email, password } = this.state;
    user.set({ email, username: this.username, password });
    await user.signUp();
  }

  switchPage() {
    const url = this.isLogin() ? 'signup' : 'login';
    util.relativeRedirect(url);
  }

  render() {
    const mainText = this.isLogin() ? 'Login' : 'Signup';
    const otherText = !this.isLogin() ? 'Login' : 'Signup';
    return (
      <Container>
        <Header>{mainText}</Header>
        <FormContainer>
          <InputGroup className='mb-3'>
            <InputGroup.Prepend>
              <InputGroup.Text>Email</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              id='email-input'
              placeholder='Email'
              aria-label='Email'
              aria-describedby='basic-addon1'
              onChange={e => this.inputChange('email', e)}
            />
          </InputGroup>
          <InputGroup className='mb-3'>
            <InputGroup.Prepend>
              <InputGroup.Text>Password</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder='Password'
              aria-label='Password'
              aria-describedby='basic-addon1'
              type='password'
              onChange={e => this.inputChange('password', e)}
            />
          </InputGroup>
          <ButtonHolder>
            <Button onClick={() => this.handleAuth()} variant='outline-success'>
              {mainText}
            </Button>
            <Button onClick={() => this.switchPage()} variant='outline-warning'>
              Switch to {otherText}
            </Button>
          </ButtonHolder>
        </FormContainer>
      </Container>
    );
  }
}

export default Auth;

const Container = styled.div``;

const FormContainer = styled.div`
  margin: auto;
  max-width: 800px;
  & .input-group-text {
    width: 110px;
  }
`;

const ButtonHolder = styled.div`
  & button {
    margin: 10px;
  }
`;

const Header = styled.h2`
  margin: 20px;
  text-align: center;
`;
