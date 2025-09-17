import { Row, Col, Slider, Input, Tag, Divider } from "antd";

const { Search } = Input;

const FilterBar = ({ search, setSearch, priceRange, setPriceRange, category, setCategory, categories }) => {
  return (
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
            onSearch={(value) => setSearch(value)}
          />
        </Col>
        <Col xs={24} md={14}>
          <Slider
            range
            defaultValue={[0, 500000]}
            max={10000000}
            step={10000}
            tooltip={{ formatter: (v) => `${v.toLocaleString()}₫` }}
            onAfterChange={(value) => setPriceRange(value)}
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
            color: category === "all" ? "#096dd9" : "#595959",
            cursor: "pointer",
          }}
        >
          Tất cả
        </Tag.CheckableTag>

        {categories.map((c) => (
          <Tag.CheckableTag
            key={c}
            checked={category === c}
            onChange={() => setCategory(c)}
            style={{
              padding: "8px 14px",
              borderRadius: 6,
              fontSize: 15,
              fontWeight: category === c ? 600 : 400,
              background: category === c ? "#e6f7ff" : "#fafafa",
              border: category === c ? "1px solid #1890ff" : "1px solid #d9d9d9",
              color: category === c ? "#096dd9" : "#595959",
              cursor: "pointer",
            }}
          >
            {c}
          </Tag.CheckableTag>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
