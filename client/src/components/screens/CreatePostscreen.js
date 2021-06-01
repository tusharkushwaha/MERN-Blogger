import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import "../css/CreatePost.css"
import Loading from "./Loading"
import axios from "axios"
import { firebaseStorage } from '../../firebase/config'
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));



function CreatePostscreen({ history }) {
    useEffect(() => {
        if (!localStorage.getItem("authToken")) {
            history.push("/login")
        }
    }, [history])
    const [progress, setProgress] = useState(0);
    const [post, setPost] = useState({ title: "", bodyOfEditor: "", privacy: "" })
    const [File, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [submit, setsubmit] = useState(false)
    const types = ['image/png', 'image/jpeg', "image/svg+xml", 'image/jpg'];
    const handleChange = (e) => {
        setPost({ ...post, [e.target.name]: e.target.value })
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
                post.imageurl = url
                try {
                    const res = await axios.post("/api/post/createpost", post, config)
                    if(res){

                        history.push("/viewpost/yours/createdposts")
                    }
                } catch (err) {
                    localStorage.removeItem("authToken", "details")
                }
            })
            
        }
        else {
            try {
                await axios.post("/api/post/createpost", post, config)
                setTimeout(() => {
                    history.push("/viewpost/yours/posts")
                    
                }, 100);
            } catch (err) {
                localStorage.removeItem("authToken", "details")
            }
            
        }

    }

    const classNamees = useStyles();
    return (
        <>
            {!submit ?
                <section>
                    <div className="cretepost">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="createPost">
                                Title
                    </div>
                            <div>
                                <input type="text" name="title" id="title" required maxLength="200" onChange={handleChange} />
                            </div>
                            <div className="createPost">
                                Body
                  </div>
                            <div>
                                <textarea name="bodyOfEditor" id="bodyOfEditor" cols="" rows="13" onChange={handleChange} required></textarea>
                            </div>
                            <div>
                                <span>
                                    <input type="radio" id="Public" name="privacy" value="public" onChange={handleChange} required />
                                    <label htmlFor="Public">Public</label>&nbsp;&nbsp;
                        <input type="radio" id="Private" name="privacy" value="private" onChange={handleChange} />
                                    <label htmlFor="Private">Private</label>
                                </span>
                            </div>
                            <br />
                            <div>
                                <Button
                                    variant="contained"
                                    component="label"
                                    size="medium"
                                    color={(File === null) ? "default" : "secondary"}
                                    className={classNamees.button}
                                    startIcon={<CloudUploadIcon />}
                                >
                                    {(File === null) ? <>Upload</> : <>Selected</>}
                                    <input
                                        type="file"
                                        hidden onChange={handleimage}
                                    />
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    className={classNamees.button}
                                    startIcon={<SaveIcon />}>
                                    Create Post
                        </Button>

                            </div>
                            <div id="alertDiv">
                                {File && <Alert severity="success" >
                                    <AlertTitle>{File && File.name}</AlertTitle>
                                </Alert>}
                                {error && <Alert severity="error">
                                    <AlertTitle>{error && error}</AlertTitle>
                                </Alert>}
                            </div>
                        </form>
                    </div>
                </section>
                :
                <Loading message="Creating post" percentage={progress} />
            }
        </>

    )
}


export default CreatePostscreen
