import Order from "../../models/order.js";
import Branch from "../../models/branch.js";
import { Customer, DeliveryPartner } from "../../models/user.js";

export const createOrder = async (req, reply) => {
    try {
        const {userId} = req.params;
        const { items , branch , totalPrice } = req.body ;
        const customerData = await Customer.findById(userId);
        const branchData = await Branch.findById(branch);

        if(!customerData){
            return reply.status(404).json({ message: "Customer not found" });
        }

        const newOrder = new Order({
            customer: userId,
            items:items.map((item)=>({
                id: item.id,
                item:item.item,
                count:item.count
            })),
             branch,
             totalPrice,
             deliveryLocation: {
                latitude: customerData.liveLocation.latitude,
                longitude: customerData.liveLocation.longitude,
                address: customerData.address || "No adddress available.." ,
             },
                pickupLocation: {
                    latitude: branchData.location.latitude,
                    longitude: branchData.location.longitude,
                    address: branchData.address || "No adddress available..",
                },
            
        });
        const savedOrder = await newOrder.save();
        return reply.status(201).send(savedOrder);
    }catch (error) {
        console.error("Error creating order:", error);
        return reply.status(500).json({ message: "Internal server error" });
    }
}


export const confirmOrder = async (req, reply) => {
    try{
        const { orderId } = req.params;
        const { userId } = req.user;
        const { deliveryPersonLocation } = req.body;

        const deliveryPerson = await DeliveryPartner.findById(userId);
        if(!deliveryPerson){
            return reply.status(404).send({ message: "Delivery partner not found" });
        }
        const order = await Order.findById(orderId);
        if(!order){
            return reply.status(404).send({ message: "Order not found" });
        }

        if(order.status !== "available"){
            return reply.status(400).send({ message: "Order is not available..." });
        }
        order.status = "confirmed";
        order.deliveyPartner = userId;
        order.deliveryPersonLocation = {
            latitude: deliveryPersonLocation.latitude,
            longitude: deliveryPersonLocation.longitude,
            address: deliveryPersonLocation.address || "",    
        };

        //implement socket here to notify customer that delivery partner has confirmed the order in real time.
        req.server.io.to(orderId).emit("orderConfirmed",order);
       //emit is to send data to the client and listen is to receive data from the client.
        await order.save();
        return reply.status(200).send({ message: "Order confirmed successfully", order });

    }catch(err){
        return reply.status(500).send({ message: "Failed to confirm",err });
    }
}


export const updateOrderStatus = async (req, reply) => {
    try{
        const { orderId } = req.params;
        const { userId } = req.user;
        const { status, deliveryPersonLocation } = req.body;

        const deliveryPerson = await DeliveryPartner.findById(userId);
        if(!deliveryPerson){
            return reply.status(404).send({ message: "Delivery partner not found" });
        }

        const order = await Order.findById(orderId);
        if(!order){
            return reply.status(404).send({ message: "Order not found" });
        }

        if(["cancelled", "delivered"].includes(order.status)){
            return reply.status(400).send({ message: "Order cannot be updated"});
        }

        if(order.deliveyPartner.toString() !== userId){
            return reply.status(403).send({ message: "You are not authorized to update this order" });
        }

        order.status = status;
        order.deliveryLocation = deliveryPersonLocation;
        await order.save();

        //implement socket here to notify customer that delivery partner has updated the order in real time.
        req.server.io.to(orderId).emit("LiveTrackingUpdates",order);
       //emit is to send data to the client and listen is to receive data from the client.
        
        return reply.status(200).send({ message: "Order status updated successfully", order });

    }catch(err){
        return reply.status(500).send({ message: "Failed to update order status",err });
    }
}

export const getOrders = async (req, reply) => {
    try{
        const { status, customerId, deliveryPartnerId, branchId } = req.query;
        let query = {} ;

        if(status){
            query.status = status ;
        }

        if(customerId){
            query.customer = customerId ;
        }
        if(deliveryPartnerId){
            query.deliveyPartner = deliveryPartnerId;
            query.branch = branchId ;
        }

        const orders = await Order.find(query).populate(
            "customer branch item.item deliveryParetner"
        );

        return reply.send(orders);
        
    }catch(err){
        return reply.status(500).send({ message: "Failed to fetch orders", err });
    }
};

export const getOrderById = async (req, reply) => {
    try{
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate(
            "customer branch item.item deliveryParetner"
        );
        if(!order){
            return reply.status(404).send({ message: "Order not found" });
        }

        return reply.send(order);

}catch(err){
    return reply.status(500).send({ message: "Failed to fetch order", err });
}
};