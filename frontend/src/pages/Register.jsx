import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../utils/api";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setMessage("");

        try {
            const result = await registerUser({
                name,
                email,
                password
            });

            setMessage(
                result.message || "Registration successful."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h1>Register</h1>

            {message && <p>{message}</p>}

            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Name</label>

                    <input
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Register
                </button>

            </form>

            <p>
                Already have an account?{" "}
                <Link to="/login">
                    Login
                </Link>
            </p>
        </div>
    );
}

export default Register;