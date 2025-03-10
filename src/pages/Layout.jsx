import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import Footer from "../components/Footer";
import Home from "./Home";
import Profile from "./Profile";
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