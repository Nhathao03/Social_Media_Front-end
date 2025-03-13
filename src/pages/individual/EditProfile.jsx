import Header from "../../layout/Header";
import LeftSidebar from "../../layout/LeftSidebar";
import RightSidebar from "../../layout/RightSidebar";
import Footer from "../../layout/Footer";
import { useEffect, useState } from "react";
import { getUserById } from "../../services/user";
import { getAllAddress } from "../../services/address";
import { UploadAvatarUser } from "../../services/uploadfile";

export default function EditProfile() {
    const [userData, setuserData] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storeUserID = localStorage.getItem("token");
                if (!storeUserID) {
                    console.error("No user ID found in localStorage");
                    return;
                }
                const response = await getUserById(storeUserID);
                setuserData(response.data);
            } catch (err) {
                console.error("Failed to fetch user");
            }
        }
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
                        <div class="col-lg-12">
                            <Menu />
                        </div>
                        <div class="col-lg-12">
                            <div class="iq-edit-list-data">
                                <div className="tab-content">
                                    <ContentTab userData={userData} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

const Menu = () => {
    return (
        <div class="card">
            <div class="card-body p-0">
                <div class="iq-edit-list">
                    <ul class="iq-edit-profile row nav nav-pills">
                        <li class="col-md-3 p-0">
                            <a class="nav-link active" data-bs-toggle="pill" href="#personal-information">
                                Personal Information
                            </a>
                        </li>
                        <li class="col-md-3 p-0">
                            <a class="nav-link" data-bs-toggle="pill" href="#chang-pwd">
                                Change Password
                            </a>
                        </li>
                        <li class="col-md-3 p-0">
                            <a class="nav-link" data-bs-toggle="pill" href="#emailandsms">
                                Email and SMS
                            </a>
                        </li>
                        <li class="col-md-3 p-0">
                            <a class="nav-link" data-bs-toggle="pill" href="#manage-contact">
                                Manage Contact
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
const ContentTab = ({ userData }) => {
    return (
        <>
            <PersonalInformationTab userData={userData} />
            <ChangePasswordTab userData={userData} />
            <EmailandSMSTab userData={userData} />
            <ManageContactTab userData={userData} />
        </>
    );
}

const PersonalInformationTab = ({ userData }) => {
    const [addressData, setAddressData] = useState([]);
    const [birth, setBirth] = useState();
    const [username, setUsername] = useState();
    const [gender, setGender] = useState();
    const [avatar, setAvatar] = useState([null]);


    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await getAllAddress();
                setAddressData(response.data);
            } catch (err) {
                console.error("Failed to fetch address");
            }
        }
        fetchAddress();
    }, []);

    //format date
    const formatDate = (dateString) => {
        return new Date(dateString).toISOString().split("T")[0];
    };

    //Check image if have change
    const handleChangeImage = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const uploadedUrls = await Promise.all(files.map(async (file) => {
                return await UploadAvatarUser(file);
            }));
            const ListUrl = uploadedUrls.map((url) => {
                return {
                    Url: url.data
                }
            });
            setAvatar(ListUrl);
        }
    };

    const handleSubmit = async () => {

    }

    return (
        <div className="tab-pane fade active show" id="personal-information" role="tabpanel">

            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <div className="header-title">
                        <h4 className="card-title">Personal Information</h4>
                    </div>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group row align-items-center">
                            <div className="col-md-12">
                                <div className="profile-img-edit">
                                    <img
                                        className="profile-pic"
                                        src="https://localhost:7174/user/avatar/avatar.png"
                                        alt="profile-pic"
                                    />
                                    <div className="p-image">
                                        <i className="ri-pencil-line upload-button text-white"></i>
                                        <input className="file-upload" type="file" onChange={handleChangeImage} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {userData ? (
                            <div className="row align-items-center" key={userData.id}>
                                <div className="form-group col-sm-6">
                                    <label htmlFor="uname" className="form-label">
                                        User Name:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="uname"
                                        placeholder={userData.fullname}
                                    />
                                </div>
                                <div className="form-group col-sm-6">
                                    <label className="form-label">City:</label>
                                    <select
                                        className="form-select"
                                        aria-label="Default select example 3"
                                        defaultValue="ho-chi-minh"
                                    >
                                        {addressData.map((address) =>
                                            <option key={address.id} value={address.slug}>{address.name}</option>
                                        )}
                                    </select>
                                </div>
                                <div className="form-group col-sm-6">
                                    <label className="form-label d-block">Gender:</label>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="inlineRadioOptions"
                                            id="inlineRadio10"
                                            value="option1"
                                        />
                                        <label className="form-check-label" htmlFor="inlineRadio10">
                                            Male
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="inlineRadioOptions"
                                            id="inlineRadio11"
                                            value="option1"
                                        />
                                        <label className="form-check-label" htmlFor="inlineRadio11">
                                            Female
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group col-sm-6">
                                    <label htmlFor="dob" className="form-label">
                                        Date Of Birth:
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="dob"
                                        value={userData.birth ? formatDate(userData.birth) : ""}
                                        onChange={(e) => setBirth(e.target.value)}
                                    />
                                </div>
                                <div className="form-group col-sm-6">
                                    <label className="form-label">Marital Status:</label>
                                    <select
                                        className="form-select"
                                        aria-label="Default select example"
                                        defaultValue="Single"
                                    >
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Widowed">Widowed</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Separated">Separated</option>
                                    </select>
                                </div>
                                <div className="form-group col-sm-6">
                                    <label className="form-label">Country:</label>
                                    <select
                                        className="form-select"
                                        aria-label="Default select example 3"
                                        defaultValue="USA"
                                    >
                                        <option value="Caneda">Caneda</option>
                                        <option value="Noida">Noida</option>
                                        <option value="USA">USA</option>
                                        <option value="India">India</option>
                                        <option value="Africa">Africa</option>
                                    </select>
                                </div>
                                <div className="form-group col-sm-12">
                                    <label className="form-label">Address:</label>
                                    <input
                                        className="form-control"
                                        name="address"
                                        rows="5"
                                        style={{ lineHeight: '22px' }}
                                    />
                                </div>
                            </div>
                        ) : null}
                        <button type="submit" className="btn btn-primary me-2">
                            Submit
                        </button>
                        <button type="reset" className="btn bg-soft-danger">
                            Cancel
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
}

const ChangePasswordTab = () => {
    return (
        < div className="tab-pane fade" id="chang-pwd" role="tabpanel" >
            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <div className="iq-header-title">
                        <h4 className="card-title">Change Password</h4>
                    </div>
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-group">
                            <label htmlFor="cpass" className="form-label">
                                Current Password:
                            </label>
                            <a href="#" className="float-end">
                                Forgot Password
                            </a>
                            <input
                                type="password"
                                className="form-control"
                                id="cpass"
                                defaultValue=""
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="npass" className="form-label">
                                New Password:
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="npass"
                                defaultValue=""
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="vpass" className="form-label">
                                Verify Password:
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="vpass"
                                defaultValue=""
                            />
                        </div>
                        <button type="submit" className="btn btn-primary me-2">
                            Submit
                        </button>
                        <button type="reset" className="btn bg-soft-danger">
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div >
    );
}

const EmailandSMSTab = () => {
    return (
        <div className="tab-pane fade" id="emailandsms" role="tabpanel">
            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <div className="header-title">
                        <h4 className="card-title">Email and SMS</h4>
                    </div>
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-group row align-items-center">
                            <label className="col-md-3" htmlFor="emailnotification">
                                Email Notification:
                            </label>
                            <div className="col-md-9 form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="flexSwitchCheckChecked11"
                                    defaultChecked
                                />
                                <label className="form-check-label" htmlFor="flexSwitchCheckChecked11">
                                    Checked switch checkbox input
                                </label>
                            </div>
                        </div>
                        <div className="form-group row align-items-center">
                            <label className="col-md-3" htmlFor="smsnotification">
                                SMS Notification:
                            </label>
                            <div className="col-md-9 form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="flexSwitchCheckChecked12"
                                    defaultChecked
                                />
                                <label className="form-check-label" htmlFor="flexSwitchCheckChecked12">
                                    Checked switch checkbox input
                                </label>
                            </div>
                        </div>
                        <div className="form-group row align-items-center">
                            <label className="col-md-3" htmlFor="npass">
                                When To Email
                            </label>
                            <div className="col-md-9">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="flexCheckDefault12"
                                    />
                                    <label className="form-check-label" htmlFor="flexCheckDefault12">
                                        You have new notifications.
                                    </label>
                                </div>
                                <div className="form-check d-block">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="email02"
                                    />
                                    <label className="form-check-label" htmlFor="email02">
                                        You're sent a direct message
                                    </label>
                                </div>
                                <div className="form-check d-block">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="email03"
                                        defaultChecked
                                    />
                                    <label className="form-check-label" htmlFor="email03">
                                        Someone adds you as a connection
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row align-items-center">
                            <label className="col-md-3" htmlFor="npass">
                                When To Escalate Emails
                            </label>
                            <div className="col-md-9">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="email04"
                                    />
                                    <label className="form-check-label" htmlFor="email04">
                                        Upon new order.
                                    </label>
                                </div>
                                <div className="form-check d-block">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="email05"
                                    />
                                    <label className="form-check-label" htmlFor="email05">
                                        New membership approval
                                    </label>
                                </div>
                                <div className="form-check d-block">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="email06"
                                        defaultChecked
                                    />
                                    <label className="form-check-label" htmlFor="email06">
                                        Member registration
                                    </label>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary me-2">
                            Submit
                        </button>
                        <button type="reset" className="btn bg-soft-danger">
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const ManageContactTab = () => {
    return (
        <div className="tab-pane fade" id="manage-contact" role="tabpanel">
            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <div className="header-title">
                        <h4 className="card-title">Manage Contact</h4>
                    </div>
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-group">
                            <label htmlFor="cno" className="form-label">
                                Contact Number:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="cno"
                                defaultValue="001 2536 123 458"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="email"
                                defaultValue="Bnijone@demo.com"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="url" className="form-label">
                                Url:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="url"
                                defaultValue="https://getbootstrap.com"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary me-2">
                            Submit
                        </button>
                        <button type="reset" className="btn bg-soft-danger">
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}