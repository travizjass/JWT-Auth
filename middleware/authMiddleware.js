const jwt = require('jsonwebtoken');
const User = require('../models/User')

const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt;

    // check json web token exists & is verified

    if(token) {
        jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }
            else {
                console.log(decodedToken);
                next();
            }
        })
    }

    else{
        res.redirect('/login');
    }
}

// check current user
// we will apply this to every get req route.

const checkUser = (req,res,next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next(); 
            }
            else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                // now even if we have got the user how we will
                // show it as the views. So we use locals propperty
                res.locals.user = user;
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };
