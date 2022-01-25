import React, { useState, useEffect, useRef } from 'react';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import FilterContracts from './FilterContracts';
import { connect, history } from 'umi';
import {
  Pagination,
  Row,
  Table,
  Badge,
  message,
  Button,
  Dropdown,
  Menu,
  Tabs,
  Tooltip,
} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import AppModal from '@/components/AppModal';
import RenewContractRequest from './RenewContractRequest';
import DisplayDrawer from './DisplayDrawer';
import CheckValidation from '@/components/CheckValidation';

const { TabPane } = Tabs;

const AllContratcs = ({ contractsData, dispatch, loading, contractsCount, currentUser }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [tab, setTab] = useState('ALL');
  const [filterdQuery, setFilterdQuery] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isRenewContract, setIsRenewContract] = useState(false);
  const [displayDrawer, setDisplayDrawer] = useState(false);
  const [selectedContractRecord, setSelectedContractRecord] = useState([]);

  const firstRender = useRef(true);

  useEffect(() => {
    dispatch({
      type: 'contracts/getContractCounts',
      payload: {},
    });
  }, []);

  const getContracts = (type, statusId, statusIdTo, queryDate) => {
    let query = {
      ...queryDate,
      keyword: searchText,
      startIndex,
      viewSize,
      statusId,
      statusIdTo,
    };
    if (isFilterApplied) {
      query = { ...query, ...filterdQuery };
    }
    return dispatch({
      type,
      payload: {
        query,
      },
    }).catch((error) => {
      message.error(error?.data?.message);
    });
  };

  useEffect(() => {
    switch (tab) {
      case 'OUT_OF_CONTRACT':
        getContracts('contracts/getContracts', 'CONTRACT_EXPIRED');
        break;
      case 'UNDER_CONTRACT':
        getContracts('contracts/getContracts', 'CONTRACT_ACTIVE');
        break;

      case 'CONTRACT_EXPIRING':
        break;
      case 'REQUESTED':
        getContracts('contracts/getContracts', '', 'CONTRACT_REN_REQ');
        break;
      case 'NEW_CONTRACTS':
        getContracts('contracts/getContracts', '', 'NEW_CONTRACT');
        break;

      default:
        getContracts('contracts/getContracts');
        break;
    }
  }, [searchText, startIndex, viewSize, tab]);

  useEffect(() => {
    if (firstRender?.current) {
      firstRender.current = false;
      return;
    } else if (isFilterApplied) {
      switch (tab) {
        case 'OUT_OF_CONTRACT':
          getContracts('contracts/getContracts', 'CONTRACT_EXPIRED');
          break;
        case 'UNDER_CONTRACT':
          getContracts('contracts/getContracts', 'CONTRACT_ACTIVE');
          break;
        case 'CONTRACT_EXPIRING':
          break;
        case 'REQUESTED':
          getContracts('contracts/getContracts', '', 'CONTRACT_REN_REQ');
          break;
        case 'NEW_CONTRACTS':
          getContracts('contracts/getContracts', '', 'NEW_CONTRACT');
          break;

        default:
          getContracts('contracts/getContracts');
          break;
      }
    } else if (!isFilterApplied) {
      switch (tab) {
        case 'OUT_OF_CONTRACT':
          getContracts('contracts/getContracts', 'CONTRACT_EXPIRED');
          break;
        case 'UNDER_CONTRACT':
          getContracts('contracts/getContracts', 'CONTRACT_ACTIVE');
          break;
        case 'CONTRACT_EXPIRING':
          break;
        case 'REQUESTED':
          getContracts('contracts/getContracts', '', 'CONTRACT_REN_REQ');
          break;
        case 'NEW_CONTRACTS':
          getContracts('contracts/getContracts', '', 'NEW_CONTRACT');
          break;

        default:
          getContracts('contracts/getContracts');
          break;
      }
    }
  }, [isFilterApplied]);

  const onProductClickHandler = (record) => {
    history.push(`/contracts/equipments/view/${record?.productId}?task=updateEquipments`);
  };

  const contractColumns = [
    {
      title: 'Sr.No.',
      dataIndex: 'srno',
      width: 50,
      align: 'left',
      render: (_, __, index) => <div> {index + 1 + viewSize * (currentPage - 1)}</div>,
    },
    {
      title: <span>Contract ID</span>,
      dataIndex: 'formattedContractId',
      align: 'center',
      width: 80,
      render: (data, record) => (
        <div
          onClick={(event) => {
            event.stopPropagation();
            setSelectedContractRecord(record);
            setDisplayDrawer(true);
          }}
          className=" text-sm font-medium text-blue-900 underline cursor-pointer"
        >
          {data?.toUpperCase()}
        </div>
      ),
    },

    {
      title: <span>Type</span>,
      dataIndex: 'contractType',
      align: 'left',
      width: 80,
      render: (data, record) => (
        <div className=" text-sm font-medium text-green-900">{data?.toUpperCase()}</div>
      ),
    },

    {
      title: <span>Status</span>,
      dataIndex: 'contractStatus',
      align: 'left',
      width: 50,
      render: (data) => (
        <div
          className={`text-sm  font-medium ${
            data === 'Active' ? 'text-green-600' : 'text-red-700'
          }`}
        >
          {data}
        </div>
      ),
    },

    {
      title: <span>Request Status</span>,
      dataIndex: 'statusIdTo',
      align: 'left',
      width: 80,
      render: (statusID) => {
        let data;
        switch (statusID) {
          case 'CONTRACT_REN_REQ':
            data = {
              name: 'Requested',
              colorClass: 'text-yellow-500',
            };
            break;
          case 'CONTRACT_REN_COMPL':
            data = {
              name: 'Completed',
              colorClass: 'text-green-600',
            };
            break;
          case 'CONTRACT_REN_PENDING':
            data = {
              name: 'Pending',
              colorClass: 'text-yellow-600',
            };
          case 'CONTRACT_REN_APPROVE':
            data = {
              name: 'Approved',
              colorClass: 'text-green-600',
            };
            break;
          case 'CONTRACT_REN_REJECT':
            data = {
              name: 'Rejected',
              colorClass: 'text-red-600',
            };
            break;

          default:
            data = {
              name: 'n/a',
              colorClass: '',
            };
            break;
        }
        return <div className={`text-sm  font-medium ${data?.colorClass}`}>{data?.name}</div>;
      },
    },

    {
      title: <span>Product</span>,
      dataIndex: 'productName',
      align: 'left',
      width: 60,
      render: (data, record) => (
        <div
          onClick={() => onProductClickHandler(record)}
          className=" text-sm  font-medium text-sm cursor-pointer text-blue-700 underline"
        >
          {data}
        </div>
      ),
    },
    {
      title: <span>Product Type</span>,
      dataIndex: 'productType',
      align: 'left',
      width: 120,
      render: (data) => <div className=" text-sm  font-medium text-blue-700">{data}</div>,
    },
    {
      title: <span>Model</span>,
      dataIndex: 'modelName',
      align: 'left',
      width: 60,
      render: (data) => <div className=" text-sm  font-medium text-blue-700">{data}</div>,
    },

    {
      title: <span>Customer Name</span>,
      dataIndex: 'customerName',
      align: 'left',
      width: 100,
      render: (data) => <div className=" text-sm  font-medium text-gray-600">{data || 'n/a'}</div>,
    },
    {
      title: <span>Customer Location</span>,
      dataIndex: 'customerLocation',
      align: 'center',
      width: 120,
      render: (data) => <div className=" text-sm  font-medium text-gray-600">{data || 'n/a'}</div>,
    },
    {
      title: <span>Company</span>,
      dataIndex: 'brandName',
      align: 'left',
      width: 80,
      render: (data) => (
        <div className=" text-sm  font-medium text-teal-500" style={{ color: '#38b2ac' }}>
          {data || 'n/a'}
        </div>
      ),
    },

    {
      title: <span>Contract Expiry Date</span>,
      dataIndex: 'lastDate',
      align: 'left',
      width: 150,
      render: (data) => (
        <p className="m-0 text-sm font-semibold text-gray-500 ">
          {moment(data)?.format('DD MMMM YYYY') || 'N/A'}
        </p>
      ),
    },
    {
      title: <span>Last Price</span>,
      dataIndex: 'lastPrice',
      align: 'left',
      width: 80,
      render: (data) => <div className=" text-sm ">{data}</div>,
    },
    {
      title: <span>Days Left</span>,
      dataIndex: 'leftDays',
      align: 'center',
      width: 60,
      render: (data) => {
        return <div className=" text-sm ">{Math.abs(data)}</div>;
      },
    },
    {
      title: <span>Days Crossed</span>,
      dataIndex: 'leftDays',
      align: 'center',
      width: 100,
      render: (data) => <div className=" text-sm ">{Math.abs(data)}</div>,
    },
    {
      title: <span>Total Year of Contract</span>,
      dataIndex: 'periods',
      align: 'center',
      width: 150,
      render: (data) => <div className=" text-sm ">{data}</div>,
    },
  ];

  function handleContractsPagination(current) {
    setStartIndex(viewSize * (current - 1));
    setCurrentPage(current);
  }

  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          getContracts('contracts/getContracts', 'CONTRACT_ACTIVE');
        }}
      >
        All
      </Menu.Item>
      {/* ----------- */}
      <Menu.Item
        onClick={() => {
          getContracts('contracts/getContracts', 'CONTRACT_ACTIVE', '', {
            startDate: moment(Date.now())?.format('YYYY-MM-DD h:mm:ss'),
            endDate: moment(Date.now())?.add(30, 'days')?.format('YYYY-MM-DD h:mm:ss'),
          });
        }}
      >
        In 30 Days
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          getContracts('contracts/getContracts', 'CONTRACT_ACTIVE', '', {
            startDate: moment(Date.now())?.format('YYYY-MM-DD h:mm:ss'),
            endDate: moment(Date.now())?.add(60, 'days')?.format('YYYY-MM-DD h:mm:ss'),
          });
        }}
      >
        In 60 Days
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          getContracts('contracts/getContracts', 'CONTRACT_ACTIVE', '', {
            startDate: moment(Date.now())?.format('YYYY-MM-DD h:mm:ss'),
            endDate: moment(Date.now())?.add(90, 'days')?.format('YYYY-MM-DD h:mm:ss'),
          });
        }}
      >
        In 90 Days
      </Menu.Item>
    </Menu>
  );

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedContractRecord(selectedRowKeys);
    },
  };

  return (
    <div className="mx-12">
      <Page
        title="Contracts"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Contracts',
                path: '/AllContracts',
              },
            ]}
          />
        }
      >
        <div className="">
          <div className={currentUser?.isHeadquarter ? 'block' : 'hidden'}>
            <FilterContracts
              setSearchText={setSearchText}
              setStartIndex={setStartIndex}
              setFilterdQuery={setFilterdQuery}
              isFilterApplied={isFilterApplied}
              setIsFilterApplied={setIsFilterApplied}
            />
          </div>

          <div className={`bg-white p-1 px-3 rounded-lg shadow mb-4`}>
            <Tabs
              activeKey={tab}
              className=""
              onTabClick={(val) => {
                setTab(val);
                setSearchText('');
                setViewSize(10);
                setStartIndex(0);
                setCurrentPage(1);
              }}
              tabBarExtraContent={
                <div className="mx-4">
                  <CheckValidation
                    show={selectedContractRecord?.length > 0}
                    fallback={
                      <Tooltip title={'Select contract to proceed'}>
                        <Button type="primary" disabled size="middle">
                          Request for Renewal
                        </Button>
                      </Tooltip>
                    }
                  >
                    <Button type="primary" size="middle" onClick={() => setIsRenewContract(true)}>
                      Request for Renewal
                    </Button>
                  </CheckValidation>
                </div>
              }
            >
              <TabPane
                tab={
                  <span className="px-4">
                    <Badge size="small" count={contractsCount?.allContracts} offset={[6, 0]}>
                      All
                    </Badge>
                  </span>
                }
                key="ALL"
              >
                <Table
                  loading={loading}
                  scroll={{ y: 250, x: 2000 }}
                  columns={contractColumns?.filter(
                    (c) =>
                      c?.title?.props?.children !== 'Days Crossed' && c?.dataIndex !== 'statusIdTo',
                  )}
                  dataSource={contractsData?.records || []}
                  rowKey={(record) => record?.id}
                  pagination={false}
                  rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
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
                        total={contractsData?.totalCount}
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                        onChange={handleContractsPagination}
                      />
                    </Row>
                  )}
                  locale={{
                    emptyText: <EmptyStateContainer />,
                  }}
                />
              </TabPane>
              <TabPane
                tab={
                  <span className="px-4">
                    <Badge size="small" count={contractsCount?.expiredContracts} offset={[6, 0]}>
                      Out Of Contract
                    </Badge>
                  </span>
                }
                key="OUT_OF_CONTRACT"
              >
                <Table
                  loading={loading}
                  scroll={{ y: 250, x: 2000 }}
                  columns={contractColumns?.filter(
                    (c) =>
                      c?.title?.props?.children !== 'Days Left' && c?.dataIndex !== 'statusIdTo',
                  )}
                  dataSource={contractsData?.records || []}
                  rowKey={(record) => record?.id}
                  pagination={false}
                  rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
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
                        total={contractsData?.totalCount}
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                        onChange={handleContractsPagination}
                      />
                    </Row>
                  )}
                  locale={{
                    emptyText: <EmptyStateContainer />,
                  }}
                />
              </TabPane>
              <TabPane
                tab={
                  <span className="px-4">
                    <Badge size="small" count={contractsCount?.activeContracts} offset={[6, 0]}>
                      Under Contract
                    </Badge>
                  </span>
                }
                key="UNDER_CONTRACT"
              >
                <Table
                  loading={loading}
                  scroll={{ y: 250, x: 2000 }}
                  columns={contractColumns?.filter(
                    (c) =>
                      c?.title?.props?.children !== 'Days Crossed' && c?.dataIndex !== 'statusIdTo',
                  )}
                  dataSource={contractsData?.records || []}
                  rowKey={(record) => record?.id}
                  pagination={false}
                  rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
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
                        total={contractsData?.totalCount}
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                        onChange={handleContractsPagination}
                      />
                    </Row>
                  )}
                  locale={{
                    emptyText: <EmptyStateContainer />,
                  }}
                />
              </TabPane>
              <TabPane
                tab={
                  <Dropdown overlay={menu}>
                    <Button
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                      style={{ border: '0' }}
                    >
                      <span className="">Contract Expiring</span>
                    </Button>
                  </Dropdown>
                }
                key="CONTRACT_EXPIRING"
              >
                <Table
                  loading={loading}
                  scroll={{ y: 250, x: 2000 }}
                  columns={contractColumns?.filter(
                    (c) =>
                      c?.title?.props?.children !== 'Days Crossed' && c?.dataIndex !== 'statusIdTo',
                  )}
                  dataSource={contractsData?.records || []}
                  rowKey={(record) => record?.id}
                  pagination={false}
                  rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
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
                        total={contractsData?.totalCount}
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                        onChange={handleContractsPagination}
                      />
                    </Row>
                  )}
                  locale={{
                    emptyText: <EmptyStateContainer />,
                  }}
                />
              </TabPane>
              <TabPane
                tab={
                  <span className="px-4">
                    <Badge
                      size="small"
                      count={contractsCount?.renewRequestedContracts}
                      offset={[6, 0]}
                    >
                      Requested for Renewal
                    </Badge>
                  </span>
                }
                key="REQUESTED"
              >
                <Table
                  loading={loading}
                  scroll={{ y: 250, x: 2000 }}
                  columns={contractColumns?.filter(
                    (c) => c?.title?.props?.children !== 'Days Crossed',
                  )}
                  dataSource={contractsData?.records || []}
                  rowKey={(record) => record?.id}
                  pagination={false}
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
                        total={contractsData?.totalCount}
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                        onChange={handleContractsPagination}
                      />
                    </Row>
                  )}
                  locale={{
                    emptyText: <EmptyStateContainer />,
                  }}
                />
              </TabPane>
              <TabPane
                tab={
                  <span className="px-4">
                    <Badge size="small" count={''} offset={[6, 0]}>
                      New Contracts
                    </Badge>
                  </span>
                }
                key="NEW_CONTRACTS"
              >
                <Table
                  loading={loading}
                  scroll={{ y: 250, x: 2000 }}
                  columns={contractColumns?.filter(
                    (c) => c?.title?.props?.children !== 'Days Crossed',
                  )}
                  dataSource={contractsData?.records || []}
                  rowKey={(record) => record?.id}
                  pagination={false}
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
                        total={contractsData?.totalCount}
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                        onChange={handleContractsPagination}
                      />
                    </Row>
                  )}
                  locale={{
                    emptyText: <EmptyStateContainer />,
                  }}
                />
              </TabPane>
            </Tabs>
          </div>
        </div>
        <AppModal
          showModal={isRenewContract}
          setShowModal={setIsRenewContract}
          titleName="Send Contract Renewal Request"
          width={800}
          footer={null}
        >
          <RenewContractRequest
            contractIds={selectedContractRecord}
            setShowModal={setIsRenewContract}
            setTab={setTab}
          />
        </AppModal>
        <DisplayDrawer
          selectedContractRecord={selectedContractRecord}
          setDisplayDrawer={setDisplayDrawer}
          displayDrawer={displayDrawer}
          // isTabCompleted={completedPMS?.records}
        />
      </Page>
    </div>
  );
};

const mapStateToProps = ({ contracts, user, loading }) => ({
  currentUser: user.currentUser,
  contractsCount: contracts?.contractsCount,
  contractsData: contracts?.contracts,
  user: user?.currentUser,
  loading: loading.effects['contracts/getContracts'],
});

export default connect(mapStateToProps)(AllContratcs);
