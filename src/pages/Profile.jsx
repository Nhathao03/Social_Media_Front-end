import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { getUserById } from "../services/user";

export default function Profile() {
    return (
        <div className="wrapper">
            <Header />
            <LeftSidebar />
            <RightSidebar />
            <div id="content-page" className="content-page">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <ProfilePage />
                            <Tag />
                        </div>
                        <div className="col-sm-12">
                            <div className="tab-content">
                                {/* <TimeLine /> */}
                                <About />
                                <Friends />
                                <Photos />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

const ProfilePage = () => {
    const [user, setUser] = useState(null);

    // get Username base on token in local storage
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedUserId = localStorage.getItem("token");
                if (!storedUserId) {
                    console.error("No user ID found in localStorage");
                    return;
                }
                const userData = await getUserById(storedUserId);
                setUser(userData.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        fetchUser();
    }, []);

     // get all post in database (not follow user)
        useEffect(() => {
            const fetchPost = async () => {
                try {
                    const postData = await getAllPost();
                    const postsWithUsernames = await Promise.all(
                        postData.data.map(async (post) => {
                            // Fetch username for the post author
                            const fetchUsername = await getUserById(post.userID);
                            // Fetch usernames for each comment author
                            const updatedComments = await Promise.all(
                                post.comments.map(async (comment) => {
                                    const fetchUsernamecomment = await getUserById(comment.userId);
                                    return { ...comment, username_comment: fetchUsernamecomment.data.fullname };
                                })
                            );
                            // Fetch usernames for each like author
                            const updatedLikes = await Promise.all(
                                post.likes.map(async (like) => {
                                    const fetchUsernamelike = await getUserById(like.userId);
                                    return { ...like, username_like: fetchUsernamelike.data.fullname };
                                })
                            );
                            return { ...post, username: fetchUsername.data.fullname, comments: updatedComments, likes: updatedLikes };
                        })
                    );
                    setPosts(postsWithUsernames);
                } catch (err) {
                    setError("Failed to fetch posts.");
                    console.error(err);
                }
            };
            fetchPost();
    
            // get username based on token in local storage
            const fetchUser = async () => {
                try {
                    const storedUserId = localStorage.getItem("token");
                    if (!storedUserId) {
                        console.error("No user ID found in localStorage");
                        return;
                    }
                    const userData = await getUserById(storedUserId);
                    setUser(userData.data);
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                }
            };
    
            fetchUser();
    
        }, []);
        //delete post
        const deletePost = async (id) => {
            try {
                await deletePostById(id);
                setPosts(posts.filter((post) => post.id !== id));
            } catch (error) {
                console.error("Failed to delete post:", error);
            }
        };
        //format date
        const formatDate = (dateString) => {
            return new Date(dateString).toISOString().split("T")[0];
        };

    return (
        <div className="card">
            <div className="card-body profile-page p-0">
            {user ? (
                <div className="profile-header">
                    
                        <div className="position-relative">
                        <img src="./src/assets/images/page-img/profile-bg1.jpg" alt="profile-bg" className="rounded img-fluid" />
                        <ul className="header-nav list-inline d-flex flex-wrap justify-end p-0 m-0">
                            <li><a href="#"><i className="ri-pencil-line"></i></a></li>
                            <li><a href="#"><i className="ri-settings-4-line"></i></a></li>
                        </ul>
                    </div>
                    <div className="user-detail text-center mb-3">
                        <div className="profile-img">
                            <img src="./src/assets/images/user/11.png" alt="profile-img" className="avatar-130 img-fluid" />
                        </div>
                        <div className="profile-detail">
                            <h3 className="">{user.fullname}</h3>
                        </div>
                    </div>
                    <div className="profile-info p-3 d-flex align-items-center justify-content-between position-relative">
                        <div className="social-info">
                            <ul className="social-data-block d-flex align-items-center justify-content-between list-inline p-0 m-0">
                                <li className="text-center ps-3">
                                    <h6>Posts</h6>
                                    <p className="mb-0">690</p>
                                </li>
                                <li className="text-center ps-3">
                                    <h6>Followers</h6>
                                    <p className="mb-0">206</p>
                                </li>
                                <li className="text-center ps-3">
                                    <h6>Following</h6>
                                    <p className="mb-0">100</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    
                </div>
                ) : null}
            </div>
        </div>
    );
}

const Tag = () => {
    return (
        <div className="card">
            <div className="card-body p-0">
                <div className="user-tabing">
                    <ul className="nav nav-pills d-flex align-items-center justify-content-center profile-feed-items p-0 m-0">
                        <li className="nav-item col-12 col-sm-3 p-0">
                            <a className="nav-link active" href="#pills-timeline-tab" data-bs-toggle="pill" data-bs-target="#timeline" role="button">Timeline</a>
                        </li>
                        <li className="nav-item col-12 col-sm-3 p-0">
                            <a className="nav-link" href="#pills-about-tab" data-bs-toggle="pill" data-bs-target="#about" role="button">About</a>
                        </li>
                        <li className="nav-item col-12 col-sm-3 p-0">
                            <a className="nav-link" href="#pills-friends-tab" data-bs-toggle="pill" data-bs-target="#friends" role="button">Friends</a>
                        </li>
                        <li className="nav-item col-12 col-sm-3 p-0">
                            <a className="nav-link" href="#pills-photos-tab" data-bs-toggle="pill" data-bs-target="#photos" role="button">Photos</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

const TimeLine = () => {
    return (
        <div className="tab-pane fade show active" id="timeline" role="tabpanel">
            <div className="card-body p-0">
                <div className="row">
                    <TimeLineLeftContent />
                    <TimeLineRightContent />
                </div>
            </div>
        </div>
    );
}

const TimeLineLeftContent = () => {
    return (
        <div className="col-lg-4">
            <div className="card">
                <div className="card-body">
                    <a href="#"><span className="badge badge-pill bg-primary font-weight-normal ms-auto me-1"><i className="ri-star-line"></i></span> 27 Items for yoou</a>
                </div>
            </div>
            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <div className="header-title">
                        <h4 className="card-title">Life Event</h4>
                    </div>
                    <div className="card-header-toolbar d-flex align-items-center">
                        <p className="m-0"><a href="javacsript:void();"> Create </a></p>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="event-post position-relative">
                                <a href="#"><img src="./src/assets/images/page-img/07.jpg" alt="gallary-image" className="img-fluid rounded" /></a>
                                <div className="job-icon-position">
                                    <div className="job-icon bg-primary p-2 d-inline-block rounded-circle"><i className="ri-briefcase-line text-white"></i></div>
                                </div>
                                <div className="card-body text-center p-2">
                                    <h5>Started New Job at Apple</h5>
                                    <p>January 24, 2019</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="event-post position-relative">
                                <a href="#"><img src="./src/assets/images/page-img/06.jpg" alt="gallary-image" className="img-fluid rounded" /></a>
                                <div className="job-icon-position">
                                    <div className="job-icon bg-primary p-2 d-inline-block rounded-circle"><i className="ri-briefcase-line text-white"></i></div>
                                </div>
                                <div className="card-body text-center p-2">
                                    <h5>Freelance Photographer</h5>
                                    <p className="mb-0">January 24, 2019</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <div className="header-title">
                        <h4 className="card-title">Photos</h4>
                    </div>
                    <div className="card-header-toolbar d-flex align-items-center">
                        <p className="m-0"><a href="javacsript:void();">Add Photo </a></p>
                    </div>
                </div>
                <div className="card-body">
                    <ul className="profile-img-gallary p-0 m-0 list-unstyled">
                        <li className=""><a href="#"><img src="./src/assets/images/page-img/g1.jpg" alt="gallary-image" className="img-fluid" /></a></li>
                        <li className=""><a href="#"><img src="./src/assets/images/page-img/g2.jpg" alt="gallary-image" className="img-fluid" /></a></li>
                        <li className=""><a href="#"><img src="./src/assets/images/page-img/g3.jpg" alt="gallary-image" className="img-fluid" /></a></li>
                        <li className=""><a href="#"><img src="./src/assets/images/page-img/g4.jpg" alt="gallary-image" className="img-fluid" /></a></li>
                        <li className=""><a href="#"><img src="./src/assets/images/page-img/g5.jpg" alt="gallary-image" className="img-fluid" /></a></li>
                        <li className=""><a href="#"><img src="./src/assets/images/page-img/g6.jpg" alt="gallary-image" className="img-fluid" /></a></li>
                        <li className=""><a href="#"><img src="./src/assets/images/page-img/g7.jpg" alt="gallary-image" className="img-fluid" /></a></li>
                        <li className=""><a href="#"><img src="./src/assets/images/page-img/g8.jpg" alt="gallary-image" className="img-fluid" /></a></li>
                        <li className=""><a href="#"><img src="./src/assets/images/page-img/g9.jpg" alt="gallary-image" className="img-fluid" /></a></li>
                    </ul>
                </div>
            </div>
            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <div className="header-title">
                        <h4 className="card-title">Friends</h4>
                    </div>
                    <div className="card-header-toolbar d-flex align-items-center">
                        <p className="m-0"><a href="javacsript:void();">Add New </a></p>
                    </div>
                </div>
                <div className="card-body">
                    <ul className="profile-img-gallary p-0 m-0 list-unstyled">
                        <li className="">
                            <a href="#">
                                <img src="./src/assets/images/user/05.jpg" alt="gallary-image" className="img-fluid" /></a>
                            <h6 className="mt-2 text-center">Anna Rexia</h6>
                        </li>
                        <li className="">
                            <a href="#"><img src="./src/assets/images/user/06.jpg" alt="gallary-image" className="img-fluid" /></a>
                            <h6 className="mt-2 text-center">Tara Zona</h6>
                        </li>
                        <li className="">
                            <a href="#"><img src="./src/assets/images/user/07.jpg" alt="gallary-image" className="img-fluid" /></a>
                            <h6 className="mt-2 text-center">Polly Tech</h6>
                        </li>
                        <li className="">
                            <a href="#"><img src="./src/assets/images/user/08.jpg" alt="gallary-image" className="img-fluid" /></a>
                            <h6 className="mt-2 text-center">Bill Emia</h6>
                        </li>
                        <li className="">
                            <a href="#"><img src="./src/assets/images/user/09.jpg" alt="gallary-image" className="img-fluid" /></a>
                            <h6 className="mt-2 text-center">Moe Fugga</h6>
                        </li>
                        <li className="">
                            <a href="#"><img src="./src/assets/images/user/10.jpg" alt="gallary-image" className="img-fluid" /></a>
                            <h6 className="mt-2 text-center">Hal Appeno </h6>
                        </li>
                        <li className="">
                            <a href="#"><img src="./src/assets/images/user/07.jpg" alt="gallary-image" className="img-fluid" /></a>
                            <h6 className="mt-2 text-center">Zack Lee</h6>
                        </li>
                        <li className="">
                            <a href="#"><img src="./src/assets/images/user/06.jpg" alt="gallary-image" className="img-fluid" /></a>
                            <h6 className="mt-2 text-center">Terry Aki</h6>
                        </li>
                        <li className="">
                            <a href="#"><img src="./src/assets/images/user/05.jpg" alt="gallary-image" className="img-fluid" /></a>
                            <h6 className="mt-2 text-center">Greta Life</h6>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

const CreatePost = () => {
    const [content, setContent] = useState("");
    const [userID, setUserID] = useState(null);
    const [PostImages, setPostImage] = useState([null]);
    const [message, setMessage] = useState("");
    const Views = useState();
    const Share = useState();
    const PostCategoryID = useState();
    const navigate = useNavigate();

    //get token user from local storage
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedUserId = localStorage.getItem("token");
                if (!storedUserId) {
                    console.error("No user ID found in localStorage");
                    return;
                }
                const userData = await getUserById(storedUserId);
                setUserID(userData.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        fetchUser();
    }, []);

    //Check image if have change
    const handleChangeImage = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const uploadedUrls = await Promise.all(files.map(async (file) => {
                return await uploadfile(file);
            }));

            const ListUrl = uploadedUrls.map((url) => {
                return {
                    Url: url.data
                }
            });
            setPostImage(ListUrl);
        }
    };


    //handle submit post
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userID) {
            setMessage("User ID not found. Please log in again.");
            return;
        }

        try {
            await createpost(userID, content, Views, Share, PostImages, PostCategoryID);
            setMessage("Post created successfully!");
            setTimeout(() => navigate("/home"), 1000);
        } catch (error) {
            setMessage(error.response?.data || "Failed to create post.");
        }
    };

    return (
        <div id="post-modal-data" className="card">
            <div className="card-header d-flex justify-content-between">
                <div className="header-title">
                    <h4 className="card-title">Create Post</h4>
                </div>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="d-flex align-items-center">
                        <div className="user-img">
                            <img
                                src="./src/assets/images/user/1.jpg"
                                alt="User"
                                className="avatar-60 rounded-circle"
                            />
                        </div>
                        <label className="post-text ms-3 w-100">
                            <input
                                type="text"
                                className="form-control rounded"
                                placeholder="Write something here..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                style={{ border: "none" }}
                            />
                        </label>
                    </div>
                    <hr />
                    <ul className="post-opt-block d-flex list-inline m-0 p-0 flex-wrap">
                        <li className="me-3 mb-md-0 mb-2">
                            <label className="btn btn-soft-primary">
                                <input type="file" onChange={handleChangeImage} hidden multiple />
                                <img
                                    src="./src/assets/images/small/07.png"
                                    alt="icon"
                                    className="img-fluid me-2"
                                />
                                Photo/Video
                            </label>
                        </li>
                        <li className="me-3 mb-md-0 mb-2">
                            <button type="button" className="btn btn-soft-primary">
                                <img
                                    src="./src/assets/images/small/08.png"
                                    alt="icon"
                                    className="img-fluid me-2"
                                />
                                Tag Friend
                            </button>
                        </li>
                        <li className="me-3">
                            <button type="button" className="btn btn-soft-primary">
                                <img
                                    src="./src/assets/images/small/09.png"
                                    alt="icon"
                                    className="img-fluid me-2"
                                />
                                Feeling/Activity
                            </button>
                        </li>
                        <li>
                            <button type="submit" className="btn btn-primary">
                                Post
                            </button>
                        </li>
                    </ul>
                </form>
            </div>
        </div>
    );
}
const TimeLineRightContent = () => {
    return (
        <div className="col-lg-8">
            <div className="card">
                <div className="card-body">
                    <div className="post-item">
                        <div className="user-post-data pb-3">
                            <div className="d-flex justify-content-between">
                                <div className="me-3">
                                    <img className="rounded-circle  avatar-60" src="./src/assets/images/user/1.jpg" alt="" />
                                </div>
                                <div className="w-100">
                                    <div className="d-flex justify-content-between flex-wrap">
                                        <div className="">
                                            <h5 className="mb-0 d-inline-block"><a href="#" className="">Bni Cyst</a></h5>
                                            <p className="ms-1 mb-0 d-inline-block">Add New Post</p>
                                            <p className="mb-0">3 hour ago</p>
                                        </div>
                                        <div className="card-post-toolbar">
                                            <div className="dropdown">
                                                <span className="dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                                                    <i className="ri-more-fill"></i>
                                                </span>
                                                <div className="dropdown-menu m-0 p-0">
                                                    <a className="dropdown-item p-3" href="#">
                                                        <div className="d-flex align-items-top">
                                                            <i className="ri-save-line h4"></i>
                                                            <div className="data ms-2">
                                                                <h6>Save Post</h6>
                                                                <p className="mb-0">Add this to your saved items</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a className="dropdown-item p-3" href="#">
                                                        <div className="d-flex align-items-top">
                                                            <i className="ri-pencil-line h4"></i>
                                                            <div className="data ms-2">
                                                                <h6>Edit Post</h6>
                                                                <p className="mb-0">Update your post and saved items</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a className="dropdown-item p-3" href="#">
                                                        <div className="d-flex align-items-top">
                                                            <i className="ri-close-circle-line h4"></i>
                                                            <div className="data ms-2">
                                                                <h6>Hide From Timeline</h6>
                                                                <p className="mb-0">See fewer posts like this.</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a className="dropdown-item p-3" href="#">
                                                        <div className="d-flex align-items-top">
                                                            <i className="ri-delete-bin-7-line h4"></i>
                                                            <div className="data ms-2">
                                                                <h6>Delete</h6>
                                                                <p className="mb-0">Remove thids Post on Timeline</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a className="dropdown-item p-3" href="#">
                                                        <div className="d-flex align-items-top">
                                                            <i className="ri-notification-line h4"></i>
                                                            <div className="data ms-2">
                                                                <h6>Notifications</h6>
                                                                <p className="mb-0">Turn on notifications for this post</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="user-post">
                            <a href="#"><img src="./src/assets/images/page-img/p1.jpg" alt="post-image" className="img-fluid w-100" /></a>
                        </div>
                        <div className="comment-area mt-3">
                            <div className="d-flex justify-content-between align-items-center flex-wrap">
                                <div className="like-block position-relative d-flex align-items-center">
                                    <div className="d-flex align-items-center">
                                        <div className="like-data">
                                            <div className="dropdown">
                                                <span className="dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                                                    <img src="./src/assets/images/icon/01.png" className="img-fluid" alt="" />
                                                </span>
                                                <div className="dropdown-menu py-2">
                                                    <a className="ms-2 me-2" href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Like"><img src="./src/assets/images/icon/01.png" className="img-fluid" alt="" /></a>
                                                    <a className="me-2" href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Love"><img src="./src/assets/images/icon/02.png" className="img-fluid" alt="" /></a>
                                                    <a className="me-2" href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Happy"><img src="./src/assets/images/icon/03.png" className="img-fluid" alt="" /></a>
                                                    <a className="me-2" href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="HaHa"><img src="./src/assets/images/icon/04.png" className="img-fluid" alt="" /></a>
                                                    <a className="me-2" href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Think"><img src="./src/assets/images/icon/05.png" className="img-fluid" alt="" /></a>
                                                    <a className="me-2" href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Sade" ><img src="./src/assets/images/icon/06.png" className="img-fluid" alt="" /></a>
                                                    <a className="me-2" href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Lovely"><img src="./src/assets/images/icon/07.png" className="img-fluid" alt="" /></a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="total-like-block ms-2 me-3">
                                            <div className="dropdown">
                                                <span className="dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                                                    140 Likes
                                                </span>
                                                <div className="dropdown-menu">
                                                    <a className="dropdown-item" href="#">Max Emum</a>
                                                    <a className="dropdown-item" href="#">Bill Yerds</a>
                                                    <a className="dropdown-item" href="#">Hap E. Birthday</a>
                                                    <a className="dropdown-item" href="#">Tara Misu</a>
                                                    <a className="dropdown-item" href="#">Midge Itz</a>
                                                    <a className="dropdown-item" href="#">Sal Vidge</a>
                                                    <a className="dropdown-item" href="#">Other</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="total-comment-block">
                                        <div className="dropdown">
                                            <span className="dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                                                20 Comment
                                            </span>
                                            <div className="dropdown-menu">
                                                <a className="dropdown-item" href="#">Max Emum</a>
                                                <a className="dropdown-item" href="#">Bill Yerds</a>
                                                <a className="dropdown-item" href="#">Hap E. Birthday</a>
                                                <a className="dropdown-item" href="#">Tara Misu</a>
                                                <a className="dropdown-item" href="#">Midge Itz</a>
                                                <a className="dropdown-item" href="#">Sal Vidge</a>
                                                <a className="dropdown-item" href="#">Other</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="share-block d-flex align-items-center feather-icon mt-2 mt-md-0">
                                    <a href="#" data-bs-toggle="offcanvas" data-bs-target="#share-btn" aria-controls="share-btn"><i className="ri-share-line"></i>
                                        <span className="ms-1">99 Share</span></a>
                                </div>
                            </div>
                            <hr />
                            <ul className="post-comments p-0 m-0">
                                <li className="mb-2">
                                    <div className="d-flex flex-wrap">
                                        <div className="user-img">
                                            <img src="./src/assets/images/user/02.jpg" alt="userimg" className="avatar-35 rounded-circle img-fluid" />
                                        </div>
                                        <div className="comment-data-block ms-3">
                                            <h6>Monty Carlo</h6>
                                            <p className="mb-0">Lorem ipsum dolor sit amet</p>
                                            <div className="d-flex flex-wrap align-items-center comment-activity">
                                                <a href="#">like</a>
                                                <a href="#">reply</a>
                                                <a href="#">translate</a>
                                                <span> 5 min </span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="d-flex flex-wrap">
                                        <div className="user-img">
                                            <img src="./src/assets/images/user/03.jpg" alt="userimg" className="avatar-35 rounded-circle img-fluid" />
                                        </div>
                                        <div className="comment-data-block ms-3">
                                            <h6>Paul Molive</h6>
                                            <p className="mb-0">Lorem ipsum dolor sit amet</p>
                                            <div className="d-flex flex-wrap align-items-center comment-activity">
                                                <a href="#">like</a>
                                                <a href="#">reply</a>
                                                <a href="#">translate</a>
                                                <span> 5 min </span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <form className="comment-text d-flex align-items-center mt-3" action="javascript:void(0);">
                                <input type="text" className="form-control rounded" placeholder="Enter Your Comment" />
                                <div className="comment-attagement d-flex">
                                    <a href="#"><i className="ri-link me-3"></i></a>
                                    <a href="#"><i className="ri-user-smile-line me-3"></i></a>
                                    <a href="#"><i className="ri-camera-line me-3"></i></a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const About = () => {
    return (
        <div className="tab-pane fade" id="about" role="tabpanel" >
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <AboutLeftContent />
                        <AboutRightContent />
                    </div>
                </div>
            </div>
        </div>
    );
}

const AboutLeftContent = () => {
    return (
        <div className="col-md-3">
            <ul className="nav nav-pills basic-info-items list-inline d-block p-0 m-0">
                <li>
                    <a className="nav-link active" href="#v-pills-basicinfo-tab" data-bs-toggle="pill" data-bs-target="#v-pills-basicinfo-tab" role="button">Contact and Basic Info</a>
                </li>
                <li>
                    <a className="nav-link" href="#v-pills-family-tab" data-bs-toggle="pill" data-bs-target="#v-pills-family" role="button">Family and Relationship</a>
                </li>
                <li>
                    <a className="nav-link" href="#v-pills-work-tab" data-bs-toggle="pill" data-bs-target="#v-pills-work-tab" role="button">Work and Education</a>
                </li>
                <li>
                    <a className="nav-link" href="#v-pills-lived-tab" data-bs-toggle="pill" data-bs-target="#v-pills-lived-tab" role="button">Places You've Lived</a>
                </li>
                <li>
                    <a className="nav-link" href="#v-pills-details-tab" data-bs-toggle="pill" data-bs-target="#v-pills-details-tab" role="button">Details About You</a>
                </li>
            </ul>
        </div>
    );
}

const AboutRightContent = () => {
    return (
        <div className="col-md-9 ps-4">
            <div className="tab-content" >
                <div className="tab-pane fade active show" id="v-pills-basicinfo-tab" role="tabpanel" aria-labelledby="v-pills-basicinfo-tab">
                    <h4>Contact Information</h4>

                    <div className="row">
                        <div className="col-3">
                            <h6>Email</h6>
                        </div>
                        <div className="col-9">
                            <p className="mb-0">Bnijohn@gmail.com</p>
                        </div>
                        <div className="col-3">
                            <h6>Mobile</h6>
                        </div>
                        <div className="col-9">
                            <p className="mb-0">(001) 4544 565 456</p>
                        </div>
                        <div className="col-3">
                            <h6>Address</h6>
                        </div>
                        <div className="col-9">
                            <p className="mb-0">United States of America</p>
                        </div>
                    </div>
                    <h4 className="mt-3">Websites and Social Links</h4>

                    <div className="row">
                        <div className="col-3">
                            <h6>Website</h6>
                        </div>
                        <div className="col-9">
                            <p className="mb-0">www.bootstrap.com</p>
                        </div>
                        <div className="col-3">
                            <h6>Social Link</h6>
                        </div>
                        <div className="col-9">
                            <p className="mb-0">www.bootstrap.com</p>
                        </div>
                    </div>
                    <h4 className="mt-3">Basic Information</h4>

                    <div className="row">
                        <div className="col-3">
                            <h6>Birth Date</h6>
                        </div>
                        <div className="col-9">
                            <p className="mb-0">24 January</p>
                        </div>
                        <div className="col-3">
                            <h6>Birth Year</h6>
                        </div>
                        <div className="col-9">
                            <p className="mb-0">1994</p>
                        </div>
                        <div className="col-3">
                            <h6>Gender</h6>
                        </div>
                        <div className="col-9">
                            <p className="mb-0">Female</p>
                        </div>
                        <div className="col-3">
                            <h6>interested in</h6>
                        </div>
                        <div className="col-9">
                            <p className="mb-0">Designing</p>
                        </div>
                        <div className="col-3">
                            <h6>language</h6>
                        </div>
                        <div className="col-9">
                            <p className="mb-0">English, French</p>
                        </div>
                    </div>
                </div>
                <div className="tab-pane fade" id="v-pills-family" role="tabpanel">
                    <h4 className="mb-3">Relationship</h4>
                    <ul className="suggestions-lists m-0 p-0">
                        <li className="d-flex mb-4 align-items-center">
                            <div className="user-img img-fluid"><i className="ri-add-fill"></i></div>
                            <div className="media-support-info ms-3">
                                <h6>Add Your Relationship Status</h6>
                            </div>
                        </li>
                    </ul>
                    <h4 className="mt-3 mb-3">Family Members</h4>
                    <ul className="suggestions-lists m-0 p-0">
                        <li className="d-flex mb-4 align-items-center">
                            <div className="user-img img-fluid"><i className="ri-add-fill"></i></div>
                            <div className="media-support-info ms-3">
                                <h6>Add Family Members</h6>
                            </div>
                        </li>
                        <li className="d-flex mb-4 align-items-center justify-content-between">
                            <div className="user-img img-fluid"><img src="./src/assets/images/user/01.jpg" alt="story-img" className="rounded-circle avatar-40" /></div>
                            <div className="w-100">
                                <div className="d-flex justify-content-between">
                                    <div className="ms-3">
                                        <h6>Paul Molive</h6>
                                        <p className="mb-0">Brothe</p>
                                    </div>
                                    <div className="edit-relation"><a href="#"><i className="ri-edit-line me-2"></i>Edit</a></div>
                                </div>
                            </div>
                        </li>
                        <li className="d-flex justify-content-between mb-4  align-items-center">
                            <div className="user-img img-fluid"><img src="./src/assets/images/user/02.jpg" alt="story-img" className="rounded-circle avatar-40" /></div>
                            <div className="w-100">
                                <div className="d-flex flex-wrap justify-content-between">
                                    <div className=" ms-3">
                                        <h6>Anna Mull</h6>
                                        <p className="mb-0">Sister</p>
                                    </div>
                                    <div className="edit-relation"><a href="#"><i className="ri-edit-line me-2"></i>Edit</a></div>
                                </div>
                            </div>
                        </li>
                        <li className="d-flex mb-4 align-items-center justify-content-between">
                            <div className="user-img img-fluid"><img src="./src/assets/images/user/03.jpg" alt="story-img" className="rounded-circle avatar-40" /></div>
                            <div className="w-100">
                                <div className="d-flex justify-content-between">
                                    <div className="ms-3">
                                        <h6>Paige Turner</h6>
                                        <p className="mb-0">Cousin</p>
                                    </div>
                                    <div className="edit-relation"><a href="#"><i className="ri-edit-line me-2"></i>Edit</a></div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="tab-pane fade" id="v-pills-work-tab" role="tabpanel" aria-labelledby="v-pills-work-tab">
                    <h4 className="mb-3">Work</h4>
                    <ul className="suggestions-lists m-0 p-0">
                        <li className="d-flex justify-content-between mb-4  align-items-center">
                            <div className="user-img img-fluid"><i className="ri-add-fill"></i></div>
                            <div className="ms-3">
                                <h6>Add Work Place</h6>
                            </div>
                        </li>
                        <li className="d-flex mb-4 align-items-center justify-content-between">
                            <div className="user-img img-fluid"><img src="./src/assets/images/user/01.jpg" alt="story-img" className="rounded-circle avatar-40" /></div>
                            <div className="w-100">
                                <div className="d-flex justify-content-between">
                                    <div className="ms-3">
                                        <h6>Themeforest</h6>
                                        <p className="mb-0">Web Designer</p>
                                    </div>
                                    <div className="edit-relation"><a href="#"><i className="ri-edit-line me-2"></i>Edit</a></div>
                                </div>
                            </div>
                        </li>
                        <li className="d-flex mb-4 align-items-center justify-content-between">
                            <div className="user-img img-fluid"><img src="./src/assets/images/user/02.jpg" alt="story-img" className="rounded-circle avatar-40" /></div>
                            <div className="w-100">
                                <div className="d-flex flex-wrap justify-content-between">
                                    <div className="ms-3">
                                        <h6>iqonicdesign</h6>
                                        <p className="mb-0">Web Developer</p>
                                    </div>
                                    <div className="edit-relation"><a href="#"><i className="ri-edit-line me-2"></i>Edit</a></div>
                                </div>
                            </div>
                        </li>
                        <li className="d-flex mb-4 align-items-center justify-content-between">
                            <div className="user-img img-fluid"><img src="./src/assets/images/user/03.jpg" alt="story-img" className="rounded-circle avatar-40" /></div>
                            <div className="w-100">
                                <div className="d-flex flex-wrap justify-content-between">
                                    <div className="ms-3">
                                        <h6>W3school</h6>
                                        <p className="mb-0">Designer</p>
                                    </div>
                                    <div className="edit-relation"><a href="#"><i className="ri-edit-line me-2"></i>Edit</a></div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <h4 className="mb-3">Professional Skills</h4>
                    <ul className="suggestions-lists m-0 p-0">
                        <li className="d-flex mb-4 align-items-center">
                            <div className="user-img img-fluid"><i className="ri-add-fill"></i></div>
                            <div className="ms-3">
                                <h6>Add Professional Skills</h6>
                            </div>
                        </li>
                    </ul>
                    <h4 className="mt-3 mb-3">College</h4>
                    <ul className="suggestions-lists m-0 p-0">
                        <li className="d-flex mb-4 align-items-center">
                            <div className="user-img img-fluid"><i className="ri-add-fill"></i></div>
                            <div className="ms-3">
                                <h6>Add College</h6>
                            </div>
                        </li>
                        <li className="d-flex mb-4 align-items-center">
                            <div className="user-img img-fluid"><img src="./src/assets/images/user/01.jpg" alt="story-img" className="rounded-circle avatar-40" /></div>
                            <div className="w-100">
                                <div className="d-flex flex-wrap justify-content-between">
                                    <div className="ms-3">
                                        <h6>Lorem ipsum</h6>
                                        <p className="mb-0">USA</p>
                                    </div>
                                    <div className="edit-relation"><a href="#"><i className="ri-edit-line me-2"></i>Edit</a></div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="tab-pane fade" id="v-pills-lived-tab" role="tabpanel" aria-labelledby="v-pills-lived-tab">
                    <h4 className="mb-3">Current City and Hometown</h4>
                    <ul className="suggestions-lists m-0 p-0">
                        <li className="d-flex mb-4 align-items-center justify-content-between">
                            <div className="user-img img-fluid"><img src="./src/assets/images/user/01.jpg" alt="story-img" className="rounded-circle avatar-40" /></div>
                            <div className="w-100">
                                <div className="d-flex flex-wrap justify-content-between">
                                    <div className="ms-3">
                                        <h6>Georgia</h6>
                                        <p className="mb-0">Georgia State</p>
                                    </div>
                                    <div className="edit-relation"><a href="#"><i className="ri-edit-line me-2"></i>Edit</a></div>
                                </div>
                            </div>
                        </li>
                        <li className="d-flex mb-4 align-items-center justify-content-between">
                            <div className="user-img img-fluid"><img src="./src/assets/images/user/02.jpg" alt="story-img" className="rounded-circle avatar-40" /></div>
                            <div className="w-100">
                                <div className="d-flex flex-wrap justify-content-between">
                                    <div className="ms-3">
                                        <h6>Atlanta</h6>
                                        <p className="mb-0">Atlanta City</p>
                                    </div>
                                    <div className="edit-relation"><a href="#"><i className="ri-edit-line me-2"></i>Edit</a></div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <h4 className="mt-3 mb-3">Other Places Lived</h4>
                    <ul className="suggestions-lists m-0 p-0">
                        <li className="d-flex mb-4 align-items-center">
                            <div className="user-img img-fluid"><i className="ri-add-fill"></i></div>
                            <div className="ms-3">
                                <h6>Add Place</h6>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="tab-pane fade" id="v-pills-details-tab" role="tabpanel" aria-labelledby="v-pills-details-tab">
                    <h4 className="mb-3">About You</h4>
                    <p>Hi, I’m Bni, I’m 26 and I work as a Web Designer for the iqonicdesign.</p>
                    <h4 className="mt-3 mb-3">Other Name</h4>
                    <p>Bini Rock</p>
                    <h4 className="mt-3 mb-3">Favorite Quotes</h4>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
                </div>
            </div>
        </div>
    );
}

const Friends = () => {
    return (
        <div className="tab-pane fade" id="friends" role="tabpanel">
            <div className="card">
                <div className="card-body">
                    <h2>Friends</h2>
                    <div className="friend-list-tab mt-2">
                        <ul className="nav nav-pills d-flex align-items-center justify-content-left friend-list-items p-0 mb-2">
                            <li>
                                <a className="nav-link active" data-bs-toggle="pill" href="#pill-all-friends" data-bs-target="#all-feinds">All Friends</a>
                            </li>
                            <li>
                                <a className="nav-link" data-bs-toggle="pill" href="#pill-recently-add" data-bs-target="#recently-add">Recently Added</a>
                            </li>
                            <li>
                                <a className="nav-link" data-bs-toggle="pill" href="#pill-closefriends" data-bs-target="#closefriends"> Close friends</a>
                            </li>
                            <li>
                                <a className="nav-link" data-bs-toggle="pill" href="#pill-home" data-bs-target="#home-town"> Home/Town</a>
                            </li>
                            <li>
                                <a className="nav-link" data-bs-toggle="pill" href="#pill-following" data-bs-target="#following">Following</a>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div className="tab-pane fade active show" id="all-friends" role="tabpanel">
                                <div className="card-body p-0">
                                    <div className="row">
                                        <div className="col-md-6 col-lg-6 mb-3">
                                            <div className="iq-friendlist-block">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <a href="#">
                                                            <img src="./src/assets/images/user/05.jpg" alt="profile-img" className="img-fluid" />
                                                        </a>
                                                        <div className="friend-info ms-3">
                                                            <h5>Petey Cruiser</h5>
                                                            <p className="mb-0">15  friends</p>
                                                        </div>
                                                    </div>
                                                    <div className="card-header-toolbar d-flex align-items-center">
                                                        <div className="dropdown">
                                                            <span className="dropdown-toggle btn btn-secondary me-2" id="dropdownMenuButton01" data-bs-toggle="dropdown" aria-expanded="true" role="button">
                                                                <i className="ri-check-line me-1 text-white"></i> Friend
                                                            </span>
                                                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton01">
                                                                <a className="dropdown-item" href="#">Get Notification</a>
                                                                <a className="dropdown-item" href="#">Close Friend</a>
                                                                <a className="dropdown-item" href="#">Unfollow</a>
                                                                <a className="dropdown-item" href="#">Unfriend</a>
                                                                <a className="dropdown-item" href="#">Block</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="closefriends" role="tabpanel">
                                <div className="card-body p-0">
                                    <div className="row">
                                        <div className="col-md-6 col-lg-6 mb-3">
                                            <div className="iq-friendlist-block">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <a href="#">
                                                            <img src="./src/assets/images/user/17.jpg" alt="profile-img" className="img-fluid" />
                                                        </a>
                                                        <div className="friend-info ms-3">
                                                            <h5>Hal Appeno</h5>
                                                            <p className="mb-0">25  friends</p>
                                                        </div>
                                                    </div>
                                                    <div className="card-header-toolbar d-flex align-items-center">
                                                        <div className="dropdown">
                                                            <span className="dropdown-toggle btn btn-secondary me-2" id="dropdownMenuButton48" data-bs-toggle="dropdown" aria-expanded="true" role="button">
                                                                <i className="ri-check-line me-1 text-white"></i> Friend
                                                            </span>
                                                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton48">
                                                                <a className="dropdown-item" href="#">Get Notification</a>
                                                                <a className="dropdown-item" href="#">Close Friend</a>
                                                                <a className="dropdown-item" href="#">Unfollow</a>
                                                                <a className="dropdown-item" href="#">Unfriend</a>
                                                                <a className="dropdown-item" href="#">Block</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="home-town" role="tabpanel">
                                <div className="card-body p-0">
                                    <div className="row">                                 
                                        <div className="col-md-6 col-lg-6 mb-3">
                                            <div className="iq-friendlist-block">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <a href="#">
                                                            <img src="./src/assets/images/user/07.jpg" alt="profile-img" className="img-fluid" />
                                                        </a>
                                                        <div className="friend-info ms-3">
                                                            <h5>Maya Didas</h5>
                                                            <p className="mb-0">12  friends</p>
                                                        </div>
                                                    </div>
                                                    <div className="card-header-toolbar d-flex align-items-center">
                                                        <div className="dropdown">
                                                            <span className="dropdown-toggle btn btn-secondary me-2" id="dropdownMenuButton53" data-bs-toggle="dropdown" aria-expanded="true" role="button">
                                                                <i className="ri-check-line me-1 text-white"></i> Friend
                                                            </span>
                                                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton53">
                                                                <a className="dropdown-item" href="#">Get Notification</a>
                                                                <a className="dropdown-item" href="#">Close Friend</a>
                                                                <a className="dropdown-item" href="#">Unfollow</a>
                                                                <a className="dropdown-item" href="#">Unfriend</a>
                                                                <a className="dropdown-item" href="#">Block</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="following" role="tabpanel">
                                <div className="card-body p-0">
                                    <div className="row">                                       
                                        <div className="col-md-6 col-lg-6 mb-3">
                                            <div className="iq-friendlist-block">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <a href="#">
                                                            <img src="./src/assets/images/user/10.jpg" alt="profile-img" className="img-fluid" />
                                                        </a>
                                                        <div className="friend-info ms-3">
                                                            <h5>Anna Mull</h5>
                                                            <p className="mb-0">6  friends</p>
                                                        </div>
                                                    </div>
                                                    <div className="card-header-toolbar d-flex align-items-center">
                                                        <div className="dropdown">
                                                            <span className="dropdown-toggle btn btn-secondary me-2" id="dropdownMenuButton59" data-bs-toggle="dropdown" aria-expanded="true" role="button">
                                                                <i className="ri-check-line me-1 text-white"></i> Friend
                                                            </span>
                                                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton59">
                                                                <a className="dropdown-item" href="#">Get Notification</a>
                                                                <a className="dropdown-item" href="#">Close Friend</a>
                                                                <a className="dropdown-item" href="#">Unfollow</a>
                                                                <a className="dropdown-item" href="#">Unfriend</a>
                                                                <a className="dropdown-item" href="#">Block</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Photos = () => {
    return (
        <div className="tab-pane fade" id="photos" role="tabpanel">
            <div className="card">
                <div className="card-body">
                    <h2>Photos</h2>
                    <div className="friend-list-tab mt-2">
                        <ul className="nav nav-pills d-flex align-items-center justify-content-left friend-list-items p-0 mb-2">
                            <li>
                                <a className="nav-link active" data-bs-toggle="pill" href="#pill-photosofyou" data-bs-target="#photosofyou">Photos of You</a>
                            </li>
                            <li>
                                <a className="nav-link" data-bs-toggle="pill" href="#pill-your-photos" data-bs-target="#your-photos">Your Photos</a>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div className="tab-pane fade active show" id="photosofyou" role="tabpanel">
                                <div className="card-body p-0">
                                    <div className="d-grid gap-2 d-grid-template-1fr-13">   
                                        <div className="">
                                            <div className="user-images position-relative overflow-hidden">
                                                <a href="#">
                                                    <img src="./src/assets/images/page-img/59.jpg" className="img-fluid rounded" alt="Responsive image" />
                                                </a>
                                                <div className="image-hover-data">
                                                    <div className="product-elements-icon">
                                                        <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                                            <li><a href="#" className="pe-3 text-white"> 60 <i className="ri-thumb-up-line"></i> </a></li>
                                                            <li><a href="#" className="pe-3 text-white"> 30 <i className="ri-chat-3-line"></i> </a></li>
                                                            <li><a href="#" className="pe-3 text-white"> 10 <i className="ri-share-forward-line"></i> </a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <a href="#" className="image-edit-btn" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit or Remove"><i className="ri-edit-2-fill"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="your-photos" role="tabpanel">
                                <div className="card-body p-0">
                                    <div className="d-grid gap-2 d-grid-template-1fr-13 ">                                      
                                        <div className="">
                                            <div className="user-images position-relative overflow-hidden">
                                                <a href="#">
                                                    <img src="./src/assets/images/page-img/60.jpg" className="img-fluid rounded" alt="Responsive image" />
                                                </a>
                                                <div className="image-hover-data">
                                                    <div className="product-elements-icon">
                                                        <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                                            <li><a href="#" className="pe-3 text-white"> 60 <i className="ri-thumb-up-line"></i> </a></li>
                                                            <li><a href="#" className="pe-3 text-white"> 30 <i className="ri-chat-3-line"></i> </a></li>
                                                            <li><a href="#" className="pe-3 text-white"> 10 <i className="ri-share-forward-line"></i> </a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <a href="#" className="image-edit-btn" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit or Remove"><i className="ri-edit-2-fill"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Loading = () => {
    return (
        <div className="col-sm-12 text-center">
            <img src="./src/assets/images/page-img/page-load-loader.gif" alt="loader" style="height: 100px;" />
        </div>
    );
}