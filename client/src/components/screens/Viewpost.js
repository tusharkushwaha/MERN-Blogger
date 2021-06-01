import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'
import { makeStyles } from '@material-ui/core/styles';
import ShareIcon from '@material-ui/icons/Share';
import Loading from "./Loading"
import Container from "@material-ui/core/Container"
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import '../css/viewpost.css'

function Viewpost({ history }) {
    const [isLoaded, setisLoaded] = useState(false)
    const [error, seterror] = useState(false)
    const [post, setpost] = useState()
    const { id } = useParams()
    useEffect(() => {
        if (!localStorage.getItem("authToken")) {
            history.push("/login")
        }
        else{
            const funcForFetch = async () => {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                }
                try {
                    const response = await axios.get(`/api/post/viewpost/${id}`, config)
                    setpost(response.data.post)
                    setisLoaded(true)
                    
                } catch (err) {
                    seterror(err.response.data.error)
                    history.push("/error404")
                }
            }
            funcForFetch()
        }
    }, [history, id])
    const copyToClipboard = () => {
        if (post.privacy === "private") {
            seterror("You can't share this post as it is Private. In order to share it, make it Public")
            return
        }
        var copyText = document.getElementById("copylink");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        document.getElementById("copybutton").innerHTML = "Copied"

    }
    const classes = useStyles();
    return (
        <>
            {isLoaded ?
                <Container>
                    <div className="viewpostMid">
                        <div id="viewpostMidTitle">
                            {post.title}
                        </div>
                        <div id="viewpostMidDate">
                            {post.date}
                        </div>
                        <div id="viewpostMidBody">
                            {post.bodyOfEditor}
                        </div>
                        <div><input type="text" id="copylink" value={`https://blogger.kushwahatushar.tech/viewpost/${id}`} aria-hidden="true" readOnly />
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                className={classes.button}
                                startIcon={<ShareIcon />}
                                onClick={copyToClipboard}
                                id="copybutton"
                            >
                                Copy Link
                            </Button>
                        </div>
                        {error && <div id="viewpostalert"><Alert severity="error">{error}</Alert></div>}
                    </div>
                </Container>
                :
                <Loading message="Loading post..." />
            }
        </>

    )
}
const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));


export default Viewpost
