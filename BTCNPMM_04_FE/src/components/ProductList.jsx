import { Row, Col, Spin, Empty, Pagination } from "antd";
import ProductCard from "./ProductCard";

const ProductList = ({ products, loading, page, setPage, limit, total, recentViews, favourites }) => {
    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
                <Spin size="large" tip="Đang tải sản phẩm..." />
            </div>
        );
    }

    if (!loading && products.length === 0) {
        return <Empty description="Không tìm thấy sản phẩm nào" />;
    }

    return (
        <>
            <Row gutter={[24, 24]}>
                {products.map((p) => (
                    <Col key={p._id} xs={24} sm={12} md={8} lg={6}>
                        <ProductCard
                            product={p}
                            isViewed={p?._id ? recentViews.includes(p._id.toString()) : false}
                            isFavorite={p?._id ? favourites.includes(p._id.toString()) : false} />
                    </Col>
                ))}
            </Row>

            <div style={{ textAlign: "center", marginTop: 50 }}>
                <Pagination
                    current={page}
                    pageSize={limit}
                    total={total}
                    onChange={(p) => setPage(p)}
                    showSizeChanger={false}
                />
            </div>
        </>
    );
};

export default ProductList;
