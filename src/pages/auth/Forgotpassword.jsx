import { useState } from "react";
import { forgotpassword } from "../../services/auth";
import { useNavigate } from "react-router-dom";

const Forgotpassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleForgotpassword = async (e) => {
        e.preventDefault();
        try {
            await forgotpassword(email);
            navigate("/reset-password", { state: { email} });
            setMessage("Send successful!");
        } catch (error) {
            console.error(error);
            setMessage("Send failed.");
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
                            <h1 className="mb-0">Forgot password</h1>
                            <p>Enter your email.</p>
                            <form className="mt-4" onSubmit={handleForgotpassword}>
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

                                <div className="d-inline-block w-100">
                                    <button type="submit" className="btn btn-primary float-end">Send</button>
                                </div>
                                {message && (
                                    <div className="alert alert-info mt-3">
                                        {message}
                                    </div>
                                )}
                                <div className="sign-info">
                                    <span className="dark-color d-inline-block line-height-2">
                                        Don't have an account? <a href="/register">Sign up</a>
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Forgotpassword;
