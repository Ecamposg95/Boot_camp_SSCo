const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) return res.status(403).json({ message: "Acceso denegado" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token inválido" });
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };
