import React from 'react';
import { Table, Input, Row, Pagination } from 'antd';
import SearchNotFound from '@/assets/icons/empty-search-contact.png';
import { debounce } from 'lodash';
import { connect, history } from 'umi';

const { Search } = Input;

/**
 *
 * @updateDisable - The purpose of this function is to update enabled prop to y or n
 */

const StaffListTable = ({
  currentPage,
  setViewSize,
  setCurrentPage,
  setStartIndex,
  viewSize,
  setKeyword,
  totalRecords,
  staffLoading,
  staffList,
  columns,
}) => {
  function handleChangePagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  const action = (value) => {
    setKeyword(value);
  };
  /**
   *
   * @param {object} staff
   */

  const debounceSearch = debounce(action, 400);

  return (
    <div>
      <div className="flex mx-4 mb-4">
        <div className="w-full">
          <Search
            size="large"
            placeholder="Enter keyword here to search staff"
            onInput={(value) => debounceSearch(value.target.value)}
            enterButton
          />
        </div>
      </div>
      <div className="w-full">
        <Table
          scroll={{ x: 1600, y: 490 }}
          className="no-shadow zcp-fixed-w-table"
          rowClassName="cursor-pointer"
          pagination={false}
          columns={columns}
          dataSource={staffList?.result}
          rowKey={(record) => record.id}
          loading={staffLoading}
          onRow={(record) => {
            return {
              onClick: (event) => {
                event.stopPropagation();
                history.push(`/staff/${record?.partyId}/profile`);
              },
            };
          }}
          locale={{
            emptyText: (
              <div className="text-center">
                <p className="text-lg text-base font-semibold text-blue-800">
                  No staff member invited yet!
                </p>
                <img
                  src={SearchNotFound}
                  alt="No staff member found!"
                  style={{ height: '100px' }}
                />
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
export default connect(({ loading, staff, user }) => ({
  currentUser: user.currentUser,
  staffLoading: loading.effects['staff/getStaffList'],
  staffList: staff.staffList,
}))(StaffListTable);
