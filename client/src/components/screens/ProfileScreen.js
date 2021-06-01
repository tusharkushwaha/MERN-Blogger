import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import Loading from "./Loading"
import Container from "@material-ui/core/Container"
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid"
import Form from "react-bootstrap/Form"
import { Alert, AlertTitle } from '@material-ui/lab';
import "../css/Profile.css"
import { firebaseStorage } from '../../firebase/config'
import { Profilestate } from "../../App"

function ProfileScreen({ history }) {
    const { dispatch1} = useContext(Profilestate)
    const [isLoaded, setisLoaded] = useState(false)
    const [profile, setprofile] = useState({})
    const [submit, setsubmit] = useState(false)
    const [File, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const types = ['image/png', 'image/jpeg', "image/svg+xml", 'image/jpg'];
    useEffect(() => {
        if (!localStorage.getItem("authToken")) {
            history.push("/login")
        }
        const funcForFetch = async () => {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            }
            const response = await axios.get("/api/auth/profile", config)
            setprofile(response.data.user)
            if (response) setisLoaded(true)
        }
        funcForFetch()
    }, [history])
    const handleChange = (e) => {
        setprofile({ ...profile, [e.target.name]: e.target.value })
    }
    const handleimage = (e) => {
        let selected = e.target.files[0]
        if (selected && types.includes(selected.type)) {
            setFile(selected);
            setError('');
        } else {
            setFile(null);
            setError('Please select an image file (png,jpg or jpeg)');
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setsubmit(true)
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
            }
        }
        if (File) {
            const storageRef = firebaseStorage.ref(File.name);
            storageRef.put(File).on('state_changed', (snap) => {
                let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
                setProgress(percentage);
            }, (err) => {
                setsubmit(false)
                setError(err)
            }, async () => {
                const url = await storageRef.getDownloadURL();
                profile.imageurl = url
                try {
                    const {data} = await axios.post("/api/auth/profileupdate", profile, config)
                    if (data) {
                        dispatch1({type:"DETAILS", payload:JSON.stringify(data.details)})
                        history.push("/")
                    }
                } catch (err) {
                    localStorage.removeItem("authToken", "details")
                }
            })

        }
        else {
            try {
                const {data} = await axios.post("/api/auth/profileupdate", profile, config)
                dispatch1({type:"DETAILS", payload:JSON.stringify(data.details)})
                setTimeout(() => {
                    history.push("/")

                }, 100);
            } catch (err) {
                console.log(err);
                localStorage.removeItem("authToken", "details")
            }

        }

    }
    const classes = useStyles();
    return (
        <>
            {
                isLoaded ?
                    <>{submit?
                        <Loading message="Updating Profile.." percentage={progress} />
                    :
                    <Container>
                        <Grid container>
                            <Grid item xs={12} md={4} lg={4}>
                                <div id="profileImgDiv">
                                        <img src={`${profile.imageurl}`} alt="Profile" width="80%" />
                                        <Button
                                            variant="contained"
                                            component="label"
                                            size="small"
                                            color= "default" 
                                            className={classes.button}
                                            startIcon={<EditIcon />}
                                        >   Edit
                                            
                                            <input
                                                type="file"
                                                hidden onChange={handleimage}
                                            />
                                        </Button>
                                        <div id="alertDiv">
                                            {File && <Alert severity="success" >
                                                <AlertTitle>{File && File.name}</AlertTitle>
                                            </Alert>}
                                            {error && <Alert severity="error">
                                                <AlertTitle>{error && error}</AlertTitle>
                                            </Alert>}
                                          </div>
                                        <div id="profile_username">
                                            {profile.username}
                                        </div>
                                        <div id="profileBio">
                                            {profile.bio}
                                        </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={8} lg={8}>
                                <div id="profileDiv">
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group controlId="username" className="mb-3">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control type="text" placeholder="Username" onChange={handleChange} name="username" value={`${profile.username}`}/>
                                        </Form.Group>
                                        <Form.Group controlId="firstname" className="mb-3">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control type="text" placeholder="First Name" value={profile.firstname ? `${profile.firstname}` : ""} name="firstname" onChange={handleChange}/>
                                        </Form.Group>
                                        <Form.Group controlId="lastname" className="mb-3">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control type="text" placeholder= "Last Name" value={profile.lastname ? `${profile.lastname}` : ""} name="lastname" onChange={handleChange}/>
                                        </Form.Group>
                                        <Form.Group controlId="Bio" className="mb-3">
                                            <Form.Label>Bio</Form.Label>
                                            <Form.Control type="text" placeholder="Bio" value={profile.bio ? `${profile.bio}` : ""}  onChange={handleChange} name="bio"/>
                                        </Form.Group>
                                        <Form.Group controlId="formBasicEmail" className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" value={`${profile.email}`} readOnly />
                                        </Form.Group>
                                        <Form.Group controlId="mobilenumber" className="mb-3">
                                            <Form.Label>Mobile No.</Form.Label>
                                            <Form.Control type="number" placeholder="Mobile No." value={profile.mobilenumber ? `${profile.mobilenumber}` : "Mobile No."}  name="mobilenumber" onChange={handleChange} />
                                        </Form.Group>
                                        <div id="profilebuttonm">
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="medium"
                                            className={classes.button}
                                            onClick={()=>history.push("/")}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            size="medium"
                                            className={classes.button}
                                            startIcon={<SaveIcon />}
                                        >
                                            Save Changes
                                        </Button>
                                        </div>
                                    </Form>
                                </div>
                            </Grid>

                        </Grid>
                    </Container>}
                    </>

                    : <Loading message="Loading Profile.." />
            }
        </>

    )
}
const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));


export default ProfileScreen
