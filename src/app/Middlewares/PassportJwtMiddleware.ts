import passport from "passport";
import passportJWT from "passport-jwt";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

import {AppDataSource} from "../../config/database";
import { User } from '../Models/User';

const userRepository = AppDataSource.getRepository(User);


const jwtOptions: passportJWT.StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY||'',
};

passport.use(new JWTStrategy(jwtOptions,async (jwtPayload, done) => {
    try{
        const user = await userRepository.findOne({where: {id: jwtPayload.id}});
        if (!user) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
        return done(null, user);
    }catch(err){
        return done(err)
    }
}));

export const passportJwt = passport.authenticate('jwt', { session: false });