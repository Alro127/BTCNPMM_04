import { ShoppingCartOutlined, CommentOutlined, FireOutlined } from "@ant-design/icons";

const ProductStats = ({ stats, commentCount }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        marginTop: 12,
        fontSize: 15,
        color: "#595959",
      }}
    >
      <span>
        <ShoppingCartOutlined style={{ marginRight: 6, color: "#1890ff" }} />
        {stats?.buyers || 0} khách mua
      </span>
      <span>
        <CommentOutlined style={{ marginRight: 6, color: "#fa8c16" }} />
        {commentCount} bình luận
      </span>
      <span>
        <FireOutlined style={{ marginRight: 6, color: "#f5222d" }} />
        {stats?.views || 0} lượt xem
      </span>
    </div>
  );
};

export default ProductStats;
