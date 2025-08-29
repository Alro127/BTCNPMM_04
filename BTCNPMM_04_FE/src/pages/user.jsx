import { notification, Table } from "antd";
import { useEffect, useState } from "react";
import { getUserApi } from "../util/api";

const UserPage = () => {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUserApi();

                if (res && !res.message) {
                    setDataSource(res);
                } else {
                    notification.error({
                        message: "Unauthorized",
                        description: res.message || "Không có quyền truy cập",
                    });
                }
            } catch (error) {
                notification.error({
                    message: "Error",
                    description: error.message,
                });
            }
        };

        fetchUser();
    }, []);

    const columns = [
        {
            title: "Id",
            dataIndex: "_id",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Role",
            dataIndex: "role",
        },
    ];

    return (
        <div style={{ padding: 30 }}>
            <Table
                bordered
                dataSource={dataSource}
                columns={columns}
                rowKey="_id"
            />
        </div>
    );
};

export default UserPage;