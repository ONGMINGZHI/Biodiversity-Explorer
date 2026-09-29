import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        try {
            const result = await loginUser({
                email,
                password
            });

            localStorage.setItem("token", result.token);
            localStorage.setItem(
                "user",
                JSON.stringify(result.user)
            );

            navigate("/");

        } catch (error) {
            setError(error.message || "Login failed");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">

                <h2>Login</h2>

                {error && (
                    <p className="login-error">
                        {error}
                    </p>
                )}

                <form onSubmit={handleLogin}>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit">
                        Login
                    </button>

                </form>

                <p className="register-login">
                    Don't have an account?{" "}

                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </button>
                </p>

            </div>
        </div>
    );
}

export default Login;
