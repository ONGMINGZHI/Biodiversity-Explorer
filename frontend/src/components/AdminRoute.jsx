import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    // retrieve token from local storage
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token) {
        return <Navigate to="/login" replace />;
        // redirect user to login
        // replace will replace the current history entry
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        if (payload.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return <Navigate to="/login" replace />;
        }
    } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== "admin") {
        return <Navigate to="/taxonomy" replace />;
    }

    return children;
}

export default AdminRoute;
