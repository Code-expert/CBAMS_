export const farmerOnly = (req, res, next) => {
    console.log("FarmerOnly Middleware Invoked", req.user);
    const userRole = req.user?.role?.toUpperCase();
    if(userRole !== "FARMER") {
        return res.status(403).json({ message: "Access denied. Farmers only." });
    }
    next(); 
}