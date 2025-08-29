import mongoose from "mongoose";
import 'dotenv/config';
import { Category, Product } from "./src/models/index.js" ;
import {categories, products} from "./seedData.js";

async function seedDatabase(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        await Category.deleteMany({});
        await Product.deleteMany({});
    
        const categoryDocs = await Category.insertMany(categories);

        const categoryMap = categoryDocs.reduce((map, category) => {
            map[category.name] = category._id;
            return map;
        }, {});


        //{store products in term of id's not by their names}


        const productsWithCategoryIds = products.map(product => ({
            ...product,
            category: categoryMap[product.category]
        }));

        await Product.insertMany(productsWithCategoryIds);


        console.log("DATABASE CONNECTED SUCCESSFULLY......😎");
    }catch(err){
        console.log("Error in Seeding database: ",err);
    }finally{
        mongoose.connection.close();
    }
}

seedDatabase();

// http://localhost:3000/api/categories  to get all the categories