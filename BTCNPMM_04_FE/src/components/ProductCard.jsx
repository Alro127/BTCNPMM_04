import { Card, Badge, Tooltip, Button, Tag, message } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { recordFavouriteApi } from "../util/api"; // 👈 import hàm vừa tạo

const { Meta } = Card;

const ProductCard = ({ product, isViewed = false, isFavourite = false }) => {
    const isOnSale = product.salePrice && product.salePrice < product.price;
    const [favouriteState, setFavouriteState] = useState(isFavourite);
    const [loading, setLoading] = useState(false);

    const handleToggleFavourite = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await recordFavouriteApi(product._id);
            if (res?.success) {
                setFavouriteState((prev) => !prev);
                message.success(
                    res.removed
                        ? "Đã xóa khỏi danh sách yêu thích"
                        : "Đã thêm vào danh sách yêu thích"
                );
            } else {
                message.error("Không thể cập nhật danh sách yêu thích!");
            }
        } catch (error) {
            console.error("Lỗi toggle favourite:", error);
            message.error("Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    };

    console.log("is Viewed: ", isViewed);

    return (
        <Badge.Ribbon text={isOnSale ? "SALE" : ""} color={isOnSale ? "red" : "blue"}>
            <Link to={`/product/${product._id || product.id}`}>
                <Card
                    hoverable
                    style={{
                        borderRadius: 20,
                        overflow: "hidden",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                        transition: "transform 0.25s ease",
                    }}
                    bodyStyle={{ padding: "16px" }}
                    cover={
                        <div style={{ position: "relative", height: 220, background: "#fafafa" }}>
                            <img
                                alt={product.name}
                                src={product.images[0] || "https://via.placeholder.com/300x220?text=No+Image"}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "transform 0.3s ease",
                                }}
                            />

                            {/* Đánh dấu "Đã xem" */}
                            {isViewed && (
                                <Tag
                                    color="blue"
                                    style={{
                                        position: "absolute",
                                        bottom: 8,
                                        left: 8,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        borderRadius: 6,
                                        padding: "2px 6px",
                                    }}
                                >
                                    Đã xem
                                </Tag>
                            )}

                            {/* Nút yêu thích */}
                            <Tooltip title={favouriteState ? "Bỏ yêu thích" : "Yêu thích"}>
                                <Button
                                    type="text"
                                    shape="circle"
                                    loading={loading}
                                    icon={favouriteState ? <HeartFilled style={{ color: "red" }} /> : <HeartOutlined />}
                                    onClick={handleToggleFavourite}
                                    style={{
                                        position: "absolute",
                                        top: 12,
                                        right: 12,
                                        background: "rgba(255,255,255,0.9)",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                    }}
                                />
                            </Tooltip>
                        </div>
                    }
                >
                    <Meta
                        title={<b style={{ fontSize: 16 }}>{product.name}</b>}
                        description={
                            <div>
                                {isOnSale ? (
                                    <>
                                        <span style={{ color: "#ff4d4f", fontWeight: 700, fontSize: 16, marginRight: 8 }}>
                                            {product.salePrice.toLocaleString()}₫
                                        </span>
                                        <span style={{ textDecoration: "line-through", color: "#8c8c8c", fontSize: 14 }}>
                                            {product.price.toLocaleString()}₫
                                        </span>
                                    </>
                                ) : (
                                    <span style={{ color: "#52c41a", fontWeight: 700, fontSize: 16 }}>
                                        {product.price.toLocaleString()}₫
                                    </span>
                                )}
                            </div>
                        }
                    />
                </Card>
            </Link>
        </Badge.Ribbon>
    );
};

export default ProductCard;
