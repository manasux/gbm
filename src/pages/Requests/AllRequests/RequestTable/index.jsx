import React from 'react';
import { Table, Input, Row, Pagination } from 'antd';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import { debounce } from 'lodash';
import { connect } from 'umi';

const { Search } = Input;

const RequestTable = ({
  currentPage,
  setViewSize,
  setCurrentPage,
  setStartIndex,
  viewSize,
  setKeyword,
  totalRecords,
  requestList,
  loading,
}) => {
  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  const action = (value) => {
    setKeyword(value);
  };

  const debounceSearch = debounce(action, 400);

  const requestColumns = [
    {
      title: ' Product code',
    },
    {
      title: ' Product type',
    },
    {
      title: 'Service type',
    },
    {
      title: ' Product issue',
    },
    {
      title: 'Posted on',
    },
  ];

  return (
    <div>
      <div className="flex mx-4 mb-4">
        <div className="w-full mt-4">
          <Search
            size="large"
            placeholder="Enter keyword here to search request..."
            onInput={(value) => debounceSearch(value.target.value)}
          />
        </div>
      </div>
      <div className="w-full">
        <Table
          className="no-shadow zcp-fixed-w-table"
          rowClassName="cursor-pointer"
          pagination={false}
          columns={requestColumns}
          dataSource={requestList?.result}
          rowKey={(record) => record.id}
          loading={loading}
          locale={{
            emptyText: (
              <div className="text-center">
                <img src={SearchNotFound} alt="No requests found!" style={{ height: '100px' }} />
                <p className="text-base font-semibold text-blue-800">No requests yet!</p>
              </div>
            ),
          }}
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
                total={totalRecords}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                onChange={handleChangePagination}
              />
            </Row>
          )}
        />
      </div>
    </div>
  );
};
export default connect(({ user, request, loading }) => ({
  currentUser: user.currentUser,
  requestList: request.requestList,
  loading: loading.effects['request/getallrequests'],
}))(RequestTable);
