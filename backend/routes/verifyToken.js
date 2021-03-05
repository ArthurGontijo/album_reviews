const jwt = require('jsonwebtoken');

module.exports = function (req, res, next){
    const token = req.header('auth-token');
    if(!token) return res.json({message: "user must be logged in"}).status(401);

    try {  
        const verified = jwt.verify(token, 'tokensecret')
        req.user = verified;
        next();
    } catch (err){
        res.status(400).json({message: err.message})
    }
}