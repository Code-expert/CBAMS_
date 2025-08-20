export const sellerOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "SELLER") {
        return res.status(403).json({ message: "Access denied. Sellers only." });
    }
    next();
};
