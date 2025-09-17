import { CrownOutlined } from "@ant-design/icons";
import { Typography } from "antd";

const { Title, Text } = Typography;

const Banner = () => {
  return (
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
  );
};

export default Banner;
