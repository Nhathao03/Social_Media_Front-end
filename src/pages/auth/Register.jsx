import { useState } from "react";
import { register } from "../../services/user"; 
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birth, setBirth] = useState(""); 
    const [phoneNumber, setPhoneNumber] = useState(""); 
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await register( fullName, email, password, birth, phoneNumber );
            setMessage("Registration successful! Redirecting...");
            setTimeout(() => navigate("/login"), 2000); 
        } catch (error) {
            setMessage(error.response?.data || "Registration failed.");
        }
    };

    return (
        <section className="sign-in-page">
            <div id="container-inside">
                <div id="circle-small"></div>
                <div id="circle-medium"></div>
                <div id="circle-large"></div>
                <div id="circle-xlarge"></div>
                <div id="circle-xxlarge"></div>
            </div>
            <div className="container p-0">
                <div className="row no-gutters">
                    <div className="col-md-6 text-center pt-5">
                        <div className="sign-in-detail text-white"></div>
                    </div>
                    <div className="col-md-6 bg-white pt-5 pb-5">
                        <div className="sign-in-from">
                            <h1 className="mb-0">Sign Up</h1>
                            <p>Enter your details to create an account.</p>
                            <form className="mt-4" onSubmit={handleRegister}>
                                <div className="form-group">
                                    <label className="form-label">Your Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control mb-0"
                                        placeholder="Your Full Name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control mb-0"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control mb-0"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="form-control mb-0"
                                        value={birth}
                                        onChange={(e) => setBirth(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="text"
                                        className="form-control mb-0"
                                        placeholder="Phone Number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="d-inline-block w-100">
                                    <div className="form-check d-inline-block mt-2 pt-1">
                                        <input type="checkbox" className="form-check-input" id="terms" required />
                                        <label className="form-check-label" htmlFor="terms">I accept <a href="#">Terms and Conditions</a></label>
                                    </div>
                                    <button type="submit" className="btn btn-primary float-end">Sign Up</button>
                                </div>
                                {/* {message && <p className="mt-2 text-danger">{message}</p>} */}
                                <div className="sign-info">
                                    <span className="dark-color d-inline-block line-height-2">
                                        Already have an account? <a href="/login">Log In</a>
                                    </span>
                                    <ul className="iq-social-media">
                                        <li><a href="#"><i className="ri-facebook-box-line"></i></a></li>
                                        <li><a href="#"><i className="ri-twitter-line"></i></a></li>
                                        <li><a href="#"><i className="ri-instagram-line"></i></a></li>
                                    </ul>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
