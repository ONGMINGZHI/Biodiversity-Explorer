import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/api";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            const result = await registerUser({
                name,
                email,
                password
            });

            setSuccess(
                result.message || "Registration successful!"
            );

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            setError(error.message || "Registration failed");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">

                <h2>Register</h2>

                {error && (
                    <p className="login-error">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="register-success">
                        {success}
                    </p>
                )}

                <form onSubmit={handleRegister}>

                    <div className="form-group">
                        <label>Name</label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            minLength="6"
                            required
                        />
                    </div>

                    <button type="submit">
                        Register
                    </button>

                </form>

                <p className="register-login">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </p>

            </div>
        </div>
    );
}

export default Register;
