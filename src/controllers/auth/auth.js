import {Customer,DeliveryPartner} from '../../models/index.js' ;
import jwt from 'jsonwebtoken' ;

const generateTokens = (user)=>{
    const accessToken = jwt.sign(
        {userId: user._id,role:user.role},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'1d'}
    )

    const refreshToken = jwt.sign(
        {userId: user._id,role:user.role},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:'7d'}
    )
    return {accessToken,refreshToken}
};

export const loginCustomer = async (req,reply)=>{
    try{
        const {phone} = req.body ;
        let customer = await Customer.findOne({phone});
        
        if(!customer){
            customer = new Customer({
              phone,
              role:"Customer",
              isActivated: true
            })
            await customer.save();
        }

        const {accessToken,refplyhToken} = generateTokens(Customer);

        return reply.send({
            message: "Login Successful",
            accessToken,
            refreshToken,
            customer,
        })

    }catch(error){
        return reply.status(500).send({ message: "An error Occured.", error});
    }
}

export const loginDeliveryPartner = async (req,reply)=>{
    try{
        const { email, password } = req.body ;
        const deliveyPartner = await DeliveryPartner.findOne({ email });

        if(!deliveyPartner){
            return reply.status(404).send({ message: "Delivery Partner not Found." });
        }
        const isMatch = password === deliveyPartner.password ;

        if(!isMatch){
            return reply.status(400).send({ message: "Invalid Credentials." });
        }

        const { accessToken, refreshToken } = generateTokens(deliveyPartner);

        return reply.send({
             message: "Login Successful",
            accessToken,
            refreshToken,
            deliveyPartner,
        });
    }catch(error){
        return reply.status(500).send({ message: "An error Occured.", error});
    }
};

export const refreshToken = async(req,reply)=>{
    const {refreshToken} = req.body ;

    if(!refreshToken){
        return reply.status(401).send({ message: "Refresh token required..."});
    }

    try{
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        let user ;

         if(decoded.role === "Customer"){
            user = await Customer.findById(decoded.userId);
         }else if(decoded.role === "DeliveryPartner"){
            user = await Customer.findById(decoded.userId);
         }else{
            return reply.status(403).send({ message: "Invalid Role..." });
         }

         if(!user){
            return reply.status(403).send({ message: "User not found.."});
         }

         const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

         return reply.send({
            message: "Token Refreshed,,..",
            accessToken,
            refreshToken: newRefreshToken,
         });

    }catch(err){
        return reply.status(403).send({ message: "Invalid Refresh Token.."});
    }
}


export const fetchUser = async(req,reply)=>{
    try{
        const { userId,role } = req.user ;
        let user;

        if(role=="Customer") {
            user = await Customer.findById(userId);
        }else if(role=="DeliveryPartner"){
            user = await DeliveryPartner.findById(userId);
        }else{
            return reply.status(403).send({ message: "Invalid role..." });
        }

        if(!user){
            return reply.status(404).send({ message: "User not Found...." });
        }

        return reply.send({
            message: "User fetched Successfully....." ,
            user,
        });
    }catch(err){
        return reply.status(500).send({ message: "An error occured...." , err});
    }
}