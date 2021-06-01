import React, { useState } from 'react'
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios'
import { Link, useHistory } from "react-router-dom"
import Loading from "./Loading"

function TableView({ post, setreload, showActions}) {
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
    return (
        <>
            {isSubmit ?
                <Loading message="Deleting.." />
                :
                
                    <div id="tableContainer">
                        <div id="tableTitle">
                            {post.title}
                        </div>
                        <div id="tableflex">
                            <div>
                                <span>
                                    <Link to={`/viewpost/${post._id}`}>
                                        <Tooltip title="View">
                                            <ImportContactsIcon className="tooltipcss editico" />
                                        </Tooltip>
                                    </Link>
                                </span>
                                {showActions?
                                <>
                                <span>
                                {post.privacy.localeCompare("public") === 0 ? <Tooltip title="Public"><VisibilityIcon className="tooltipcss" /></Tooltip> : <Tooltip title="Private"><VisibilityOffIcon className="tooltipcss" /></Tooltip>}
                            </span>
                            <span>
                                <Tooltip title="Edit">
                                    <Link to={`/editpost/${post._id}`}><EditIcon className="editico" /></Link>
                                </Tooltip>
                            </span>
                            <span>
                                <Link to="#" onClick={handleDelete}>
                                    <Tooltip title="Delete">
                                        <DeleteIcon className="tooltipcss editico" />
                                    </Tooltip>
                                </Link>
                            </span>
                                </>
                                :
                                <>{post.username}</>
                                }

                            </div>
                            <div id="tableDate">
                                {post.date}
                            </div>
                        </div>

                    </div>
                
            }

        </>
    )
}

export default TableView
