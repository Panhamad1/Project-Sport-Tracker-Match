const adminOnly = (req,res,next) => {
    if(!req.user){
        return res.status(401).json({
            message: "Unauthorized. Login Required",
        });
    }
    if(req.user.role !== "admin"){
        return res.status(403).json({
            message: "Forbidden. Admin Only",
        });
    }
    next();
};
export {adminOnly};