import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    try {
        var token = req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1];

        if(!token){
            token = req.query.token;
        }

        if (!token) {
            return res.status(401).json({
                message: "Provide token",
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token",
                error: true,
                success: false,
            });
        }

        req.userId = decoded.id;

        next();

    } catch (error) {
        return res.status(500).json({
            message: "You have not logged in", //error.message || error,
            error: true,
            success: false,
        });
    }
}

export default auth;