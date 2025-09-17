import { List, Avatar, Typography } from "antd";

const { Text } = Typography;

const CommentList = ({ comments = [] }) => {
    if (!comments.length) {
        return <p style={{ color: "#8c8c8c" }}>Chưa có bình luận nào.</p>;
    }

    return (
        <List
            dataSource={comments}
            header={`${comments.length} bình luận`}
            itemLayout="horizontal"
            renderItem={(item) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar || "https://i.pravatar.cc/150"} />}
                        title={<b>{item.author.name}</b>}
                        description={
                            <>
                                <Text>{item.content}</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {item.createdAt && new Date(item.createdAt).toLocaleString()}
                                </Text>
                            </>
                        }
                    />
                </List.Item>
            )}
        />
    );
};

export default CommentList;
