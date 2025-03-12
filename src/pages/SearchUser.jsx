import Header from "../layout/Header";
import LeftSidebar from "../layout/LeftSidebar";
import RightSidebar from "../layout/RightSidebar";
import Footer from "../layout/Footer";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { addFriendRequest } from "../services/friendRequest";
import { getUserById } from "../services/user";

export default function SearchUser() {
    const location = useLocation();
    const searchResult = location.state?.searchResult || [];
    const [accountID, setAccountID] = useState(null);

    // Get user ID from token in local storage
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedUserId = localStorage.getItem("token");
                if (!storedUserId) {
                    console.error("No user ID found in localStorage");
                    return;
                }
                const response = await getUserById(storedUserId);
                setAccountID(response.data.id); 
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };
        fetchUser();
    }, []);

    return (
        <div className="wrapper">
            <Header />
            <LeftSidebar />
            <RightSidebar />
            <div id="content-page" className="content-page">
                <div className="container">
                    <div className="row">
                        <ListUser searchResult={searchResult} accountID={accountID} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

const ListUser = ({ searchResult, accountID }) => {
    const [receiverID, setReceiverID] = useState(null);
    const [message, setMessage] = useState("");

    const handleSubmitAddFriend = async (e, userID) => {
        e.preventDefault();
        if (!accountID) return;
        setReceiverID(userID);
        try {
            await addFriendRequest(accountID, userID);
            setMessage("Friend request sent successfully!");
        } catch (err) {
            console.error("Failed to add friend:", err);
            setMessage("Failed to send friend request.");
        }
    };

    return (
        <>
            {searchResult.length > 0 ? (
                searchResult.map((user) => (
                    <div className="col-md-6" key={user.id}>
                        <div className="card card-block card-stretch card-height">
                            <div className="card-body profile-page p-4">
                                <div className="user-detail">
                                    <div className="d-flex flex-wrap justify-content-between align-items-start">
                                        <div className="profile-detail d-flex">
                                            <div className="profile-img pe-4">
                                                <img src="./src/assets/images/user/05.jpg" alt="profile-img" className="avatar-130 img-fluid rounded-circle" />
                                            </div>
                                            <div className="user-data-block">
                                                <h4>
                                                    <a href={`/profile/${user.id}`}>{user.fullname}</a>
                                                </h4>
                                                <p>{user.email}</p>
                                                <p className="text-muted">
                                                    <i className="ri-map-pin-line"></i> {user.location || "Unknown Location"}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <button className="btn btn-primary me-2">Follow</button>
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={(e) => handleSubmitAddFriend(e, user.id)}
                                            >
                                                Add Friend
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No user found</p>
            )}
        </>
    );
};
