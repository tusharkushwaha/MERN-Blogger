import React, { useEffect, useState } from 'react'
import Grid from "@material-ui/core/Grid"
import axios from 'axios'
import Loading from "./Loading"
import Container from "@material-ui/core/Container"
import Cards from "./Card"
import TableView from "./TableView"
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import "../css/viewpostTable.css"


function Viewpostyours({ history }) {
    const [reload, setreload] = useState(true)
    const [tableview, settableview] = useState(false)
    const [posts, setposts] = useState([])
    const [isLoaded, setisLoaded] = useState(false)
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
            const response = await axios.get("/api/post/viewpost/yours", config)
            setposts(response.data.posts)
            setisLoaded(true)
        }
        funcForFetch()
    }, [history, reload])
    const handleChange = () => settableview(initial => !initial)

    const classes = useStyles();
    return (
        <>
            {isLoaded ?
                <>
                    {posts.length === 0 ?
                        <div id="emptypost">
                            No posts to show.
                    <Button
                                variant="contained"
                                color="primary"
                                size="medium"
                                className={classes.button}
                                startIcon={<AddCircleIcon />}
                                onClick={()=>history.push("/createpost")}
                            >
                                Create One Now
                    </Button>
                        </div>
                        :
                        <>
                            <div id="viewpostTable">
                            Change View
                                <Switch
                                    onChange={handleChange}
                                    color="primary"
                                    name="checkedB"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </div>
                            <Container>
                                <Grid container>
                                    {tableview ?
                                        <>
                                            {posts.map(post => {
                                                return (
                                                    <Grid item key={post._id} xs={12} md={12} lg={12}>
                                                        <TableView post={post} setreload={setreload} showActions={true}/>
                                                    </Grid>
                                                )
                                            })}
                                        </>
                                        :
                                        <>
                                            {posts.map(post => {
                                                return (
                                                    <Grid item key={post._id} xs={12} md={4} lg={4}>
                                                        <Cards post={post} showActions={true} setreload={setreload} />
                                                    </Grid>
                                                )
                                            })}
                                        </>
                                    }
                                </Grid>
                            </Container>
                        </>
                    }
                </>
                : <Loading message="Loading Posts..." />
            }

        </>
    )
}
const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));

export default Viewpostyours
