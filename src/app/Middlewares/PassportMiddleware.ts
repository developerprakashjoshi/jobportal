import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local'
import {AppDataSource} from "../../config/database";
import { User } from '../Models/User';

const userRepository = AppDataSource.getRepository(User);
// Configure passport
passport.use(new LocalStrategy({
    usernameField:"email",
    passwordField:"password"
},async(username, password, done) => {
    const user = await userRepository.findOne({where: {email: username}});
    if (!user) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    return done(null, user);
}));

passport.serializeUser((user:any, done) =>{
  process.nextTick(() =>{
    return done(null, user.id);
  });
});

passport.deserializeUser(async(id:number, done) =>{
  process.nextTick(async() =>{
    try{
      const user = await userRepository.findOne({where: {id: id}});
      return done(null, user); 
    }catch(err){
      return done(err)
    }
  });
});

export default passport