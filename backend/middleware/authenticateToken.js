const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next){
    const authHeader = req.headers["authorization"];
    // console.log(req.headers);

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }
    jwt.verify(token, process.env.JWT_SECRET || "secretkey", (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token" });
    }
        req.user = user; // Attach decoded user { id, role } to request
        next();
    });
}
module.exports = authenticateToken;