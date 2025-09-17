import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Spin, Button, Divider, Typography, message, Card } from "antd";
import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from "@ant-design/icons";
import { getCommentCountApi, getProductByIdApi, getRelatedProductsApi, increaseViewApi, getCommentsByProductApi, createCommentApi, recordRecentViewApi } from "../util/api"; // 👈 thêm getProductsApi
import ProductImages from "../components/ProductImages";
import ProductStats from "../components/ProductStats";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";

const { Title, Paragraph, Text } = Typography;

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [commentCount, setCommentCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    // comment state
    const [comments, setComments] = useState([]);

    // sản phẩm tương tự
    const [similarProducts, setSimilarProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await getProductByIdApi(id);
                if (res?.success || res?.product || res?.data) {
                    const data = res.data || res.product;
                    setProduct(data);

                    await increaseViewApi(id);
                    await recordRecentViewApi(id);

                    // fetch sản phẩm tương tự theo category
                    const relatedRes = await getRelatedProductsApi(
                        id,
                        4
                    );
                    if (relatedRes.success)
                        setSimilarProducts(relatedRes.relatedProducts || []);
                }
            } catch (err) {
                console.error("Lỗi load chi tiết sản phẩm:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await getCommentsByProductApi(id);
                if (res?.success) {
                    setComments(res.comments || []);
                }
                console.log("Bình luận:", res.comments);
            } catch (err) {
                console.error("Lỗi load bình luận:", err);
            }
        };
        fetchComments();
    }, [id]);

    useEffect(() => {
        const fetchCommentCount = async () => {
            try {
                const res = await getCommentCountApi(id);
                if (res?.success) {
                    setCommentCount(res.comments);
                    console.log("Số lượng bình luận:", res.comments);
                }
            } catch (err) {
                console.error("Lỗi load số lượng bình luận:", err);
            }
        };
        fetchCommentCount();
    }, [id]);

    const handleAddComment = async (content) => {
        try {
            // Lấy token từ localStorage (hoặc Redux)
            const token = localStorage.getItem("access_token");
            if (!token) {
                message.error("Bạn cần đăng nhập để bình luận!");
                return;
            }

            // Gọi API tạo comment
            const res = await createCommentApi(product._id, content);

            if (res?.success) {
                // Thêm comment mới vào state để hiển thị ngay
                const newComment = res.comment; // backend trả về comment vừa tạo
                setComments((prev) => [newComment, ...prev]);

                message.success("Đã thêm bình luận!");
            } else {
                message.error(res?.data?.message || "Không thể thêm bình luận.");
            }
        } catch (err) {
            console.error("Lỗi tạo comment:", err);
            message.error(err.response?.data?.message || "Lỗi server khi thêm bình luận.");
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
                <Spin size="large" tip="Đang tải sản phẩm..." />
            </div>
        );
    }

    if (!product) {
        return <h2 style={{ textAlign: "center" }}>❌ Không tìm thấy sản phẩm</h2>;
    }

    return (
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: 30 }}>
            <Row gutter={30}>
                {/* Cột trái: chi tiết sản phẩm */}
                <Col xs={24} md={16}>
                    <Row gutter={40}>
                        <Col xs={24} md={10}>
                            <ProductImages images={product.images} mainImage={product.images[0]} />
                        </Col>
                        <Col xs={24} md={14}>
                            <Title level={2}>{product.name}</Title>

                            <div style={{ margin: "10px 0" }}>
                                {product.salePrice ? (
                                    <>
                                        <span style={{ color: "#ff4d4f", fontWeight: 700, fontSize: 20, marginRight: 8 }}>
                                            {product.salePrice.toLocaleString()}₫
                                        </span>
                                        <span style={{ textDecoration: "line-through", color: "#8c8c8c", fontSize: 16 }}>
                                            {product.price.toLocaleString()}₫
                                        </span>
                                    </>
                                ) : (
                                    <span style={{ color: "#52c41a", fontWeight: 700, fontSize: 20 }}>
                                        {product.price.toLocaleString()}₫
                                    </span>
                                )}
                            </div>

                            <Paragraph style={{ fontSize: 16 }}>{product.description}</Paragraph>
                            <ProductStats stats={product.stats} commentCount={commentCount} />

                            <Divider />

                            <div style={{ display: "flex", gap: 12 }}>
                                <Button
                                    type="primary"
                                    icon={<ShoppingCartOutlined />}
                                    size="large"
                                    onClick={() => message.success("Đã thêm vào giỏ hàng!")}
                                >
                                    Thêm vào giỏ
                                </Button>

                                <Button
                                    type="default"
                                    icon={isFavorite ? <HeartFilled style={{ color: "red" }} /> : <HeartOutlined />}
                                    size="large"
                                    onClick={() => setIsFavorite(!isFavorite)}
                                >
                                    {isFavorite ? "Đã yêu thích" : "Yêu thích"}
                                </Button>
                            </div>
                        </Col>
                    </Row>

                    <Divider orientation="left" style={{ marginTop: 40 }}>
                        Bình luận
                    </Divider>
                    <CommentForm onSubmit={handleAddComment} />
                    <CommentList comments={comments} />
                </Col>

                {/* Cột phải: sản phẩm tương tự */}
                <Col xs={24} md={8}>
                    <Title level={4}>Sản phẩm tương tự</Title>
                    <Text type="secondary">Sản phẩm tương tự phía dưới</Text>
                    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
                        {similarProducts.length > 0 ? (
                            similarProducts.map((item) => (
                                <Card
                                    key={item._id}
                                    hoverable
                                    size="small"
                                    style={{ borderRadius: 12 }}
                                    cover={
                                        <img
                                            src={item.image[0] || "https://via.placeholder.com/150x120?text=No+Image"}
                                            alt={item.name}
                                            style={{ height: 120, objectFit: "cover", borderRadius: "12px 12px 0 0" }}
                                        />
                                    }
                                >
                                    <Card.Meta
                                        title={item.name}
                                        description={
                                            <span style={{ color: "#52c41a", fontWeight: 600 }}>
                                                {item.price.toLocaleString()}₫
                                            </span>
                                        }
                                    />
                                </Card>
                            ))
                        ) : (
                            <Text type="secondary">Không có sản phẩm tương tự</Text>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ProductDetailPage;
