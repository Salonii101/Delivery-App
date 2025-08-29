import AdminJS from "adminjs";
import AdminJSFastify from "@adminjs/fastify";
import AdminJSMongoose from "@adminjs/mongoose";
import * as AdminJSMongoose from "@adminjs/mongoose";
import * as Models from "../models/index.js";
import { authenticate, COOKIE_PASSWORD, sessionStore } from "./config.js";
import { dark, light, noSidebar } from "@adminjs/themes";

AdminJS.registerAdapter(AdminJSMongoose);

export const adminJs = new AdminJS({
    resources:[
        {
            resources: Models.Customer,
            options: {
                listProperties: ["phone", "role", "isActivated"],
                filterProperties: ["phone", "role"],
            },
        },
        {
            resources: Models.DeliveryPartner,
            options: {
                listProperties: ["email", "role", "isActivated"],
                filterProperties: ["email", "role"],
            },
        },
        {
            resources: Models.Admin,
            options: {
                listProperties: ["email", "role", "isActivated"],
                filterProperties: ["email", "role"],
            },
        },
        { resources: Models.Branch },
        { resources: Models.Product },
        { resources: Models.Category },
        { resources: Models.Order },
        { resources: Models.Counter }
    ],

    branding: {
        companyName: "Delivery App Admin",
        withMadeWithLove: false,
    },
    defaultTheme: dark.id,
    rootPath: "/admin",
});


export const buildAdminRouter = async (fastify)=>{
    await AdminJSFastify.buildAuthenticatedRouter(
        admin,
        {
            authenticate,
            cookiePassword: COOKIE_PASSWORD,
            cookieName: "adminjs",
        },
        app,
        {
            store: sessionStore,
            saveUnintialized: true,
            secret: COOKIE_PASSWORD,
            cookie: {
                httpOnly: process.env.NODE_ENV === "production",
                secure: process.env.NODE_ENV === "production",
               // maxAge: 1000 * 60 * 60 * 24, // 1 day
            },
        }
    )
}
