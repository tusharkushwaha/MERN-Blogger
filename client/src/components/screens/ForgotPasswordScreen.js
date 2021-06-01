import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Link } from "react-router-dom"
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Alert, AlertTitle } from '@material-ui/lab';
import axios from "axios"


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

export default function ForgotPassword() {
    const [disabled, setDisabled] = useState(true)
    const [email, setEmail] = useState({ email: "" })
    const [status, setstatus] = useState(null)
    const [error, seterror] = useState(null)
    const handleChange = (e) => setEmail({ ...email, [e.target.name]: e.target.value })
    const handleSubmit = async (e) => {
        e.preventDefault()
        const config = {
            header: {
                "Content-Type": "application/json"
            }
        }
        try {
            const { data } = await axios.post("/api/auth/forgotpassword", email, config)
            if (data) {
                setstatus("Email sent. Check your Inbox now.")
            }
        } catch (err) {
            seterror(err.response.data.error)
        }
        
    }
    const handleButton = ()=> setDisabled(i => !i)
    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Forgot Password
        </Typography>
                <form className={classes.form} noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2}>



                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="email"
                                label="Email"
                                onChange={handleChange}
                                type="email"
                                id="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox value="selfDeclaration" color="primary" id="checkbox" onClick={handleButton}/>}
                                label="I am sure that I own this email."
                            />
                        </Grid>
                    </Grid>
                    <div>
                        {status && <div id="alertDiv">
                            <Alert severity="success">
                                <AlertTitle>{status}</AlertTitle>
                            </Alert>
                        </div>}
                        {error && <div id="alertDiv">
                            <Alert severity="error">
                                <AlertTitle>{error}</AlertTitle>
                            </Alert>
                        </div>}
                    </div>
                    <Button
                        disabled={disabled? true: false}
                        type="submit"
                        id="submitbutton"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Send Email
                    </Button>
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
    );
}