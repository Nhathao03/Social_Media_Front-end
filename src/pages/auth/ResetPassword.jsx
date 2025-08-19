import { useState } from "react";
import { resetPassword } from "../../services/auth";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const location = useLocation();
    const email = location.state?.email || "";
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await resetPassword(email, newPassword, otp);
            setMessage("Password reset successful!");
            setTimeout(() => navigate("/login"), 1000);
        } catch (error) {
            setMessage("Password reset failed.");
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
                            <h1 className="mb-0">Reset password</h1>
                            <form className="mt-4" onSubmit={handleResetPassword}>
                                <div className="form-group">
                                    <label className="form-label">OTP</label>
                                    <input
                                        type="number"
                                        className="form-control mb-0"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control mb-0"
                                        placeholder="Enter New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="d-inline-block w-100">
                                    <button type="submit" className="btn btn-primary float-end">Confirm</button>
                                </div>
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

export default ResetPassword;
