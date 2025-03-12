import Header from "../layout/Header";
import LeftSidebar from "../layout/LeftSidebar";
import RightSidebar from "../layout/RightSidebar";
import Footer from "../layout/Footer";
import Home from "./Home";
import Profile from "./MyProfile";
export default function Layout() {
    return (
        <div className="wrapper">
            <Header />
            <LeftSidebar />
            <RightSidebar />
            <div id="content-page" className="content-page">
                <Router>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/home" element={<Home />} />
                </Router>
            </div>
            <Footer />
        </div>
    )
}