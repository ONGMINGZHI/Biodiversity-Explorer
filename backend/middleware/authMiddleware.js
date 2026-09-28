const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            message: "Not authorized. No token provided."
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Not authorized. Invalid token."
        });
    }
};


// Admin only
const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admin only."
        });
    }

    next();
};


module.exports = {
    protect,
    adminOnly
};