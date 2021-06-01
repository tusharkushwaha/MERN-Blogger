import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button';
import { useParams } from 'react-router'
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
    const { id } = useParams()
    const [isLoaded, setisLoaded] = useState(false)
    const [progress, setProgress] = useState(0);
    const [Post, setPost] = useState({})
    const [File, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [submit, setsubmit] = useState(false)
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
            try {
                const response = await axios.get(`/api/post/viewpost/${id}`, config)
                setPost(response.data.post)
                setisLoaded(true)
            } catch (err) {
                history.push("/error404")
                setError(err.response.data.error)

            }


        }
        funcForFetch()
    }, [history, id])
    const handleChange = (e) => {
        setPost({ ...Post, [e.target.name]: e.target.value })
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
                Post.imageurl = url
                try {
                    const res = await axios.put(`/api/post/editpost/${id}`, Post, config)
                    if (res) {

                        history.push("/viewpost/yours/createdposts")
                    }
                } catch (err) {
                    localStorage.removeItem("authToken", "details")
                    history.push("/error404")
                }
            })

        }
        else {
            try {
                await axios.put(`/api/post/editpost/${id}`, Post, config)
                setTimeout(() => {
                    history.push("/viewpost/yours/posts")

                }, 100);
            } catch (err) {
                localStorage.removeItem("authToken", "details")
                history.push("/error404")
            }

        }

    }

    const classNamees = useStyles();
    return (
        <>
            {isLoaded ?
                <>
                    {!submit ?
                        <section>
                            <div className="cretepost">
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="createPost">
                                        Title
                    </div>
                                    <div>
                                        <input type="text" name="title" id="title" required maxLength="200" onChange={handleChange}
                                            value={`${Post.title}`} />
                                    </div>
                                    <div className="createPost">
                                        Body
                  </div>
                                    <div>
                                        <textarea name="bodyOfEditor" id="bodyOfEditor" cols="" rows="10" onChange={handleChange} required value={`${Post.bodyOfEditor}`}></textarea>
                                    </div>
                                    <div>
                                        <span>
                                            {`${Post.privacy}` === "public" ?
                                                <>
                                                    <input type="radio" id="Public" name="privacy" value="public" onChange={handleChange} required checked />
                                                    <label htmlFor="Public">Public</label>&nbsp;&nbsp;
                        <input type="radio" id="Private" name="privacy" value="private" onChange={handleChange} />
                                                    <label htmlFor="Private">Private</label>
                                                </>
                                                :
                                                <>
                                                    <input type="radio" id="Public" name="privacy" value="public" onChange={handleChange} required />
                                                    <label htmlFor="Public">Public</label>&nbsp;&nbsp;
                        <input type="radio" id="Private" name="privacy" value="private" onChange={handleChange} checked />
                                                    <label htmlFor="Private">Private</label>
                                                </>
                                            }
                                        </span>
                                    </div>
                                    <br />
                                    <div>
                                        <Button
                                            variant="contained"
                                            component="label"
                                            size="small"
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
                                            size="small"
                                            className={classNamees.button}
                                            startIcon={<SaveIcon />}>
                                            Update Post
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
                        <Loading message="Updating post" percentage={progress} />
                    }
                </>
                : <Loading message="Loading post" />
            }
        </>

    )
}


export default CreatePostscreen
