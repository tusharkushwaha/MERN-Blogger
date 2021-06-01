import React, { useEffect, useState, useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import {Link} from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from "axios"
import Loading from "./Loading"
import GoogleLogin from 'react-google-login';
import Alert from "@material-ui/lab/Alert"
import { UserContext, Profilestate } from "../../App"


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp({ history }) {
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/")
    }
  }, [history])
  const [isloading, setisloading] = useState(false)
  const { dispatch } = useContext(UserContext)
  const { dispatch1 } = useContext(Profilestate)
  const [user, setUser] = useState({ username: "", email: "", password: "", confirmpassword: "" })
  const [error, setError] = useState("")
  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value })
  const handleSubmit = async (e) => {
    setisloading(true)
    e.preventDefault()
    const config = {
      header: {
        "Content-Type": "application/json"
      }
    }
    const { password, confirmpassword, username, email } = user;
    if (password !== confirmpassword) {
      setUser({ ...user, [password]: "", [confirmpassword]: "" })
      setisloading(false)
      return setError("Password do not match")
    }
    try {
      const { data } = await axios.post("/api/auth/register", { username, email, password }, config)
      localStorage.setItem("authToken", data.token)
      dispatch1({ type: "DETAILS", payload: JSON.stringify(data.details) })
      dispatch({ type: "USER" })
      history.push("/")
    } catch (err) {
      if (err.response.data.error.startsWith("E11000 duplicate key error")) {
        setError("Email is already registered. Please Login.")
        setisloading(false)
        return
      }
      setError(err.response.data.error)
      setisloading(false)
    }


  }
  const responseGoogle = async (response) => {
    setisloading(true)
    const { email, name, imageUrl, googleId, familyName, givenName } = response.profileObj;
    const profile = { email, username: name, imageurl: imageUrl, googleid: googleId, lastname: familyName, firstname: givenName }
    const config = {
      header: {
        "Content-Type": "application/json"
      }
    }
    try {
      const { data } = await axios.post("/api/auth/goolelogin", profile, config)
      localStorage.setItem("authToken", data.token)
      dispatch1({ type: "DETAILS", payload: JSON.stringify(data.details) })
      dispatch({ type: "USER" })
      history.push("/")
    } catch (err) {
      setError(err.response.data.error)
    }
  }
  const responseFailGoogle = (response) => {
    console.log("Google signin failed");
  }
  const classes = useStyles();

  return (
    <>
      {isloading ?
        <Loading message="Registering.." />
        :
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
        </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    onChange={handleChange}
                    name="username"
                    autoComplete="text"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    onChange={handleChange}
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    onChange={handleChange}
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="confirmpassword"
                    onChange={handleChange}
                    label="Confirm Password"
                    type="password"
                    id="confirmpassword"
                    autoComplete="current-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign Up
          </Button>
              <GoogleLogin
                clientId=process.env.CLIENTID
                render={renderProps => (
                  <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} variant="contained" disabled={renderProps.disabled}startIcon={<><img src="/images/google.png" alt="google"/></>}>
                      Sign in With Google
                    </Button>
                )}
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseFailGoogle}
                cookiePolicy='single_host_origin'
              />,
          <Grid container justify="flex-end">
                <Grid item>
                  <Link to="/login" variant="body2">
                    Already have an account? Sign in
              </Link>
                </Grid>
              </Grid>
            </form>
          </div>
          <Box mt={8} align="center">
            {'Copyright © '}2021  <a href="https://github.com/tusharkushwaha" target="_blank" rel="noreferrer">Tushar Kushwaha</a>
          </Box>
        </Container>
      }
    </>
  );
}