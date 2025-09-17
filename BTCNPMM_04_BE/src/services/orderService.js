const Order = require("../models/Order");
const { increaseProductBuyers } = require("./productService");

const completeOrder = async (orderId) => {
  const order = await Order.findById(orderId).populate("items.product");
  if (!order) return null;

  order.status = "COMPLETED";
  await order.save();

  // tăng buyers cho từng sản phẩm
  for (const item of order.items) {
    await increaseProductBuyers(item.product._id);
  }

  return order;
};

module.exports = {
  completeOrder,
};
