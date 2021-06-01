import React, { useContext, useState } from 'react'
import { Link } from "react-router-dom"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext, Profilestate } from "../../App"

function Navbar1({history}) {
     const { state } = useContext(UserContext)
     const { profile } = useContext(Profilestate)
     const [expanded, setExpanded] = useState(false);
     return (
          <Navbar bg="dark" variant="dark" sticky="top" expand="lg" className="px-3" expanded={expanded}>
               <Navbar.Brand as={Link} to="/"> <img src="/images/blogger.png" alt="Logo" height="38rem" /> Blogger</Navbar.Brand>
               <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : "expanded")} />
               <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                         {state ?
                              //logged in
                              <>
                                   <Link to="/profile" onClick={() => setExpanded(false)}><img height="40rem" style={{ borderRadius: "14rem" }} src={JSON.parse(profile).imageurl} alt="profile" /></Link>
                                   <Nav.Link as={Link} to="/createpost" onClick={() => setExpanded(false)}>Create Post</Nav.Link>
                                   <Nav.Link as={Link} to="/viewpost/others/view" onClick={() => setExpanded(false)}>Others Post</Nav.Link>
                                   <Nav.Link as={Link} to="/logout" onClick={() => setExpanded(false)}>Logout</Nav.Link>
                              </>
                              :
                              // not logged in
                              <>
                                   <Nav.Link as={Link} to="/login" onClick={() => setExpanded(false)}>Login</Nav.Link>
                                   <Nav.Link as={Link} to="/register" onClick={() => setExpanded(false)}>Register</Nav.Link>
                                   <Nav.Link as={Link} to="/createpost" onClick={() => setExpanded(false)}>Create Post</Nav.Link>
                                   <Nav.Link as={Link} to="/viewpost/others/view" onClick={() => setExpanded(false)}>Others Post</Nav.Link>
                              </>
                         }
                    </Nav>
               </Navbar.Collapse>
          </Navbar>


     )

}


export default Navbar1
