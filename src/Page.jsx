import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
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
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    );
}

export default Account;
