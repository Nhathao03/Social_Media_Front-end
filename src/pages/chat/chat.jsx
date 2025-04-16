import Header from "../../layout/Header";
import LeftSidebar from "../../layout/LeftSidebar";
import RightSidebar from "../../layout/RightSidebar";
import Footer from "../../layout/Footer";
import { useEffect, useState } from "react";
import { getUserById } from "../../services/auth";
import { getFriendOfEachUser } from "../../services/friend"
import { jwtDecode } from "jwt-decode";
import { sendMessage, getMessagesByUsers } from "../../services/message";

export default function MyProfile() {
    const [user, setUser] = useState(null);
    // get Username base on token in local storage
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found in localStorage");
                    return;
                }
                const tokenData = jwtDecode(token);
                const userIdBytoken = tokenData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
                const userData = await getUserById(userIdBytoken);
                setUser(userData.data);
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
                        <div className="col-sm-12">
                            <ChatComponent user={user} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

const ChatComponent = ({ user }) => {
    const [listFriends, setListFriends] = useState([]);
    const [fullname, setFullname] = useState("");
    const [userID, setUserID] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (user) {
            setFullname(user.fullname || "");
            setUserID(user.id || "");
            setPreviewImage(user.avatar ? `https://localhost:7174/${user.avatar}` : null);
        }
    }, [user]);

    useEffect(() => {
        if (!userID) return;

        const fetchFriends = async () => {
            try {
                const response = await getFriendOfEachUser(userID);
                const fetchUsername = await Promise.all(
                    response.data.map(async (username) => {
                        const fetchUsernameData = await getUserById(username.friendID);
                        return { ...username, name: fetchUsernameData.data.fullname, avatar: fetchUsernameData.data.avatar };
                    })
                );
                setListFriends(fetchUsername);
            } catch (err) {
                console.error("Failed to fetch friends:", err);
            }
        };

        fetchFriends();
    }, [userID]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (userID && selectedUser) {
                try {
                    const response = await getMessagesByUsers(selectedUser.friendID, userID);
                    const fetchInforUser = await Promise.all(
                        response.data.map(async (data) => {
                            const fetchUser = await getUserById(data.receiverId);
                            return { ...data, name: fetchUser.data.fullname, avatar: fetchUser.data.avatar };
                        })
                    );
                    setMessages(fetchInforUser);
                } catch (error) {
                    console.error("Failed to fetch messages:", error);
                }
            }
        };
        fetchMessages();
    }, [userID, selectedUser]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser || !userID) return;

        try {
            const messageDTO = {
                senderID: userID,
                receiverID: selectedUser.friendID,
                content: newMessage
            };

            await sendMessage(messageDTO);
            setNewMessage("");

            // Fetch updated messages
            const response = await getMessagesByUsers(selectedUser.friendID, userID);
            const fetchInforUser = await Promise.all(
                response.data.map(async (data) => {
                    const fetchUser = await getUserById(data.receiverId);
                    return { ...data, name: fetchUser.data.fullname, avatar: fetchUser.data.avatar };
                })
            );
            setMessages(fetchInforUser);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };
    //format date
    const formatDate = (dateString) => {
        return new Date(dateString).toISOString().split("T")[0];
    };

    return (
        <>
            <div className="card">
                <div className="card-body chat-page p-0">
                    <div className="chat-data-block">
                        <div className="row">
                            <div className="col-lg-3 chat-data-left scroller">
                                <div className="chat-search pt-3 ps-3">
                                    <div className="d-flex align-items-center">
                                        <div className="chat-profile me-3">
                                            <img src={previewImage} alt="chat-user" className="avatar-60" />
                                        </div>
                                        <div className="chat-caption">
                                            <h5 className="mb-0">{fullname}</h5>
                                        </div>
                                    </div>
                                    <div className="chat-searchbar mt-4">
                                        <div className="form-group chat-search-data m-0">
                                            <input type="text" className="form-control round" id="chat-search" placeholder="Search" />
                                            <i className="ri-search-line"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="chat-sidebar-channel scroller mt-4 ps-3">
                                    <h5 className="">Friends</h5>
                                    <ul className="iq-chat-ui nav flex-column nav-pills">
                                        {listFriends ? (
                                            listFriends.map((friend) => (
                                                <li key={friend.friendID}>
                                                    <a
                                                        href="#"
                                                        className={`${selectedUser?.friendID === friend.friendID ? 'active' : ''}`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setSelectedUser(friend);
                                                        }}
                                                    >
                                                        <div className="d-flex align-items-center">
                                                            <div className="avatar me-2">
                                                                <img src={`https://localhost:7174/${friend.avatar}`} alt="chatuserimage" className="avatar-50" />
                                                                <span className="avatar-status"><i className="ri-checkbox-blank-circle-fill text-success"></i></span>
                                                            </div>
                                                            <div className="chat-sidebar-name">
                                                                <h6 className="mb-0">{friend.name}</h6>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </li>
                                            ))
                                        ) : null}
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-9 chat-data p-0 chat-data-right">
                                <div className="tab-content">
                                    {selectedUser ? (
                                        <div className="tab-pane fade active show" id="chatbox1" role="tabpanel">
                                            <div className="chat-head">
                                                <header className="d-flex justify-content-between align-items-center bg-white pt-3 pe-3 pb-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="sidebar-toggle">
                                                            <i className="ri-menu-3-line"></i>
                                                        </div>
                                                        <div className="avatar chat-user-profile m-0 me-3">
                                                            <img src={`https://localhost:7174/${selectedUser.avatar}`} alt="avatar" className="avatar-50" />
                                                            <span className="avatar-status"><i className="ri-checkbox-blank-circle-fill text-success"></i></span>
                                                        </div>
                                                        <h5 className="mb-0">{selectedUser.name}</h5>
                                                    </div>
                                                    <div className="chat-user-detail-popup scroller">
                                                        <div className="user-profile">
                                                            <button type="submit" className="close-popup p-3"><i className="ri-close-fill"></i></button>
                                                            <div className="user mb-4 text-center">
                                                                <a className="avatar m-0">
                                                                    <img src={`https://localhost:7174/${selectedUser.avatar}`} alt="avatar" />
                                                                </a>
                                                                <div className="user-name mt-4">
                                                                    <h4>{selectedUser.name}</h4>
                                                                </div>
                                                                <div className="user-desc">
                                                                    <p>Online</p>
                                                                </div>
                                                            </div>
                                                            <hr />
                                                            <div className="chatuser-detail text-left mt-4">
                                                                <div className="row">
                                                                    <div className="col-6 col-md-6 title">User ID:</div>
                                                                    <div className="col-6 col-md-6 text-right">{selectedUser.friendID}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="chat-header-icons d-flex">
                                                        <a href="#" className="chat-icon-phone bg-soft-primary">
                                                            <i className="ri-phone-line"></i>
                                                        </a>
                                                        <a href="#" className="chat-icon-video bg-soft-primary">
                                                            <i className="ri-vidicon-line"></i>
                                                        </a>
                                                        <a href="#" className="chat-icon-delete bg-soft-primary">
                                                            <i className="ri-delete-bin-line"></i>
                                                        </a>
                                                        <span className="dropdown bg-soft-primary">
                                                            <i className="ri-more-2-line cursor-pointer dropdown-toggle nav-hide-arrow cursor-pointer pe-0" id="dropdownMenuButton02" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="menu"></i>
                                                            <span className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton02">
                                                                <a className="dropdown-item" href="#"><i className="ri-pushpin-2-line me-1 h5"></i>Pin to top</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-delete-bin-6-line me-1 h5"></i>Delete chat</a>
                                                                <a className="dropdown-item" href="#"><i className="ri-time-line me-1 h5"></i>Block</a>
                                                            </span>
                                                        </span>
                                                    </div>
                                                </header>
                                            </div>
                                            <div className="chat-content scroller">
                                                {messages.map((message, index) => (
                                                    <div key={index} className={`chat ${message.senderID === userID ? 'chat-right' : 'chat-left'}`}>
                                                        <div className="chat-user">
                                                            <a className="avatar m-0">
                                                                <img
                                                                    src={`https://localhost:7174/${message.avatar}`}
                                                                    alt="avatar"
                                                                    className="avatar-35"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = 'https://via.placeholder.com/35';
                                                                    }}
                                                                />
                                                            </a>
                                                            <span className="chat-time mt-1">
                                                                {new Date(message.createdAt).toLocaleTimeString()}
                                                            </span>
                                                        </div>
                                                        <div className="chat-detail">
                                                            <div className="chat-message">
                                                                <p>{message.content}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="chat-footer p-3 bg-white">
                                                <form className="d-flex align-items-center" onSubmit={handleSendMessage}>
                                                    <div className="chat-attagement d-flex">
                                                        <a href="#"><i className="far fa-smile pe-3" aria-hidden="true"></i></a>
                                                        <a href="#"><i className="fa fa-paperclip pe-3" aria-hidden="true"></i></a>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="form-control me-3"
                                                        placeholder="Type your message"
                                                        value={newMessage}
                                                        onChange={(e) => setNewMessage(e.target.value)}
                                                    />
                                                    <button type="submit" className="btn btn-primary d-flex align-items-center px-2">
                                                        <i className="far fa-paper-plane" aria-hidden="true"></i>
                                                        <span className="d-none d-lg-block ms-1">Send</span>
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="chat-start">
                                            <span className="iq-start-icon text-primary"><i className="ri-message-3-line"></i></span>
                                            <button className="btn bg-white mt-3">Start Conversation!</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
