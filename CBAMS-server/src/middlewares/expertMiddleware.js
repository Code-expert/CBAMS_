export const expertOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "EXPERT") {
        return res.status(403).json({ message: "Access denied. Experts only." });
    }
    next();
};