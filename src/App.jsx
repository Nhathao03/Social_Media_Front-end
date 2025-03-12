import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import MyProfile from "./pages/MyProfile";
import PrivateRoute from "./pages/auth/PrivateRoute";
import SearchUser from "./pages/SearchUser";
import Profile from "./pages/Profile";
import FriendRequest from "./pages/FriendRequest";
import './assets/css/libs.min.css';
import './assets/css/socialv.css';
import './assets/vendor/@fortawesome/fontawesome-free/css/all.min.css';
import './assets/vendor/remixicon/fonts/remixicon.css';
import './assets/vendor/vanillajs-datepicker/dist/css/datepicker.min.css';
import './assets/vendor/line-awesome/dist/line-awesome/css/line-awesome.min.css';
import './assets/images/favicon.ico';


function Account() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />       
                <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/my_profile" element={<MyProfile />} />
                <Route path="/search_user" element={<SearchUser />} />
                <Route path="/profile/:userID" element={<Profile />} />
                <Route path="/friendrequest" element={<FriendRequest/>}/>
            </Routes>
        </Router>
    );
}

export default Account;
