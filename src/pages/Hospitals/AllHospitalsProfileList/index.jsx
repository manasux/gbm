/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import EmptyStateContainer from '@/components/EmptyStateContainer';
import { Badge, Button, Pagination, Row, Table, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, connect, Link } from 'umi';
import styles from './index.less';
import classNames from 'classnames';

import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import { PlusOutlined } from '@ant-design/icons';

const AllHospitalsProfileList = ({ dispatch, currentUser, hospitalList, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  useEffect(() => {
    dispatch({
      type: 'hospital/allHospital',
      payload: {
        query: {
          parentId: currentUser?.personal_details?.organizationDetails?.orgPartyId,
          roleTypeId: 'BRANCH',
          view_size: viewSize,
          start_index: startIndex,
          keyword: searchText,
        },
      },
    });
  }, [viewSize, startIndex, searchText]);

  const complaintColumns = [
    {
      title: <p className="m-0 font-semibold text-sm">Sr No.</p>,
      dataIndex: 'srno',
      align: 'center',
      width: '40',
      render: (_, __, index) => (
        <div className="capitalize  text-sm font-semibold">
          {' '}
          {index + 1 + viewSize * (currentPage - 1)}
        </div>
      ),
    },
    {
      title: <p className="m-0 font-semibold   text-sm">Organization Name</p>,
      dataIndex: 'companyName',
      align: 'left',
      width: '80',
      render: (data) => (
        <div className=" capitalize  text-sm font-medium text-green-900">{data || 'N/A'}</div>
      ),
    },

    {
      title: <p className="m-0 font-semibold   text-sm">Area</p>,
      dataIndex: 'address',
      align: 'left',
      width: '60',
      ellipsis: {
        showTitle: false,
      },
      render: (data) => (
        <div className="text-sm font-semibold ">
          <Tooltip placement="topLeft" title={data?.city}>
            {data?.city?.toUpperCase()}
          </Tooltip>
        </div>
      ),
    },
    {
      title: <p className="m-0 font-semibold   text-sm">Pincode</p>,
      dataIndex: 'address',
      align: 'center',
      width: '60',
      render: (data) => (
        <div className="mx-1 capitalize  text-sm font-semibold ">{data?.postalCode}</div>
      ),
    },
    {
      title: <p className="m-0 font-semibold   text-sm">No. of Beds</p>,
      dataIndex: 'noOfBeds',
      align: 'center',
      width: '40',
      render: (data) => (
        <div className="mx-1 capitalize  text-sm font-semibold text-blue-700">{data || 'N/A'}</div>
      ),
    },
    {
      title: <p className="m-0 font-semibold text-sm">Action</p>,
      dataIndex: 'id',
      align: 'center',
      // width: '40',
      render: (data) => (
        <Button
          onClick={(event) => {
            event.stopPropagation();
            history.push(`/branches/stats/${data}`);
            console.log(data);
          }}
          type="primary"
        >
          Show Stats
        </Button>
      ),
    },
  ];
  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }
  return (
    <div className="mx-12">
      <Page
        title="All Branches"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Branches',
                path: '/branches/all',
              },
            ]}
          />
        }
        primaryAction={
          <Link to="/branches/add-branch">
            <Button type="primary" icon={<PlusOutlined style={{ fontSize: '16px' }} />}>
              Add Branch
            </Button>
          </Link>
        }
      >
        <div className="bg-white p-1 px-3 rounded-lg shadow">
          <div className="flex justify-between mt-2 mb-2">
            <span className="px-4 font-semibold font-bold">
              <Badge size="small" count={hospitalList?.totalCount} offset={[10, 0]}>
                All Branches
              </Badge>
            </span>
          </div>
          <Table
            loading={loading}
            size="small"
            scroll={{ y: 230 }}
            columns={complaintColumns}
            dataSource={hospitalList?.records || []}
            className={classNames(styles.tableStyle)}
            rowKey={(record) => record?.id}
            onRow={(record) => {
              return {
                onClick: (event) => {
                  event.stopPropagation();
                  history.push(`/branches/profile/${record?.id}?task=hospitalbranch`);
                },
              };
            }}
            pagination={false}
            rowClassName="cursor-pointer"
            footer={() => (
              <Row className="mt-2" type="flex" justify="end">
                <Pagination
                  key={`page-${currentPage}`}
                  showSizeChanger
                  pageSizeOptions={['10', '25', '50', '100']}
                  onShowSizeChange={(e, p) => {
                    setViewSize(p);
                    setCurrentPage(1);
                    setStartIndex(0);
                  }}
                  defaultCurrent={1}
                  current={currentPage}
                  pageSize={viewSize}
                  total={hospitalList?.total_count}
                  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                  onChange={handleChangePagination}
                />
              </Row>
            )}
            locale={{
              emptyText: <EmptyStateContainer />,
            }}
          />
        </div>
      </Page>
    </div>
  );
};

export default connect(({ user, hospital, loading }) => ({
  currentUser: user?.currentUser,
  hospitalList: hospital?.hospitalList,
  loading: loading.effects['hospital/allHospital'],
}))(AllHospitalsProfileList);
