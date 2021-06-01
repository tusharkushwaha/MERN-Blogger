import React, { useEffect, useState } from 'react'
import Grid from "@material-ui/core/Grid"
import axios from 'axios'
import Loading from "./Loading"
import Container from "@material-ui/core/Container"
import TableView from "./TableView"
import Switch from '@material-ui/core/Switch';
import Cards from "./Card"


function Viewpostothers({ history }) {
    const [reload, setreload] = useState(true)
    const [tableview, settableview] = useState(false)
    const [posts, setposts] = useState([])
    const [isLoaded, setisLoaded] = useState(false)
    useEffect(() => {
        if (!localStorage.getItem("authToken")) {
            const funcForFetch = async () => {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
                try {
                    const response = await axios.get(`/api/post/viewpost/home`, config)
                    setposts(response.data.posts)
                    setisLoaded(true)

                } catch (err) {
                    console.log(err);
                    history.push("/error404")
                }
            }
            funcForFetch()
        }
        else {
            const funcForFetch = async () => {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                }
                const response = await axios.get("/api/post/viewpost/others", config)
                setposts(response.data.posts)
                setisLoaded(true)
            }
            funcForFetch()
        }

    }, [history, reload])
    const handleChange = () => settableview(initial => !initial)
    return (
        <>
            {isLoaded ?
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
                                                <TableView post={post} setreload={setreload} showActions={false} />
                                            </Grid>
                                        )
                                    })}
                                </>
                                :
                                <>
                                    {posts.map(post => {
                                        return (
                                            <Grid item key={post._id} xs={12} md={4} lg={4}>
                                                <Cards post={post} showActions={false} setreload={setreload} />
                                            </Grid>
                                        )
                                    })}
                                </>
                            }
                        </Grid>
                    </Container>
                </>
                : <Loading message="Loading Posts..." />
            }

        </>
    )
}

export default Viewpostothers
