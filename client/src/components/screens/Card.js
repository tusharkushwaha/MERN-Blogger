import React, { useState } from 'react';
import { Link, useHistory } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios'
import Loading from "./Loading"
import "../css/Card.css"

const useStyles = makeStyles({
    root: {
        maxWidth: 375,
        width: 375
    },
    media: {
        height: 140,
    },

});

export default function MediaCard({ post, showActions, setreload }) {
    const [isSubmit, setisSubmit] = useState(false)
    const history = useHistory()
    const handleDelete = async () => {
        setisSubmit(true)
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
            }
        }
        try {
            const response = await axios.delete(`/api/post/deletepost/${post._id}`, config)
            if (response) {
                setreload(i => !i)

            }
        } catch (err) {
            history.push("/error404")
        }



    }

    const classes = useStyles();
    return (
        <>
            {isSubmit ?
                <Loading message="Deleting.." />
                :
                <div id="divSpace">
                    <Card className={classes.root}>
                        {showActions ?
                            <CardHeader
                                subheader={post.date}
                            />
                            :
                            <CardHeader
                                avatar={
                                    <img src={`${post.userimage}`} alt="profile" id="cardAvatar" />

                                }
                                title={post.username}
                                subheader={post.date}
                            />
                        }
                        <Link to={`/viewpost/${post._id}`}>
                            <CardActionArea>
                                <CardMedia
                                    className={classes.media}
                                    image={`${post.imageurl}`}
                                    title="Posts"
                                />
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom component="p">
                                        {post.title}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Link>
                        {showActions ?
                            <CardActions>
                                {post.privacy.localeCompare("public") === 0 ? <Tooltip title="Public"><VisibilityIcon className="tooltipcss" /></Tooltip> : <Tooltip title="Private"><VisibilityOffIcon className="tooltipcss" /></Tooltip>}
                                <Tooltip title="Edit">
                                    <Link to={`/editpost/${post._id}`}><EditIcon /></Link>
                                </Tooltip>
                                <Tooltip title="Delete" onClick={handleDelete}>
                                    <DeleteIcon className="tooltipcss" />
                                </Tooltip>
                            </CardActions>
                            :
                            <></>
                        }

                    </Card>
                </div>
            }
        </>
    );
}


