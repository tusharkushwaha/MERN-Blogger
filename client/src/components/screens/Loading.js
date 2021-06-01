import React from 'react'
import "../css/loading.css"

function Loading({ message, percentage }) {
    return (
        <>
        <div id="loadingContainer">
            <img src="/images/blogger.png" alt="Loading" width="35vw" />
        <div>{message}</div>
        {percentage?
            
            <div id="percentage">
                <div style={{width: `${percentage}%`}}>
                </div>
            </div>
            :<></>
            }
       </div>
        
    </>

    )
}

export default Loading
