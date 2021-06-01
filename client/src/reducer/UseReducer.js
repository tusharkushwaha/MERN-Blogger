export const initialState = localStorage.getItem("authToken")? true: false

export const reducer = (state, action) => {
    if(action.type === "USER"){
        if(localStorage.getItem("authToken")) return true
        return false
    } 
    if(action.type==="DETAILS"){
        localStorage.setItem("details",action.payload)
        return (localStorage.getItem("details"))
    }

    return state;
}
export const profilestateinitail = (localStorage.getItem("details"))