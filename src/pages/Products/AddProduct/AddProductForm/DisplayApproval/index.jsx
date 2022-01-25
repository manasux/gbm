/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { connect, useParams } from "umi";
import { Table } from "antd";
import EmptyStateContainer from "@/components/EmptyStateContainer";
import classNames from "classnames";
import moment from "moment";
import { CheckCircleFilled } from "@ant-design/icons";
import styles from "./index.less";

const DisplayApproval = ({
  dispatch,
  approvalHistory,
  loading,
}) => {
  const { serialNumberId } = useParams();
  useEffect(() => {
    dispatch({
      type: "product/getApprovalHistory",
      payload: {
        pathParams: { productId: serialNumberId },
      },
    });
  }, [serialNumberId]);

  const historyColumns = [
    {
      title: <span className="text-xs">Status</span>,
      align: "left",
      dataIndex: "status",
      render: (data) => (
        <div className="capitalize text-xs">
          <span className="mx-1 text-blue-600 underline">
            {data === "approved" ? (
              <div className="capitalize">
                {data}
                <span className="mx-2">
                  <CheckCircleFilled
                    style={{ color: "#0066ff", fontSize: "16px" }}
                  />
                </span>
              </div>
            ) : (
              data
            )}
          </span>
        </div>
      ),
    },
    {
      title: <span className="text-xs">Assigned to</span>,
      align: "left",
      dataIndex: "status",
      render: (data) => (
        <span className="mx-2 capitalize text-xs">
          {data === "approved"
            ? "N/A"
            : data === "submitted" && (
                <div className="underline text-blue-600">Admin</div>
              )}
        </span>
      ),
    },
    {
      title: <span className="text-xs">Submitted by</span>,
      align: "left",
      dataIndex: "author",
      render: (data) => (
        <div>
          <span className="capitalize text-xs text-blue-600 underline">
            {" "}
            {data?.displayName}
          </span>
        </div>
      ),
    },
    {
      title: <span className="text-xs">Date/Time</span>,
      align: "left",
      dataIndex: "endDate",
      render: (data) => (
        <div className="capitalize text-xs">
          {moment(data).format("DD MMMM YYYY")}-{moment(data)?.format("LT")}
        </div>
      ),
    },
    {
      title: <span className="text-xs">Comments</span>,
      align: "left",
      dataIndex: "comment",
      render: (data) => (
        <div className="mx-2 capitalize text-xs">{data || "N/A"}</div>
      ),
    },
    {
      title: <span className="text-xs">Description</span>,
      align: "left",
      dataIndex: "description",
      render: (data) => <div className="mx-2 capitalize text-xs">{data}</div>,
    },
  ];

  return (
    <>
      <div>
        <div className="bg-white rounded-lg p-2">
          <Table
            loading={loading}
            className={classNames(styles.tableStyle)}
            scroll={{ x: 1000, y: 500 }}
            columns={historyColumns}
            dataSource={approvalHistory?.records || []}
            rowKey={(record) => record.serial_number}
            pagination={false}
            rowClassName="cursor-pointer"
            locale={{
              emptyText: <EmptyStateContainer />,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default connect(({ user, product, loading }) => ({
  currentUser: user.currentUser,
  approvalHistory: product.approvalHistory,
  loading: loading.effects["product/getApprovalHistory"],
}))(DisplayApproval);
