import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from "axios"
import { Alert, AlertTitle } from '@material-ui/lab';
import { useParams } from 'react-router';

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

export default function ResetPassword() {
    const {id} = useParams()
    const [status, setstatus] = useState(null)
    const [error, setError] = useState(null)
    const [Password, setPassword] = useState({ Password: "", confirmpassword:"" })
    const handleChange = (e) => setPassword({ ...Password, [e.target.name]: e.target.value })
    const handleSubmit = async(e) => {
        e.preventDefault()
        const {password, confirmpassword } = Password
        if (password !== confirmpassword) {
            setError("Password do not match")
            return
        }
        const config = {
            header: {
                "Content-Type": "application/json"
            }
        }
        try {
            const { data } = await axios.put(`/api/auth/resetpassword/${id}`, {password}, config)
            if (data) {
                setError(null)
                setstatus("Password Reset successful. Please login to continue")
            }
        } catch (err) {
            setError(err.response.data.error)
        }
        

    }
    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Reset Password
        </Typography>
                <form className={classes.form} noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {status?
                        <div id="alertDiv">
                        <Alert severity="success">
                            <AlertTitle>{status}</AlertTitle>
                        </Alert>
                    </div>
                        :
                        <>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="New Password"
                                onChange={handleChange}
                                type="password"
                                id="password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="confirmpassword"
                                label="Confirm Password"
                                onChange={handleChange}
                                type="password"
                                id="confirmpassword"
                            />
                        </Grid></>
                        }
                    </Grid>
                    {error && <div id="alertDiv">
                            <Alert severity="error">
                                <AlertTitle>{error}</AlertTitle>
                            </Alert>
                        </div>}
                        {status?
                        <></>
                        :
                        <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Reset Password
          </Button>}
                    
                </form>
            </div>
            <Box mt={8} align="center">
                {'Copyright © '}2021  <a href="https://github.com/tusharkushwaha" target="_blank" rel="noreferrer">Tushar Kushwaha</a>
            </Box>
        </Container>
    );
}