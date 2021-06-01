import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Navbar from './components/screens/Navbar1'
import HomeScreen from "./components/screens/HomeScreen"
import LoginScreen from "./components/screens/LoginScreen"
import RegisterScreen from "./components/screens/RegisterScreen"
import ForgotPasswordScreen from "./components/screens/ForgotPasswordScreen"
import Viewpostyours from "./components/screens/Viewpostyours"
import Viewpostothers from "./components/screens/Viewpostothers"
import Viewpost from "./components/screens/Viewpost"
import ResetPasswordScreen from "./components/screens/ResetPasswordScreen"
import ProfileScreen from "./components/screens/ProfileScreen"
import EditPostScreen from "./components/screens/EditPostScreen"
import LogoutScreen from "./components/screens/LogoutScreen"
import CreatePostscreen from "./components/screens/CreatePostscreen"
import Error404 from "./components/screens/Error404"
import { initialState, reducer, profilestateinitail } from "./reducer/UseReducer"
import { createContext, useReducer } from "react"
import "./index.css"

export const UserContext = createContext()
export const Profilestate = createContext()
const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [profile, dispatch1] = useReducer(reducer, profilestateinitail)
  return (

    <Router>
      <div className="App">
        <UserContext.Provider value={{ state, dispatch }}>
          <Profilestate.Provider value={{ profile, dispatch1 }}>
            <Navbar />
            <Routing />
        </Profilestate.Provider>
        </UserContext.Provider>
      </div>
    </Router>

  );
}
const Routing = () => {
  return <Switch>
    <Route exact path="/" component={HomeScreen} />
    <Route exact path="/profile" component={ProfileScreen} />
    <Route exact path="/login" component={LoginScreen} />
    <Route exact path="/createpost" component={CreatePostscreen} />
    <Route exact path="/viewpost/yours/:id" component={Viewpostyours} />
    <Route exact path="/viewpost/others/:id" component={Viewpostothers} />
    <Route exact path="/viewpost/:id" component={Viewpost} />
    <Route exact path="/editpost/:id" component={EditPostScreen} />
    <Route exact path="/register" component={RegisterScreen} />
    <Route exact path="/forgotpassword" component={ForgotPasswordScreen} />
    <Route exact path="/resetpassword/:id" component={ResetPasswordScreen} />
    <Route exact path="/logout" component={LogoutScreen} />
    <Route exact path="/error404" component={Error404} />
  </Switch>
}
export default App;
