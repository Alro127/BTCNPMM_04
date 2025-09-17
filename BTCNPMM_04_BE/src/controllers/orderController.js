const orderService = require("../services/orderService");

const completeOrder = async (req, res) => {
    try {
        const order = await orderService.completeOrder(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
        }
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    completeOrder,
};
