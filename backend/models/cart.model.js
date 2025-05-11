import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],
    },
    { timestamps: true }
);

// Calculate total before saving
cartSchema.pre("save", function (next) {
    this.total = this.items.reduce((total, item) => {
        return total + (item.product?.price || 0) * item.quantity;
    }, 0);
    next();
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart; 