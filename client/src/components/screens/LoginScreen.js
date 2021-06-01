import React, { useState, useEffect, useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link } from "react-router-dom"
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn({ history }) {
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/")
    }
  }, [history])
  const { dispatch } = useContext(UserContext)
  const { dispatch1 } = useContext(Profilestate)
  const [isloading, setisloading] = useState(false)
  const [user, setUser] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
     }
  const handleSubmit = async (e) => {
    setisloading(true)
    e.preventDefault()
    const config = {
      header: {
        "Content-Type": "application/json"
      }
    }
    const { password, email } = user
    try {
      const { data } = await axios.post("/api/auth/login", { email, password }, config)
      localStorage.setItem("authToken", data.token)
      dispatch1({ type: "DETAILS", payload: JSON.stringify(data.details) })
      dispatch({ type: "USER" })
      history.push("/")
    } catch (err) {
      if (err.response.data.error.startsWith("Illegal arguments: string, undefined")) {
        setError("Please Sign with Google.")
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
      setisloading(false)
    }
  }
  const responseFailGoogle = () => {
    // console.log("Google signin failed");
    return
  }
  const classes = useStyles();

  return (
    <>
      {isloading ?
        <Loading message="Signing in.." />
        :
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
        </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChange}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={handleChange}
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
          </Button>
              <div>
                <GoogleLogin
                  clientId= process.env.CLINETID
                  render={renderProps => (
                    
                    <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} variant="contained" disabled={renderProps.disabled}startIcon={<><img src="/images/google.png" alt="google"/></>}>
                      Sign in With Google
                    </Button>
                  )}
                  buttonText="Login"
                  onSuccess={responseGoogle}
                  onFailure={responseFailGoogle}
                  cookiePolicy='single_host_origin'
                />
              </div>
              <Grid container className="mt-3">
                <Grid item xs>
                  <Link to="/forgotpassword" variant="body2">
                    Forgot password?
              </Link>
                </Grid>
                <Grid item>
                  <Link to="/register" variant="body2">
                    "Don't have an account? Sign Up"
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