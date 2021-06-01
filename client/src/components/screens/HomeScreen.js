import React, { useEffect, useState } from 'react'
import "../css/Home.css"
import Container from "react-bootstrap/Container"
import Grid from "@material-ui/core/Grid"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "@material-ui/core/Button"
import Box from '@material-ui/core/Box';
import axios from 'axios'
import { Link } from 'react-router-dom'
import Card from "./Card"
import Loading from "./Loading"

function HomeScreen({ history }) {
    const state = localStorage.getItem("authToken") ? true : false
    const [loading, setLoading] = useState(true)
    const [post, setpost] = useState()
    useEffect(() => {
        const funcForFetch = async () => {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                }
            }
            try {
                const response = await axios.get(`/api/post/viewpost/home`, config)
                setpost(response.data.posts)
                setLoading(false)

            } catch (err) {
                console.log(err);
                history.push("/error404")
            }
        }
        funcForFetch()
    }, [history])
    return (
        <div>
            {
                loading ?
                    <><Loading message="Loading.." /></>

                    :
                    <>
                        {state ? isLoggedIn() : notLoggedIn(history, post)}
                    </>
            }

        </div>
    )
}
const isLoggedIn = () => {
    const token = localStorage.getItem("authToken")
    const username = JSON.parse(localStorage.getItem("details")).username
    return (
        <>
            <div id="name">
                Hi {username}
            </div>
            <Container>
                <Row id="optionFlex">
                    <Col xs={12} md={6} className="options">
                        <Link to={`/viewpost/yours/${token}`}>
                            <div className="div">
                                <img src="/images/you.svg" alt="Your Posts" height="100%" />

                            </div>
                        </Link>
                        <div className="button">
                            <Link to={`/viewpost/yours/${token}`}>
                                <Button variant="contained" color="primary" disableElevation>
                                    Your Posts
                            </Button>
                            </Link>
                        </div>
                    </Col>
                    <Col xs={12} md={6} className="options">
                        <Link to={`/viewpost/others/${token}`}>
                            <div className="div">
                                <img src="/images/others.svg" alt="Others Posts" height="100%" />

                            </div>
                        </Link>
                        <div className="button">
                            <Link to={`/viewpost/others/${token}`}>
                                <Button variant="contained" color="primary" disableElevation>
                                    Other's Post
                            </Button>
                            </Link>
                        </div>
                    </Col>
                </Row>

            </Container>
        </>
    )
}

//  ---------not Logged in-----------


const notLoggedIn = (history, post) => {
    return (
        <>
            <Container>
                <Grid container>
                    <Grid item xs={12} md={12} lg={12}>
                        <div id="hi">
                            Hi
                        </div>
                        <div id="welcom2blogger">
                            Welcome to Blogger!
                        </div>
                        <div>
                            <div className="gridhomw">
                                <Button
                                    onClick={() => history.push("/login")}
                                    variant="contained"
                                    color="primary"
                                    size="medium">
                                    Create Post
                        </Button>
                                <Button
                                    onClick={() => history.push("/viewpost/others/view")}
                                    variant="contained"
                                    color="secondary"
                                    size="medium">
                                    Others Post
                        </Button>
                            </div>
                        </div>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                        <div className="homecenter">
                            <img src="/images/ez-4492160.jpg" alt="Increase your awareness" className="homeimage" />
                        </div>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} className="hometext">
                        <div className="homeheadin">
                            Know your community.
                        </div>
                        <div>
                            Find out which posts are a hit with Blogger’s built-in analytics. You’ll see where your audience is coming from and what they’re interested in. You can even connect your blog directly to Google Analytics for a more detailed look.
                        </div>
                    </Grid>

                </Grid>
            </Container>
            <Container className="mt-5">
                <Grid container>
                    <Grid item xs={12} md={6} lg={6} className="hometext">
                        <div className="homeheadin">
                            Increase Your Productivity.
                        </div>
                        <div>
                            If you feel like you don’t have enough time to do everything you want to do, maybe it’s time to check-in with your time management skills.No one is born to be very good at time management, so that’s okay if you think you’re bad in it. But everyone can learn to boost their productivity and achieve more!
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <div className="homecenter">
                            <img src="/images/pexels840.jpg" alt="Increase your productivity" className="homeimage" />
                        </div>
                    </Grid>
                </Grid>
            </Container>
            <Container className="mt-5">
                <Grid container>
                    <Grid item xs={12} md={6} lg={6}>
                        <div className="homecenter">
                            <img src="/images/koro-3280130.jpg" alt="Increase your productivity" className="homeimage" />
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} className="hometext">
                        <div className="homeheadin">
                            Build Memories.
                        </div>
                        <div>
                            Save the moments that matter. Blogger lets you safely store thousands of posts, photos, and more with Google for free.


                        </div>
                    </Grid>
                </Grid>
            </Container>
            <Container className="mt-5 mb-5">
                <Grid container>
                    <Grid item xs={12} md={6} lg={6} className="hometext">
                        <div className="homeheadin">
                            Boost Your Career.
                        </div>
                        <div>
                            Get paid for your hard work. Google AdSense can automatically display relevant targeted ads on your blog so that you can earn income by posting about your passion
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <div className="homecenter">
                            <img src="/images/065.jpg" alt="Increase your productivity" className="homeimage" />
                        </div>
                    </Grid>
                </Grid>
            </Container>
            <div id="homepublicpost">
                Some recent Posts.
                <Grid container>
                    <Grid item xs={12} md={6} lg={6}>
                        <Card post={post[0]} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} >
                        <Card post={post[1]} />
                    </Grid>
                </Grid>
            </div>
            <Container className="mt-5" id="finalverdict">
                <div className="homeheadin">
                    Join millions of others
                </div>
                <div>
                    Whether sharing your expertise, breaking news, or whatever’s on your mind, you’re in good company on Blogger. Sign up to discover why millions of people have published their passions here.
                </div>
                <div className="gridhomw">
                    <Button
                        type="submit"
                        onClick={() => history.push("/login")}
                        variant="contained"
                        color="primary"
                        size="medium">
                        Create Post Now
                        </Button>
                </div>
                <Box mt={8} align="center" className="mb-2">
                    {'Copyright © '}2021  <a href="https://github.com/tusharkushwaha" target="_blank" rel="noreferrer">Tushar Kushwaha</a>
                </Box>
            </Container>
        </>
    )
}


export default HomeScreen
