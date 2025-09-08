import { useEffect, useState } from "react";
import { CrownOutlined } from "@ant-design/icons";
import {
    Result,
    Row,
    Col,
    Card,
    Spin,
    Pagination,
    Input,
    Select,
    Slider,
    Tag,
} from "antd";
import { getProductsApi, getCategoriesApi } from "../util/api";

const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Phân trang
    const [page, setPage] = useState(1);
    const [limit] = useState(8);
    const [total, setTotal] = useState(0);

    // Filter
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
            if (res && res.success) {
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
            if (res && res.categories) setCategories(res.categories);
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
        <div style={{ padding: 20 }}>
            <Result
                icon={<CrownOutlined />}
                title="JSON Web Token (React/Node.JS) - iotstar.vn"
            />

            {/* Search + Filter */}
            <div style={{ marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Search
                    placeholder="Tìm sản phẩm..."
                    allowClear
                    onSearch={(value) => {
                        setPage(1);
                        setSearch(value);
                    }}
                    style={{ width: 200 }}
                />

                <Slider
                    range
                    defaultValue={[0, 10000000]}
                    max={50000000}
                    step={500000}
                    style={{ width: 300 }}
                    onAfterChange={(value) => {
                        setPage(1);
                        setPriceRange(value);
                    }}
                />
            </div>

            {/* Category tags */}
            <div style={{ marginBottom: 20 }}>
                <Tag
                    color={category === "all" ? "blue" : "default"}
                    onClick={() => setCategory("all")}
                    style={{ cursor: "pointer", marginBottom: 8 }}
                >
                    Tất cả
                </Tag>
                {categories.map((c) => (
                    <Tag
                        key={c}
                        color={category === c ? "blue" : "default"}
                        onClick={() => {
                            setPage(1);
                            setCategory(c);
                        }}
                        style={{ cursor: "pointer", marginBottom: 8 }}
                    >
                        {c}
                    </Tag>
                ))}
            </div>

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
