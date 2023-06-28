import jwt from "jsonwebtoken"

const authMiddleware = (req, resp, next) => {
    const token = req.query['auth-token'];
    try {
        const data = jwt.verify(token, "thisismytokenverificatinkey");
        req.uid = data._id;
        next();
    } catch (error) {
        resp.send("Invaild credentials");
    }
}
export default authMiddleware;



