/* Page where the users of our app can login with their google credentials.
*/
import React, { useState } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import Swal from 'sweetalert2';
import {
  AppBar,
  Box,
  Typography,
  Toolbar,
  makeStyles,
  Button,
  IconButton,
} from '@material-ui/core';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoginBookView from './LoginBookView.jsx';

const clientId = '782886430323-949mbf6ps0e3lv84rmsv6k9n1d5c07sc.apps.googleusercontent.com';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    color: 'white',
  },
  rightToolbar: {
    marginLeft: 'auto',
    marginRight: 0,
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: 'white',
    textDecoration: 'none',
  },
}));

const Login = () => {
  const classes = useStyles();

  // these need to be replaced
  const [showLoginButton, setShowLoginButton] = useState(true);
  const [showLogoutButton, setShowLogoutButton] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loginUser = (userData) => {
    axios.get('/routes/users', { params: userData })
      .then(({ data }) => {
        console.log('===> userContext user response:', data);
        const { googleId, username } = data;
        setUserInfo({ googleId, username });
        setIsLoggedIn(true);
      })
      .then(Swal.fire({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        icon: 'success',
        title: 'Signed in successfully',
      }))
      .catch((err) => console.log(err));
  };

  const logoutUser = () => {
    setUserInfo({});
    setIsLoggedIn(false);
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      icon: 'success',
      title: 'Signed out successfully',
    });
  };

  const onLoginSuccess = (res) => {
    console.log('[Login Success] currentUser:', res.profileObj);
    setShowLoginButton(false);
    setShowLogoutButton(true);

    loginUser(res.profileObj);
  };

  const onLoginFailure = (res) => {
    console.log('[Login failed] res:', res);
  };

  const onSignoutSuccess = () => {
    alert('You have been logged out successfully');
    console.clear();
    setShowLoginButton(true);
    setShowLogoutButton(false);
    logoutUser();
  };

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            component={Link}
            to="/login"
          >
            <MenuBookIcon />
          </IconButton>
          <Typography
            variant="h4"
            className={classes.title}
            component={Link}
            to="/login"
          >
            Readr 2.0
          </Typography>
          {/* <Button
            type="submit"
            // fullWidth
            variant="contained"
            // color="secondary"
            onClick={() => {
              window.open('/auth/google', '_self');
            }}
          >
            Sign In with Google
          </Button> */}
          <div>
            {showLoginButton
              ? (
                <GoogleLogin
                  clientId={clientId}
                  buttonText="Login"
                  onSuccess={onLoginSuccess}
                  onFailure={onLoginFailure}
                  cookiePolicy="single_host_origin"
                  isSignedIn
                />
              ) : null}
            {showLogoutButton
              ? (
                <GoogleLogout
                  clientId={clientId}
                  buttonText="Sign Out"
                  onLogoutSuccess={onSignoutSuccess}
                />
              ) : null}
          </div>
        </Toolbar>
      </AppBar>
      <Box mx="auto" m={9}>
        <Typography variant="h6" align="center"> Welcome to Readr!</Typography>
        <Typography variant="body1" align="center">Sign in to get personalized book suggestions!</Typography>
      </Box>
      <LoginBookView />
    </div>
  );
};

export default Login;
