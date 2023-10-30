import passport from "passport";
import passportJWT from "passport-jwt";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

import AppDataSource from '@config/mongoose';
import User,{Certificate, Address, Education,Experience } from '@models/user.schema';
import Recruiter from '@models/recruiter.schema';
const jwtOptions: passportJWT.StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY||'',
};
passport.use(new JWTStrategy(jwtOptions,async (jwtPayload, done) => {
    try{
        if(jwtPayload.type==="candidate"){
               const user = await User.findOne({ _id: jwtPayload._id });
               if (!user) {
                    return done(null, false, { message: 'Incorrect username or password.' });
                }
                return done(null, user);
        }
        if(jwtPayload.type==="recruiter"){
            const user = await Recruiter.findOne({ _id: jwtPayload._id });
            if (!user) {
                 return done(null, false, { message: 'Incorrect username or password.' });
             }
             return done(null, user);
        }
        if(jwtPayload.type==="admin"){
             return done(null, "admin");
        }
        return done({ message: 'Authencation fail' })
    }catch(err){
		console.log("passport error")
		console.log(err)
        return done(err)
    }
}));

 const passportJwt = passport.authenticate('jwt', { session: false });
 export default passportJwt;