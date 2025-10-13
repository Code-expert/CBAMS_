export const farmerOnly = (req, res, next) => {
    console.log("FarmerOnly Middleware Invoked", req.user);
    if(!req.user || req.user.role !== "FARMER") {
        return res.status(403).json({ message: "Access denied. Farmers only." });
    }
    next(); 
}