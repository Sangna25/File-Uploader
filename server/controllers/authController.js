const bcrypt = require("bcryptjs");
const passport = require("passport");
const { prisma} = require("../lib/prisma");

const register = async (req,res) =>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const {firstName, lastName, username, photoUrl} = req.body
       const user =  await prisma.user.create({
        data :{
            firstName, lastName, username, password: hashedPassword, photoUrl
        }
       });
const { password, ...safeUser } = user;
       res.status(201).json({
        message:"Register success",
        user : safeUser
       })
    } catch (err){
        if (err.code === "P2002") {
  return res.status(409).json({
    message: "Username already exists",
  });
}
        res.status(500).json({message : "Registration Failed"})
    }
}

const authenticateLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        message: info?.message || "Invalid username or password",
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      next();
    });
  })(req, res, next);
};

const login = (req,res) =>{
    const {password, ...user} = req.user;
    res.status(200).json({
        message: "Login success", 
        user
    })
}

const logout = (req,res, next) =>{
    req.logout((err) =>{
        if(err) {
            return next(err)
        }
        if(req.session){
                req.session.destroy(() => {
                res.clearCookie("connect.sid");
                res.status(200).json({ message: "Log out success" });
            });

        } else {
            res.status(200).json({message:"Logout success"})
        }
     
    })
}
const getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Not logged in",
    });
  }

  const { password, ...user } = req.user;

  res.status(200).json({ user });
};
module.exports = {register, login, logout, authenticateLogin, getCurrentUser};
