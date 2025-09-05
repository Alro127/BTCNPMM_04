import { useEffect, useState } from "react";
import { CrownOutlined } from "@ant-design/icons";
import { Result, Row, Col, Card, Spin, Pagination } from "antd";
import { getProductsApi } from "../util/api";

const { Meta } = Card;

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Phân trang
    const [page, setPage] = useState(1);
    const [limit] = useState(8);
    const [total, setTotal] = useState(0);

    const fetchProducts = async (p) => {
        try {
            setLoading(true);
            const data = await getProductsApi(p, limit);
            setProducts(data.products || []);
            setTotal(data.total || 0);
        } catch (err) {
            console.error("Lỗi load products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    return (
        <div style={{ padding: 20 }}>
            <Result
                icon={<CrownOutlined />}
                title="JSON Web Token (React/Node.JS) - iotstar.vn"
            />

            {loading ? (
                <Spin tip="Đang tải sản phẩm..." />
            ) : (
                <>
                    <Row gutter={[16, 16]}>
                        {products.map((p) => (
                            <Col key={p._id} xs={24} sm={12} md={8} lg={6}>
                                <Card
                                    hoverable
                                    cover={
                                        <img
                                            alt={p.name}
                                            src={p.image || "https://via.placeholder.com/200"}
                                            style={{ height: 200, objectFit: "contain" }}
                                        />
                                    }
                                >
                                    <Meta
                                        title={p.name}
                                        description={`Giá: ${p.price.toLocaleString()} VND`}
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <div style={{ textAlign: "center", marginTop: 20 }}>
                        <Pagination
                            current={page}
                            pageSize={limit}
                            total={total}
                            onChange={(p) => setPage(p)}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default HomePage;
