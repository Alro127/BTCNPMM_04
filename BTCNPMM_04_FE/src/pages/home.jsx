import { useEffect, useState } from "react";
import { CrownOutlined, FireOutlined } from "@ant-design/icons";
import {
    Row,
    Col,
    Card,
    Spin,
    Pagination,
    Input,
    Slider,
    Tag,
    Typography,
    Divider,
    Empty,
    Badge,
} from "antd";
import { getProductsApi, getCategoriesApi } from "../util/api";

const { Meta } = Card;
const { Search } = Input;
const { Title, Text } = Typography;

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit] = useState(8);
    const [total, setTotal] = useState(0);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [categories, setCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 10000000]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await getProductsApi({
                page,
                limit,
                search,
                category: category === "all" ? "" : category,
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
            });

            if (res?.success) {
                setProducts(res.data || []);
                setTotal(res.pagination?.count || 0);
            } else {
                setProducts([]);
                setTotal(0);
            }
        } catch (err) {
            console.error("Lỗi load products:", err);
            setProducts([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await getCategoriesApi();
            if (res?.categories) setCategories(res.categories);
        } catch (err) {
            console.error("Lỗi load categories:", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [page, search, category, priceRange]);

    return (
        <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
            {/* Banner */}
            <div
                style={{
                    background: "linear-gradient(135deg, #1890ff, #36cfc9)",
                    padding: "60px 20px",
                    textAlign: "center",
                    color: "#fff",
                    marginBottom: 40,
                    borderBottomLeftRadius: 40,
                    borderBottomRightRadius: 40,
                }}
            >
                <CrownOutlined style={{ fontSize: 48, marginBottom: 10 }} />
                <Title level={1} style={{ color: "#fff", marginBottom: 8 }}>
                    Bộ Sưu Tập Sản Phẩm
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 18 }}>
                    Khám phá, tìm kiếm và chọn lọc theo sở thích của bạn
                </Text>
            </div>

            {/* Bộ lọc */}
            <div
                style={{
                    background: "#fff",
                    maxWidth: 1200,
                    margin: "0 auto 40px auto",
                    padding: "25px 30px",
                    borderRadius: 16,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                }}
            >
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={10}>
                        <Search
                            placeholder="🔍 Nhập tên sản phẩm..."
                            allowClear
                            size="large"
                            onSearch={(value) => {
                                setPage(1);
                                setSearch(value);
                            }}
                        />
                    </Col>
                    <Col xs={24} md={14}>
                        <Slider
                            range
                            defaultValue={[0, 500000]}
                            max={10000000}
                            step={10000}
                            tooltip={{ formatter: (v) => `${v.toLocaleString()}₫` }}
                            onAfterChange={(value) => {
                                setPage(1);
                                setPriceRange(value);
                            }}
                        />
                    </Col>
                </Row>

                <Divider style={{ margin: "20px 0" }}>Danh mục</Divider>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    <Tag.CheckableTag
                        checked={category === "all"}
                        onChange={() => setCategory("all")}
                        style={{
                            padding: "8px 14px",
                            borderRadius: 6,
                            fontSize: 15,
                            fontWeight: category === "all" ? 600 : 400,
                            background: category === "all" ? "#e6f7ff" : "#fafafa",
                            border: category === "all" ? "1px solid #1890ff" : "1px solid #d9d9d9",
                            color: category === "all" ? "#096dd9" : "#595959", // <-- CHỮ XANH ĐẬM KHI CHỌN
                            cursor: "pointer",
                        }}
                    >
                        Tất cả
                    </Tag.CheckableTag>

                    {categories.map((c) => (
                        <Tag.CheckableTag
                            key={c}
                            checked={category === c}
                            onChange={() => {
                                setPage(1);
                                setCategory(c);
                            }}
                            style={{
                                padding: "8px 14px",
                                borderRadius: 6,
                                fontSize: 15,
                                fontWeight: category === c ? 600 : 400,
                                background: category === c ? "#e6f7ff" : "#fafafa",
                                border: category === c ? "1px solid #1890ff" : "1px solid #d9d9d9",
                                color: category === c ? "#096dd9" : "#595959", // <-- CHỮ XANH ĐẬM KHI CHỌN
                                cursor: "pointer",
                            }}
                        >
                            {c}
                        </Tag.CheckableTag>
                    ))}
                </div>

            </div>

            {/* Danh sách sản phẩm */}
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>
                {loading ? (
                    <div style={{ textAlign: "center", padding: "100px 0" }}>
                        <Spin size="large" tip="Đang tải sản phẩm..." />
                    </div>
                ) : products.length === 0 ? (
                    <Empty description="Không tìm thấy sản phẩm nào" />
                ) : (
                    <>
                        <Row gutter={[24, 24]}>
                            {products.map((p) => {
                                const isOnSale = p.salePrice && p.salePrice < p.price;
                                return (
                                    <Col key={p._id} xs={24} sm={12} md={8} lg={6}>
                                        <Badge.Ribbon
                                            text={isOnSale ? "SALE" : ""}
                                            color={isOnSale ? "red" : "transparent"}
                                        >
                                            <Card
                                                hoverable
                                                style={{
                                                    borderRadius: 20,
                                                    overflow: "hidden",
                                                    boxShadow:
                                                        "0 6px 20px rgba(0,0,0,0.08)",
                                                    transition: "transform 0.3s ease",
                                                }}
                                                bodyStyle={{ padding: "14px 18px" }}
                                                cover={
                                                    <img
                                                        alt={p.name}
                                                        src={p.image || "https://via.placeholder.com/300"}
                                                        style={{
                                                            height: 240,
                                                            objectFit: "cover",
                                                            transition: "transform 0.3s ease",
                                                        }}
                                                        onMouseOver={(e) =>
                                                        (e.currentTarget.style.transform =
                                                            "scale(1.06)")
                                                        }
                                                        onMouseOut={(e) =>
                                                        (e.currentTarget.style.transform =
                                                            "scale(1)")
                                                        }
                                                    />
                                                }
                                            >
                                                <Meta
                                                    title={<b style={{ fontSize: 16 }}>{p.name}</b>}
                                                    description={
                                                        <div>
                                                            {isOnSale ? (
                                                                <>
                                                                    <span
                                                                        style={{
                                                                            color: "#ff4d4f",
                                                                            fontWeight: 700,
                                                                            fontSize: 16,
                                                                            marginRight: 8,
                                                                        }}
                                                                    >
                                                                        {p.salePrice.toLocaleString()}₫
                                                                    </span>
                                                                    <span
                                                                        style={{
                                                                            textDecoration: "line-through",
                                                                            color: "#8c8c8c",
                                                                            fontSize: 14,
                                                                        }}
                                                                    >
                                                                        {p.price.toLocaleString()}₫
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span
                                                                    style={{
                                                                        color: "#52c41a",
                                                                        fontWeight: 700,
                                                                        fontSize: 16,
                                                                    }}
                                                                >
                                                                    {p.price.toLocaleString()}₫
                                                                </span>
                                                            )}
                                                        </div>
                                                    }
                                                />
                                            </Card>
                                        </Badge.Ribbon>
                                    </Col>
                                );
                            })}
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
                )}
            </div>
        </div>
    );
};

export default HomePage;
