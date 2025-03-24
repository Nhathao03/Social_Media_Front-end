import Header from "../layout/Header";
import LeftSidebar from "../layout/LeftSidebar";
import RightSidebar from "../layout/RightSidebar";
import Footer from "../layout/Footer";
import { createpost, GetAllPostNearestCreatedAt, deletePostById } from "../services/post";
import { getUserById } from "../services/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadfile, UploadFileComment } from "../services/uploadfile";
import { createComment, getCommentByID } from "../services/comment";
import { AddLike } from "../services/likes";
import { jwtDecode } from "jwt-decode";

export default function Home() {
    return (
        <div className="wrapper">
            <Header />
            <LeftSidebar />
            <RightSidebar />
            <div id="content-page" className="content-page">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 row m-0 p-0">
                            <CreatePost />
                            <GetAllPost />
                        </div>
                        <div className="col-lg-4">
                            <Stories />
                            <Events />
                            <SuggestPage />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

const CreatePost = () => {
    const [content, setContent] = useState("");
    const [userID, setUserID] = useState(null);
    const [PostImages, setPostImage] = useState([null]);
    const [message, setMessage] = useState("");
    const Views = useState();
    const Share = useState();
    const PostCategoryID = useState();
    const [fullname, setFullname] = useState("");
    const [Image, setImage] = useState(null);
    const navigate = useNavigate();

    //get token user from local storage
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
                setUserID(userData.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };
        fetchUser();
    }, []);


    useEffect(() => {
        if (userID) {
            setFullname(userID.fullname || "");
            setImage(userID.avatar ? `https://localhost:7174/${userID.avatar}` : null);
        }
    }, [userID]);


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
        <div className="col-sm-12">
            <div className="card card-block card-stretch card-height">
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
                                    src={Image}
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
        </div>
    );
};

const GetAllPost = () => {
    const [posts, setPosts] = useState([]);
    const [userID, setUserID] = useState(null);
    const [error, setError] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");
    const sticker = useState("");
    const [ImageUrl, setImageComment] = useState(null);

    // get all post in database (not follow user)
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postData = await GetAllPostNearestCreatedAt();
                const postsWithUsernames = await Promise.all(
                    postData.data.map(async (post) => {
                        // Fetch username for the post author
                        const fetchUsername = await getUserById(post.userID);
                        // Fetch usernames for each comment author
                        const updatedComments = await Promise.all(
                            post.comments.map(async (comment) => {
                                const fetchUsernamecomment = await getUserById(comment.userId);
                                return { ...comment, username_comment: fetchUsernamecomment.data.fullname, avatar_comment: fetchUsernamecomment.data.avatar };
                            })
                        );
                        // Fetch usernames for each like author
                        const updatedLikes = await Promise.all(
                            post.likes.map(async (like) => {
                                const fetchUsernamelike = await getUserById(like.userId);
                                return { ...like, username_like: fetchUsernamelike.data.fullname };
                            })
                        );
                        return { ...post, username: fetchUsername.data.fullname, userAvatar: fetchUsername.data.avatar, comments: updatedComments, likes: updatedLikes };
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
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found in localStorage");
                    return;
                }
                const tokenData = jwtDecode(token);
                const userIdBytoken = tokenData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
                const userData = await getUserById(userIdBytoken);
                setUserID(userData.data);
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
                return await UploadFileComment(file);
            }));
            const ListUrl = uploadedUrls.map((url) => {
                return {
                    Url: url.data
                }
            });
            setImageComment(ListUrl);
        }
    };

    //handle submit comment
    const handleSubmitComment = async (e, postID) => {
        e.preventDefault();
        if (!userID) {
            setError("User ID not found. Please log in again.");
            return;
        }
        try {
            await createComment(userID, postID, content, ImageUrl, sticker);
            setMessage("Comment created successfully!");
            window.location.reload();
        } catch (error) {
            setMessage(error.response?.data || "Failed to create comment.");
        }
    }
    //handle add like post
    const handleAddLike = async (userID, postID) => {
        if (!userID) {
            setError("User ID not found. Please log in again.");
            return;
        }
        try {
            await AddLike(userID, postID);
            window.location.reload();
        } catch (error) {
            setMessage(error.response?.data || "Failed to add like.");
        }
    }


    return (
        <div>
            {error && <p className="text-danger">{error}</p>}
            {posts.map((post, index) => (
                <div className="col-sm-12">
                    <div className="card card-block card-stretch card-height" key={index}>
                        <div className="card-body">
                            <div className="user-post-data">
                                <div className="d-flex justify-content-between">
                                    <div className="me-3">
                                        <img className="rounded-circle img-fluid" src={`https://localhost:7174/${post.userAvatar}`} alt="" style={{ width: "57px", height: "50px" }} />
                                    </div>
                                    <div className="w-100">
                                        <div className="d-flex justify-content-between">
                                            <div className="">
                                                <h5 className="mb-0 d-inline-block"><a href={`/profile/${post.userID}`}>{post.username}</a></h5>
                                                <span className="mb-0 d-inline-block">Add New Post</span>
                                                <p className="mb-0 text-primary">{formatDate(post.createdAt)}</p>
                                            </div>
                                            <div className="card-post-toolbar">
                                                <div className="dropdown">
                                                    <span className="dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                                                        <i className="ri-more-fill"></i>
                                                    </span>
                                                    <div className="dropdown-menu m-0 p-0">
                                                        <a className="dropdown-item p-3" href="#">
                                                            <div className="d-flex align-items-top">
                                                                <div className="h4">
                                                                    <i className="ri-save-line"></i>
                                                                </div>
                                                                <div className="data ms-2">
                                                                    <h6>Save Post</h6>
                                                                    <p className="mb-0">Add this to your saved items</p>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <a className="dropdown-item p-3" onClick={() => deletePost(post.id)}>
                                                            <div className="d-flex align-items-top">
                                                                <i className="fa fa-trash h4"></i>
                                                                <div className="data ms-2">
                                                                    <h6>Delete Post</h6>
                                                                    <p className="mb-0">Delete this post.</p>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <a className="dropdown-item p-3" href="#">
                                                            <div className="d-flex align-items-top">
                                                                <i className="ri-close-circle-line h4"></i>
                                                                <div className="data ms-2">
                                                                    <h6>Hide Post</h6>
                                                                    <p className="mb-0">See fewer posts like this.</p>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <a className="dropdown-item p-3" >
                                                            <div className="d-flex align-items-top">
                                                                <i className="ri-user-unfollow-line h4"></i>
                                                                <div className="data ms-2">
                                                                    <h6>Unfollow User</h6>
                                                                    <p className="mb-0">Stop seeing posts but stay friends.</p>
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
                            <div className="mt-3">
                                <p>{post.content}</p>
                            </div>
                            {!post ? (
                                <div className="user-post">
                                    <div className="d-grid grid-rows-2 grid-flow-col gap-3">
                                        {post.postImages.map((image, index) => (
                                            <div key={index} className="row-span-2 row-span-md-1">
                                                <img src={`https://localhost:7174/${image.url}`} alt={`post-image-${index}`} className="img-fluid rounded w-100" />
                                            </div>
                                            // <div className="row-span-1">
                                            //     <img src="" alt="post-image" className="img-fluid rounded w-100" />
                                            // </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                            <div className="comment-area mt-3">
                                <div className="d-flex justify-content-between align-items-center flex-wrap">
                                    <div className="like-block position-relative d-flex align-items-center">
                                        <div className="d-flex align-items-center">
                                            <div className="like-data" onClick={() => handleAddLike(userID, post.id)}>
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
                                                        <a className="me-2" href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Sade"><img src="./src/assets/images/icon/06.png" className="img-fluid" alt="" /></a>
                                                        <a className="me-2" href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Lovely"><img src="./src/assets/images/icon/07.png" className="img-fluid" alt="" /></a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="total-like-block ms-2 me-3">
                                                <div className="dropdown">
                                                    <span className="dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                                                        {post.likes.length} Likes
                                                    </span>
                                                    <div className="dropdown-menu">
                                                        {post.likes
                                                            .filter((like, index, self) =>
                                                                index === self.findIndex((l) => l.username_like === like.username_like)
                                                            )
                                                            .map((like, index) => (
                                                                <a className="dropdown-item" href="#" key={index}>{like.username_like}</a>
                                                            ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="total-comment-block">
                                            <div className="dropdown">
                                                <span className="dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                                                    {post.comments.length} Comment
                                                </span>
                                                <div className="dropdown-menu">
                                                    {post.comments
                                                        .filter((comment, index, self) =>
                                                            index === self.findIndex((cmt) => cmt.username_comment === comment.username_comment)
                                                        )
                                                        .map((comment, index) => (
                                                            <a className="dropdown-item" href="#" key={index}>{comment.username_comment}</a>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="share-block d-flex align-items-center feather-icon mt-2 mt-md-0">
                                        <a href="javascript:void();" data-bs-toggle="offcanvas" data-bs-target="#share-btn" aria-controls="share-btn"><i className="ri-share-line"></i>
                                            <span className="ms-1">{post.share} Share</span></a>
                                    </div>
                                </div>
                                <hr />
                                <ul className="post-comments list-inline p-0 m-0">
                                    {post.comments.map((comment) => (
                                        <li className="mb-2">
                                            <div className="d-flex">
                                                <div className="user-img">
                                                    <img src={`https://localhost:7174/${comment.avatar_comment}`} alt="userimg" className="avatar-35 rounded-circle img-fluid" />
                                                </div>
                                                <div className="comment-data-block ms-3">
                                                    <h6>{comment.username_comment}</h6>
                                                    <p className="mb-0">{comment.content}</p>
                                                    <div className="d-flex flex-wrap align-items-center comment-activity">
                                                        <a href="javascript:void();">like</a>
                                                        <a href="javascript:void();">reply</a>
                                                        <a href="javascript:void();">translate</a>
                                                        <span>{formatDate(comment.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <form className="comment-text d-flex align-items-center mt-3" onSubmit={(e) => handleSubmitComment(e, post.id)}>
                                    <input
                                        type="text"
                                        className="form-control rounded"
                                        placeholder="Enter Your Comment"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                    <div className="comment-attagement d-flex">
                                        <button style={{ border: "none" }} type="submit" aria-label="Send">
                                            <i class="fa fa-paper-plane" aria-hidden="true"></i>
                                        </button>
                                        <label><input type="file" onChange={handleChangeImage} hidden multiple /><i className="ri-camera-line me-3"></i></label>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function Post2() {
    return (
        <div className="col-sm-12">
            <div className="card card-block card-stretch card-height">
                <div className="card-body">
                    <div className="post-item">
                        <div className="d-flex justify-content-between">
                            <div className="me-3">
                                <img className="rounded-circle img-fluid avatar-60" src="./src/assets/images/user/1.jpg" alt="" />
                            </div>
                            <div className="w-100">
                                <div className="d-flex justify-content-between">
                                    <div className="">
                                        <h5 className="mb-0 d-inline-block">Bni Cyst</h5>
                                        <p className="ms-1 mb-0 d-inline-block">Changed Profile Picture</p>
                                        <p className="mb-0">3 day ago</p>
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
                                                        <i className="ri-close-circle-line h4"></i>
                                                        <div className="data ms-2">
                                                            <h6>Hide Post</h6>
                                                            <p className="mb-0">See fewer posts like this.</p>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a className="dropdown-item p-3" href="#">
                                                    <div className="d-flex align-items-top">
                                                        <i className="ri-user-unfollow-line h4"></i>
                                                        <div className="data ms-2">
                                                            <h6>Unfollow User</h6>
                                                            <p className="mb-0">Stop seeing posts but stay friends.</p>
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
                    <div className="user-post text-center">
                        <a href="javascript:void();"><img src="./src/assets/images/page-img/p5.jpg" alt="post-image" className="img-fluid rounded w-100 mt-3" /></a>
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
                                <a href="javascript:void();" data-bs-toggle="offcanvas" data-bs-target="#share-btn" aria-controls="share-btn"><i className="ri-share-line"></i>
                                    <span className="ms-1">99 Share</span></a>
                            </div>
                        </div>
                        <hr />
                        <ul className="post-comments list-inline p-0 m-0">
                            <li className="mb-2">
                                <div className="d-flex">
                                    <div className="user-img">
                                        <img src="./src/assets/images/user/02.jpg" alt="userimg" className="avatar-35 rounded-circle img-fluid" />
                                    </div>
                                    <div className="comment-data-block ms-3">
                                        <h6>Monty Carlo</h6>
                                        <p className="mb-0">Lorem ipsum dolor sit amet</p>
                                        <div className="d-flex flex-wrap align-items-center comment-activity">
                                            <a href="javascript:void();">like</a>
                                            <a href="javascript:void();">reply</a>
                                            <a href="javascript:void();">translate</a>
                                            <span> 5 min </span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="d-flex">
                                    <div className="user-img">
                                        <img src="./src/assets/images/user/03.jpg" alt="userimg" className="avatar-35 rounded-circle img-fluid" />
                                    </div>
                                    <div className="comment-data-block ms-3">
                                        <h6>Paul Molive</h6>
                                        <p className="mb-0">Lorem ipsum dolor sit amet</p>
                                        <div className="d-flex flex-wrap align-items-center comment-activity">
                                            <a href="javascript:void();">like</a>
                                            <a href="javascript:void();">reply</a>
                                            <a href="javascript:void();">translate</a>
                                            <span> 5 min </span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <form className="comment-text d-flex align-items-center mt-3" action="javascript:void(0);">
                            <input type="text" className="form-control rounded" placeholder="Enter Your Comment" />
                            <div className="comment-attagement d-flex">
                                <a href="javascript:void();"><i className="ri-link me-3"></i></a>
                                <a href="javascript:void();"><i className="ri-user-smile-line me-3"></i></a>
                                <a href="javascript:void();"><i className="ri-camera-line me-3"></i></a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Stories() {
    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between">
                <div className="header-title">
                    <h4 className="card-title">Stories</h4>
                </div>
            </div>
            <div className="card-body">
                <ul className="media-story list-inline m-0 p-0">
                    <li className="d-flex mb-3 align-items-center">
                        <i className="ri-add-line"></i>
                        <div className="stories-data ms-3">
                            <h5>Creat Your Story</h5>
                            <p className="mb-0">time to story</p>
                        </div>
                    </li>
                    <li className="d-flex mb-3 align-items-center active">
                        <img src="./src/assets/images/page-img/s2.jpg" alt="story-img" className="rounded-circle img-fluid" />
                        <div className="stories-data ms-3">
                            <h5>Anna Mull</h5>
                            <p className="mb-0">1 hour ago</p>
                        </div>
                    </li>
                    <li className="d-flex mb-3 align-items-center">
                        <img src="./src/assets/images/page-img/s3.jpg" alt="story-img" className="rounded-circle img-fluid" />
                        <div className="stories-data ms-3">
                            <h5>Ira Membrit</h5>
                            <p className="mb-0">4 hour ago</p>
                        </div>
                    </li>
                    <li className="d-flex align-items-center">
                        <img src="./src/assets/images/page-img/s1.jpg" alt="story-img" className="rounded-circle img-fluid" />
                        <div className="stories-data ms-3">
                            <h5>Bob Frapples</h5>
                            <p className="mb-0">9 hour ago</p>
                        </div>
                    </li>
                </ul>
                <a href="#" className="btn btn-primary d-block mt-3">See All</a>
            </div>
        </div>
    );
}

function Events() {
    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between">
                <div className="header-title">
                    <h4 className="card-title">Events</h4>
                </div>
                <div className="card-header-toolbar d-flex align-items-center">
                    <div className="dropdown">
                        <div className="dropdown-toggle" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" role="button">
                            <i className="ri-more-fill h4"></i>
                        </div>
                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton" style={{}}>
                            <a className="dropdown-item" href="#"><i className="ri-eye-fill me-2"></i>View</a>
                            <a className="dropdown-item" href="#"><i className="ri-delete-bin-6-fill me-2"></i>Delete</a>
                            <a className="dropdown-item" href="#"><i className="ri-pencil-fill me-2"></i>Edit</a>
                            <a className="dropdown-item" href="#"><i className="ri-printer-fill me-2"></i>Print</a>
                            <a className="dropdown-item" href="#"><i className="ri-file-download-fill me-2"></i>Download</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <ul className="media-story list-inline m-0 p-0">
                    <li className="d-flex mb-4 align-items-center">
                        <img src="./src/assets/images/page-img/s4.jpg" alt="story-img" className="rounded-circle img-fluid" />
                        <div className="stories-data ms-3">
                            <h5>Web Workshop</h5>
                            <p className="mb-0">1 hour ago</p>
                        </div>
                    </li>
                    <li className="d-flex align-items-center">
                        <img src="./src/assets/images/page-img/s5.jpg" alt="story-img" className="rounded-circle img-fluid" />
                        <div className="stories-data ms-3">
                            <h5>Fun Events and Festivals</h5>
                            <p className="mb-0">1 hour ago</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

function SuggestPage() {
    return (
        <div className="card-body">
            <ul className="suggested-page-story m-0 p-0 list-inline">
                <li className="mb-3">
                    <div className="d-flex align-items-center mb-3">
                        <img src="./src/assets/images/page-img/42.png" alt="story-img" className="rounded-circle img-fluid avatar-50" />
                        <div className="stories-data ms-3">
                            <h5>Iqonic Studio</h5>
                            <p className="mb-0">Lorem Ipsum</p>
                        </div>
                    </div>
                    <img src="./src/assets/images/small/img-1.jpg" className="img-fluid rounded" alt="Responsive image" />
                    <div className="mt-3"><a href="#" className="btn d-block"><i className="ri-thumb-up-line me-2"></i> Like Page</a></div>
                </li>
                <li className="">
                    <div className="d-flex align-items-center mb-3">
                        <img src="./src/assets/images/page-img/42.png" alt="story-img" className="rounded-circle img-fluid avatar-50" />
                        <div className="stories-data ms-3">
                            <h5>Cakes & Bakes </h5>
                            <p className="mb-0">Lorem Ipsum</p>
                        </div>
                    </div>
                    <img src="./src/assets/images/small/img-2.jpg" className="img-fluid rounded" alt="Responsive image" />
                    <div className="mt-3"><a href="#" className="btn d-block"><i className="ri-thumb-up-line me-2"></i> Like Page</a></div>
                </li>
            </ul>
        </div>
    );
}