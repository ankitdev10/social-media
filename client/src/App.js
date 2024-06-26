import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={user ? <Home /> : <Login />} />
          <Route
            exact
            path="/login"
            element={user ? <Navigate replace to="/" /> : <Login />}
          />
          <Route
            exact
            path="/register"
            element={user ? <Navigate replace to="/" /> : <Register />}
          />
          <Route
            exact
            path="/messenger"
            element={!user ? <Navigate replace to="/" /> : <Messenger />}
          />
          <Route
            exact
            path="/profile/:username"
            element={user ? <Profile /> : <Navigate replace to="/login" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
