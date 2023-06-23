const jwt = require("jsonwebtoken");

const auth = (req, resp, next) => {
    //console.log(req);
    const token = req.query['auth-token'];
    //console.log(token);

    try {
        const data = jwt.verify(token, "thisismytokenverificatinkey");
        // console.log(data);
        req.uid = data._id;
        next();
    } catch (error) {
        resp.send("Invaild credentials");
    }
}
module.exports = auth;



