import 'dotenv/config';
import fastifySession from '@fastify/session';
import ConnectMongoDBSession, { MongoDBStore } from 'connect-mongodb-session';
import { Admin } from '../models/index.js' ;

export const PORT = process.env.PORT || 3000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;
export const MONGO_URI = process.env.MONGO_URI;

const MongoDBStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoDBStore({
    uri:process.env.MONGO_URI,
    collection:"sessions"
});

sessionStore.on("error", (error)=>{
    console.log("Session store error: ",error);
});

export const authenticate = async(email,password)=>{
    if(email == 'saloni@gmail.com' && password==="12345678"){
        return Promise.resolve({ email: email, password: password });   
    }else{
        return null ;
    }

// uncomment below code after u created admin first time mannually
    // if(email && password){
    //     const admin = await Admin.findOne({email});
    //     if(!user){
    //          return false;
    //     }
    //     if(user.password === password){
    //         return Promise.resolve({ email: email, password: password });
    //     }else{
    //         return null ;
    //     }
    //}

    return null ;
}