import React, { useEffect, useContext } from 'react'
import { UserContext } from "../../App"

function LogoutScreen({ history }) {
    useEffect(()=>{
        localStorage.removeItem("authToken")
        localStorage.removeItem("details")
        dispatch({type:"USER"})
        history.push("login")
    })
    const { dispatch } = useContext(UserContext)
    return (
        <>
        
        </>
    )
}

export default LogoutScreen
