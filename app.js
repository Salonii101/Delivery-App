import 'dotenv/config';
import { connectDB } from './src/config/connect.js';
import fastify from 'fastify';
import { PORT } from './src/config/config.js';
import { registerRoutes } from './src/routes/index.js';
import fastifySocketIO from 'fastify-socket.io';

const start = async()=>{
    await connectDB(process.env.MONGO_URI);
    const app = fastify();

    app.register(fastifySocketIO, {
        cors: {
            origin: "*",
        },
        pingInterval: 10000,
        pingTimeout: 5000,
        transports: ['websocket']
    })

    await registerRoutes(app);


    app.listen({port:PORT,host:'0.0.0.0'},(err,addr)=>{
        if(err){
            console.log(err);
        }else{
            console.log(`Delivery App running on http://localhost:${PORT}`);
        }
    })

    app.ready().then(()=>{
        app.io.on("connection",(socket)=>{
            console.log("New client connected ✅ ",socket.id);

            socket.on("joinRoom",(orderId)=>{
                socket.join(orderId);
                console.log(`🔴 User Joined room ${orderId}`);
            });


            socket.on("disconnect",()=>{
                console.log("Client disconnected ❌ ",);
            });
        });
    });
}


start();

