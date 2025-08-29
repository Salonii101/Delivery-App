import Product from '../../models/products.js'; // Adjust path as needed

// Controller to get products by category ID
export const getProductByCategoryId = async (req, reply) => {
    try {
        const { categoryId } = req.params;
        if (!categoryId) {
            return reply.status(400).json({ message: 'Category ID is required.' });
        }

        const products = await Product.find({ category: categoryId })
        .select("-category")
        .exec();

        return reply.status(200).send(products);
    } catch (error) {
        reply.status(500).send({ message: 'Server error.', error: error.message });
    }
};
