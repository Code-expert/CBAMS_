export const expertOnly = (req, res, next) => {
    const userRole = req.user?.role?.toUpperCase();
    if (userRole !== "EXPERT") {
        return res.status(403).json({ message: "Access denied. Experts only." });
    }
    next();
};