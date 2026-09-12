const LocalStrategy = require('passport-local').Strategy
const bcrypt = require("bcryptjs");
const { prisma} = require("../lib/prisma");

async function getUserById(id) {
    const user = await prisma.user.findUnique({
        where :{id}
    })
    return user
    
}

async function getUserByUsername(username){
    const user = await prisma.user.findUnique({
        where :{username}
    })
    return user
}
function initialize(passport){
    const authenticateUser = async(username, password, done) =>{
        try{
              const user = await getUserByUsername(username);
        if(!user){
            return done(null,false,{message:"No user with that username exists"})
        }
            if(await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else{
                return done(null, false, {message : "Incorrect password"})
            }
        } catch (err){
            done(err)
        }
    }

    passport.use(new LocalStrategy(authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await getUserById(id);
            done(null, user)
        } catch(err){
            done(err);
        }
    })
}

module.exports = initialize