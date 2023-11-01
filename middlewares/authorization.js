const jwt = require('jsonwebtoken');

const authorization = async (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        if (!token) { 
            res.json({ status: 401, message:"Token Not Found  " })
        }
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                res.json({ status: 401, message: "Invalid/Expired Token" }) 
            }
            req.userId = decoded.userId;
            next();
        })
    } catch (error) {
        res.json({ status: 401, message: "An error occupied while authorization" })
    }
}

module.exports = {
    authorization
}