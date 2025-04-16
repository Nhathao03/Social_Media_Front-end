import { useEffect, useState } from "react";
import { getUserById, logout, findUser, decodeToken } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { GetFriendRequestByReceiverID,getFriendRequestByUserID, rejectFriendRequest, confirmRequest } from "../services/friendRequest";
import { addFriend } from "../services/friend";

export default function Header() {
  const [user, setUser] = useState(null);
  const [stringData, setStringData] = useState("");
  const [fullname, setFullname] = useState("");
  const [Image, setImage] = useState(null);
  const navigate = useNavigate();


  // get Username base on token in local storage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }
        const tokenData = await decodeToken(token);
        const userData = await getUserById(tokenData.data.payload.userID);
        setUser(userData.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      setFullname(user.fullname || "");
      setImage(user.avatar ? `https://localhost:7174/${user.avatar}` : null);
    }
  }, [user]);

  //search user by email, phonenumber, username
  const handleSearchUserBystringData = async (e) => {
    e.preventDefault();
  
    if (!stringData) {
      alert("Please fill in username, phone number, or email.");
      return;
    }
  
    try {
      const [listfriendRequest, response] = await Promise.all([
        getFriendRequestByUserID(user.id),
        findUser(stringData),
      ]);
  
      const requests = listfriendRequest.data;
      const users = response.data;
  
      // Loop through found users
      const updatedUsers = users.map((searchUser) => {
        const matchedRequest = requests.find((req) => 
          (req.senderID === user.id && req.receiverID === searchUser.id) ||
          (req.receiverID === user.id && req.senderID === searchUser.id)
        );
  
        return {
          ...searchUser,
          checkFriend: matchedRequest ? matchedRequest.status : 0,
        };
      });
  
      console.log("Search result:", updatedUsers);
      navigate("/search_user", { state: { searchResult: updatedUsers } });
  
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };
  
  return (
    <div className="iq-top-navbar">
      <div className="iq-navbar-custom">
        <nav className="navbar navbar-expand-lg navbar-light p-0">
          <div className="iq-navbar-logo d-flex justify-content-between">
            <a href="/home">
              <img src="./src/assets/images/logo.png" className="img-fluid" alt="" />
              <span>SocialV</span>
            </a>
            <div className="iq-menu-bt align-self-center">
              <div className="wrapper-menu">
                <div className="main-circle"><i className="ri-menu-line"></i></div>
              </div>
            </div>
          </div>
          <div className="iq-search-bar device-search">
            <form onSubmit={handleSearchUserBystringData} className="searchbox">
              <button type="submit" className="search-link" style={{ border: 0, height: 0 }}><i className="ri-search-line"></i></button>
              <input
                type="text"
                className="text search-input"
                placeholder="Search here..."
                value={stringData}
                onChange={(e) => setStringData(e.target.value)}
              />
            </form>
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
            aria-label="Toggle navigation">
            <i className="ri-menu-3-line"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav  ms-auto navbar-list">
              <li>
                <a href="../dashboard/index.html" className="  d-flex align-items-center">
                  <i className="ri-home-line"></i>
                </a>
              </li>
              <li className="nav-item dropdown">
                <a href="#" className="dropdown-toggle" id="group-drop" data-bs-toggle="dropdown" aria-haspopup="true"
                  aria-expanded="false"><i className="ri-group-line"></i></a>
                <FriendRequest user={user} />
              </li>
              <li className="nav-item dropdown">
                <a href="#" className="search-toggle   dropdown-toggle" id="notification-drop" data-bs-toggle="dropdown">
                  <i className="ri-notification-4-line"></i>
                </a>
                <div className="sub-drop dropdown-menu" aria-labelledby="notification-drop">
                  <div className="card shadow-none m-0">
                    <div className="card-header d-flex justify-content-between bg-primary">
                      <div className="header-title bg-primary">
                        <h5 className="mb-0 text-white">All Notifications</h5>
                      </div>
                      <small className="badge  bg-light text-dark">4</small>
                    </div>
                    <div className="card-body p-0">
                      <a href="#" className="iq-sub-card">
                        <div className="d-flex align-items-center">
                          <div className="">
                            <img className="avatar-40 rounded" src="./src/assets/images/user/01.jpg" alt="" />
                          </div>
                          <div className="ms-3 w-100">
                            <h6 className="mb-0 ">Emma Watson Bni</h6>
                            <div className="d-flex justify-content-between align-items-center">
                              <p className="mb-0">95 MB</p>
                              <small className="float-right font-size-12">Just Now</small>
                            </div>
                          </div>
                        </div>
                      </a>
                      <a href="#" className="iq-sub-card">
                        <div className="d-flex align-items-center">
                          <div className="">
                            <img className="avatar-40 rounded" src="./src/assets/images/user/02.jpg" alt="" />
                          </div>
                          <div className="ms-3 w-100">
                            <h6 className="mb-0 ">New customer is join</h6>
                            <div className="d-flex justify-content-between align-items-center">
                              <p className="mb-0">Cyst Bni</p>
                              <small className="float-right font-size-12">5 days ago</small>
                            </div>
                          </div>
                        </div>
                      </a>
                      <a href="#" className="iq-sub-card">
                        <div className="d-flex align-items-center">
                          <div className="">
                            <img className="avatar-40 rounded" src="./src/assets/images/user/03.jpg" alt="" />
                          </div>
                          <div className="ms-3 w-100">
                            <h6 className="mb-0 ">Two customer is left</h6>
                            <div className="d-flex justify-content-between align-items-center">
                              <p className="mb-0">Cyst Bni</p>
                              <small className="float-right font-size-12">2 days ago</small>
                            </div>
                          </div>
                        </div>
                      </a>
                      <a href="#" className="iq-sub-card">
                        <div className="d-flex align-items-center">
                          <div className="">
                            <img className="avatar-40 rounded" src="./src/assets/images/user/04.jpg" alt="" />
                          </div>
                          <div className="w-100 ms-3">
                            <h6 className="mb-0 ">New Mail from Fenny</h6>
                            <div className="d-flex justify-content-between align-items-center">
                              <p className="mb-0">Cyst Bni</p>
                              <small className="float-right font-size-12">3 days ago</small>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a href="#" className="dropdown-toggle" id="mail-drop" data-bs-toggle="dropdown" aria-haspopup="true"
                  aria-expanded="false">
                  <i className="ri-mail-line"></i>
                </a>
                <div className="sub-drop dropdown-menu" aria-labelledby="mail-drop">
                  <div className="card shadow-none m-0">
                    <div className="card-header d-flex justify-content-between bg-primary">
                      <div className="header-title bg-primary">
                        <h5 className="mb-0 text-white">All Message</h5>
                      </div>
                      <small className="badge bg-light text-dark">4</small>
                    </div>
                    <div className="card-body p-0 ">
                      <a href="#" className="iq-sub-card">
                        <div className="d-flex  align-items-center">
                          <div className="">
                            <img className="avatar-40 rounded" src="./src/assets/images/user/01.jpg" alt="" />
                          </div>
                          <div className=" w-100 ms-3">
                            <h6 className="mb-0 ">Bni Emma Watson</h6>
                            <small className="float-left font-size-12">13 Jun</small>
                          </div>
                        </div>
                      </a>
                      <a href="#" className="iq-sub-card">
                        <div className="d-flex align-items-center">
                          <div className="">
                            <img className="avatar-40 rounded" src="./src/assets/images/user/02.jpg" alt="" />
                          </div>
                          <div className="ms-3">
                            <h6 className="mb-0 ">Lorem Ipsum Watson</h6>
                            <small className="float-left font-size-12">20 Apr</small>
                          </div>
                        </div>
                      </a>
                      <a href="#" className="iq-sub-card">
                        <div className="d-flex align-items-center">
                          <div className="">
                            <img className="avatar-40 rounded" src="./src/assets/images/user/03.jpg" alt="" />
                          </div>
                          <div className="ms-3">
                            <h6 className="mb-0 ">Why do we use it?</h6>
                            <small className="float-left font-size-12">30 Jun</small>
                          </div>
                        </div>
                      </a>
                      <a href="#" className="iq-sub-card">
                        <div className="d-flex align-items-center">
                          <div className="">
                            <img className="avatar-40 rounded" src="./src/assets/images/user/04.jpg" alt="" />
                          </div>
                          <div className="ms-3">
                            <h6 className="mb-0 ">Variations Passages</h6>
                            <small className="float-left font-size-12">12 Sep</small>
                          </div>
                        </div>
                      </a>
                      <a href="#" className="iq-sub-card">
                        <div className="d-flex align-items-center">
                          <div className="">
                            <img className="avatar-40 rounded" src="./src/assets/images/user/05.jpg" alt="" />
                          </div>
                          <div className="ms-3">
                            <h6 className="mb-0 ">Lorem Ipsum generators</h6>
                            <small className="float-left font-size-12">5 Dec</small>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a href="#" className="   d-flex align-items-center dropdown-toggle" id="drop-down-arrow"
                  data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <img src={Image} className="img-fluid rounded-circle me-3" alt="user" />
                  <div className="caption">
                    <h6 className="mb-0 line-height">{fullname}</h6>
                  </div>
                </a>
                <div className="sub-drop dropdown-menu caption-menu" aria-labelledby="drop-down-arrow">
                  <div className="card shadow-none m-0">
                    <div className="card-header  bg-primary">
                      <div className="header-title">
                        <h5 className="mb-0 text-white">Hello {fullname}</h5>
                        <span className="text-white font-size-12">Available</span>
                      </div>
                    </div>
                    <div className="card-body p-0 ">
                      <a href="/my_profile" className="iq-sub-card iq-bg-primary-hover">
                        <div className="d-flex align-items-center">
                          <div className="rounded card-icon bg-soft-primary">
                            <i className="ri-file-user-line"></i>
                          </div>
                          <div className="ms-3">
                            <h6 className="mb-0 ">My Profile</h6>
                            <p className="mb-0 font-size-12">View personal profile details.</p>
                          </div>
                        </div>
                      </a>
                      <a href="/edit_profile" className="iq-sub-card iq-bg-warning-hover">
                        <div className="d-flex align-items-center">
                          <div className="rounded card-icon bg-soft-warning">
                            <i className="ri-profile-line"></i>
                          </div>
                          <div className="ms-3">
                            <h6 className="mb-0 ">Edit Profile</h6>
                            <p className="mb-0 font-size-12">Modify your personal details.</p>
                          </div>
                        </div>
                      </a>
                      <a href="../app/account-setting.html" className="iq-sub-card iq-bg-info-hover">
                        <div className="d-flex align-items-center">
                          <div className="rounded card-icon bg-soft-info">
                            <i className="ri-account-box-line"></i>
                          </div>
                          <div className="ms-3">
                            <h6 className="mb-0 ">Account settings</h6>
                            <p className="mb-0 font-size-12">Manage your account parameters.</p>
                          </div>
                        </div>
                      </a>
                      <a href="../app/privacy-setting.html" className="iq-sub-card iq-bg-danger-hover">
                        <div className="d-flex align-items-center">
                          <div className="rounded card-icon bg-soft-danger">
                            <i className="ri-lock-line"></i>
                          </div>
                          <div className="ms-3">
                            <h6 className="mb-0 ">Privacy Settings</h6>
                            <p className="mb-0 font-size-12">Control your privacy parameters.
                            </p>
                          </div>
                        </div>
                      </a>
                      <div className="d-inline-block w-100 text-center p-3">
                        <a className="btn btn-primary iq-sign-btn" onClick={logout} role="button">Sign
                          out<i className="ri-login-box-line ms-2"></i></a>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

const FriendRequest = ({ user }) => {
  const [listData, setListData] = useState([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchListRequest = async () => {
      if (!user?.id) return; // Prevent API call if user ID is undefined
      try {
        const response = await GetFriendRequestByReceiverID(user.id);
        const fetchUser = await Promise.all(
          response.data.map(async (data) => {
            try {
              // Fetch user information
              const fetchUsername = await getUserById(data.senderID);
              return { ...data, username: fetchUsername.data.fullname };
            } catch (userFetchError) {
              console.error(`Failed to fetch user details for ID ${data.senderID}:`, userFetchError);
              return { ...data, username: "Unknown User" }; // Fallback value
            }
          })
        );
        setListData(fetchUser);
      } catch (err) {
        console.error("Failed to fetch friend requests:", err);
      }
    };
    fetchListRequest();
  }, [user?.id]);


  const handleConfirm = async (id) => {
    try {
      const response = await addFriend(id);
      await confirmRequest(id);
      console.log('Friend added successfully:', response);
      setMessage("Confirm friend request successfully");
    } catch (error) {
      console.error("Failed to confirm friend request:", error.response || error);
      setMessage(error.response?.data?.message || "Failed to add friend. Please try again.");
    }
  }

  const handleReject = async (id) => {
    try {
      const response = await rejectFriendRequest(id);
      console.log('Reject friend request successfully:', response);
      setMessage("Reject friend request successfully");
    } catch (error) {
      console.error("Failed to delete friend request:", error);
      setMessage(error.response?.data?.message || "Failed to reject friend request. Please try again.");
    }
  }

  return (
    <div className="sub-drop sub-drop-large dropdown-menu" aria-labelledby="group-drop">
      <div className="card shadow-none m-0">
        <div className="card-header d-flex justify-content-between bg-primary">
          <div className="header-title">
            <h5 className="mb-0 text-white">Friend Request</h5>
          </div>
        </div>
        <div className="card-body p-0">
          {listData.map((data) => (
            <div className="iq-friend-request" key={data.id}>
              <div className="iq-sub-card iq-sub-card-big d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <img className="avatar-40 rounded" src="./src/assets/images/user/01.jpg" alt="" />
                  <div className="ms-3">
                    <h6 className="mb-0 ">{data.username}</h6>
                    <p className="mb-0">40 friends</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <button onClick={() => handleConfirm(data.id)} className="me-3 btn btn-primary rounded">Confirm</button>
                  <button onClick={() => handleReject(data.id)} className="me-3 btn btn-secondary rounded">Delete Request</button>
                </div>
              </div>
            </div>
          ))}
          <div className="text-center">
            <a href="#" className=" btn text-primary">View More Request</a>
          </div>
        </div>
      </div>
    </div>
  );
}