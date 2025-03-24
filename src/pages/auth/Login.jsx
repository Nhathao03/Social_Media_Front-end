import { useState } from "react";
import { login } from "../../services/auth"; 
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login(email, password);
            const { token } = response.data;
            localStorage.setItem("token",token); 
            setMessage("Login successful!");
            setTimeout(() => navigate("/home"), 1000); 
        } catch (error) {
            setMessage(error.response?.data || "Login failed.");
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
                        <div className="sign-in-detail text-white">                           
                        </div>
                    </div>
                    <div className="col-md-6 bg-white pt-5 pb-5">
                        <div className="sign-in-from">
                            <h1 className="mb-0">Sign in</h1>
                            <p>Enter your email and password to log in.</p>
                            <form className="mt-4" onSubmit={handleLogin}>
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
                                    <a href="#" className="float-end">Forgot password?</a>
                                    <input
                                        type="password"
                                        className="form-control mb-0"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="d-inline-block w-100">
                                    <div className="form-check d-inline-block mt-2 pt-1">
                                        <input type="checkbox" className="form-check-input" id="rememberMe" />
                                        <label className="form-check-label" htmlFor="rememberMe">Remember Me</label>
                                    </div>
                                    <button type="submit" className="btn btn-primary float-end">Sign in</button>
                                </div>
                                <div className="sign-info">
                                    <span className="dark-color d-inline-block line-height-2">
                                        Don't have an account? <a href="/register">Sign up</a>
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

export default Login;
