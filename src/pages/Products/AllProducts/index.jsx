/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useRef } from 'react';
import { connect, Link } from 'umi';
import { Button, Tabs, Input } from 'antd';
import { DownloadOutlined, PlusOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { hostname } from '@/utils/apiUtils';
import ProductListTable from './ProductListTable';
import FilterProducts from './FilterProducts';
import DraftsTable from './DraftsTable';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import style from './index.less';
import { debounce } from 'lodash';

const { TabPane } = Tabs;

const AllProducts = ({
  productDetail,
  match,
  currentUser,
  pending,
  verified,
  loading,
  dispatch,
  drafts,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [currentDraftPage, setCurrentDraftPage] = useState(1);
  const [startDraftIndex, setStartDraftIndex] = useState(0);
  const [viewDraftSize, setViewDraftSize] = useState(10);
  const [equipmentDetails, showEquipmentDetails] = useState(true);
  const [excelLoading, setExcelLoading] = useState({});
  const [productFilterType, setProductFilterType] = useState(undefined);
  const [filterdQuery, setFilterdQuery] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState();
  const [isDraftFilterApplied, setIsDraftFilterApplied] = useState(false);

  const [tab, setTab] = useState('VERIFIED');

  const firstRender = useRef(true);

  const action = (val) => {
    setStartIndex(0);
    setSearchText(val);
  };

  const debounceSearch = debounce(action, 400);

  const getDraftProducts = () => {
    dispatch({
      type: 'product/alldrafts',
      payload: {
        keyword: searchText,
        view_size: viewDraftSize,
        start_index: startDraftIndex,
        is_draft: true,
        is_variant: 'N',
        customer_id: currentUser?.personal_details?.organizationDetails?.orgPartyId,
      },
    });
  };

  const getProducts = () => {
    let payload = {
      view_size: viewSize,
      start_index: startIndex,
      keyword: searchText,
      is_variant: 'N',
      status_id: tab,
      customer_id: currentUser?.personal_details?.organizationDetails?.orgPartyId,
    };

    if (isFilterApplied && (productFilterType === tab || productFilterType === undefined)) {
      payload = { ...payload, ...filterdQuery };
    }

    dispatch({
      type: 'product/allproducts',
      payload,
    });
  };

  useEffect(() => {
    getProducts();
  }, [viewSize, startIndex, searchText, tab]);

  useEffect(() => {
    if (firstRender?.current) {
      firstRender.current = false;
      return;
    } else if (isFilterApplied) {
      dispatch({
        type: 'product/allproducts',
        payload: {
          view_size: viewSize,
          start_index: startIndex,
          keyword: searchText,
          status_id: tab,
          is_variant: 'N',
          customer_id: currentUser?.personal_details?.organizationDetails?.orgPartyId,
          ...filterdQuery,
        },
      });
    } else if (!isFilterApplied) {
      getProducts();
    }
  }, [searchText, viewSize, startIndex, isFilterApplied]);

  useEffect(() => {
    if (firstRender?.current) {
      firstRender.current = false;
      return;
    } else if (
      isDraftFilterApplied &&
      (productFilterType === undefined || productFilterType === 'DRAFT')
    ) {
      dispatch({
        type: 'product/alldrafts',
        payload: {
          keyword: searchText,
          view_size: viewDraftSize,
          start_index: startDraftIndex,
          is_draft: true,
          is_variant: 'N',
          customer_id: currentUser?.personal_details?.organizationDetails?.orgPartyId,
          ...filterdQuery,
        },
      });
    } else if (!isDraftFilterApplied) {
      getDraftProducts();
    }
  }, [searchText, startDraftIndex, viewDraftSize, isDraftFilterApplied]);

  useEffect(() => {
    getDraftProducts();
  }, [viewDraftSize, startDraftIndex, searchText]);

  const columns = [
    {
      title: <p className="m-0 text-sm text-gray-700">Sr.No.</p>,
      dataIndex: 'srno',
      align: 'center',
      render: (_, __, index) => <p className="m-0"> {index + 1 + viewSize * (currentPage - 1)}</p>,
    },
    {
      title: <p className="m-0 text-sm text-gray-700">Serial Number</p>,
      dataIndex: 'serial_number',
      align: 'left',
      render: (data) => <p className="capitalize text-sm text-blue-600">{data || '-'}</p>,
    },
    {
      title: <p className="m-0 text-sm text-gray-700">Model No.</p>,
      dataIndex: 'model',
      align: 'left',
      render: (data) => <p className="capitalize text-yellow-700 text-sm">{data?.name || '-'}</p>,
    },
    {
      title: <p className="m-0 text-sm text-gray-700">Name</p>,
      align: 'left',
      dataIndex: 'product',
      render: (data) => <p className="capitalize text-green-700  text-sm">{data?.name}</p>,
    },
    {
      title: <p className="m-0 text-sm text-gray-700">Type</p>,
      dataIndex: 'type',
      align: 'left',
      render: (data) => <p className="capitalize text-green-700  text-sm">{data?.name || '-'}</p>,
    },
    {
      title: <p className="m-0 text-sm text-gray-700">Family</p>,
      dataIndex: 'category_name',
      align: 'left',
      render: (data) => <p className="capitalize text-green-800  text-sm">{data || '-'}</p>,
    },
    {
      title: <p className="m-0 text-sm text-gray-700">Brand</p>,
      dataIndex: 'brandName',
      align: 'left',
      width: 150,
      render: (data) => (
        <p className="capitalize text-sm" style={{ color: '#38b2ac' }}>
          {data || '-'}
        </p>
      ),
    },

    {
      title: <p className="m-0 text-sm text-gray-700">Department</p>,
      dataIndex: 'department_name',
      align: 'center',
      render: (data) => <p className="capitalize text-sky-800  text-sm">{data || '-'}</p>,
    },

    {
      title: <p className="m-0 text-sm text-gray-700">Warranty Detail</p>,
      dataIndex: 'has_warranty',
      align: 'center',
      width: 120,
      render: (data) => <p className="capitalize  text-sm">{data === 'N' ? 'NO' : 'YES'}</p>,
    },
  ];

  useEffect(() => {
    if (match.path === '/equipments/all') showEquipmentDetails(true);
    else {
      showEquipmentDetails(false);
    }
  }, [match.path]);

  useEffect(() => {
    if (productDetail) {
      delete productDetail.after_warranty;
      delete productDetail.has_warranty;
    }
  }, [productDetail]);

  const exportToExcel = (data) => {
    const urll = `${hostname()}/xapi/v1/customers/${
      currentUser?.personal_details?.organization_details?.org_party_id
    }/products/export?statusId=${data}&isVariant=N`;
    fetch(`${urll}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accessToken: localStorage.getItem('accessToken'),
      },
    })
      .then((resp) => resp.arrayBuffer())
      .then((response) => {
        const file = new Blob([response], { type: 'application/octet-stream' });
        // process to auto download it
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = `Products-${currentUser?.personal_details?.organization_details?.org_party_id}.xls`;
        link.click();
        setExcelLoading({ VERIFIED: false });
        setExcelLoading({ PENDING: false });
      });
  };

  const excelDownloadBtnVerified = (
    <Button
      ghost
      type="primary"
      onClick={(event) => {
        event.stopPropagation();
        setExcelLoading({ VERIFIED: true });
        exportToExcel('VERIFIED');
      }}
    >
      <div className="px-2">
        {excelLoading.VERIFIED ? (
          <LoadingOutlined className="text-lg" />
        ) : (
          <DownloadOutlined className="text-lg" />
        )}
        <span className="ml-2 font-semibold capitalize">Download Excel</span>
      </div>
    </Button>
  );
  const excelDownloadBtnPending = (
    <Button
      ghost
      type="primary"
      onClick={(event) => {
        event.stopPropagation();
        setExcelLoading({ PENDING: true });
        exportToExcel('PENDING');
      }}
    >
      <div className="px-2">
        {excelLoading.PENDING ? (
          <LoadingOutlined className="text-lg" />
        ) : (
          <DownloadOutlined className="text-lg" />
        )}
        <span className="ml-2 font-semibold capitalize">Download Excel</span>
      </div>
    </Button>
  );
  const getSideButton = () => (
    <div className="flex justify-end w-64">
      <Link to="/equipments/add" size="large">
        <Button type="primary" icon={<PlusOutlined style={{ fontSize: '16px' }} size="medium" />}>
          Add Equipments
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="mx-12">
      <Page
        title="Equipments"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'All Equipments',
                path: '/equipments/all',
              },
            ]}
          />
        }
        primaryAction={getSideButton()}
      >
        {equipmentDetails && (
          <>
            <div className="mb-3">
              <Input
                addonBefore={
                  <FilterProducts
                    viewSize={viewSize}
                    setSearchText={setSearchText}
                    tab={tab}
                    setTab={setTab}
                    getProducts={getProducts}
                    setProductFilterType={setProductFilterType}
                    productFilterType={productFilterType}
                    setFilterdQuery={setFilterdQuery}
                    isFilterApplied={isFilterApplied}
                    setIsFilterApplied={setIsFilterApplied}
                    setIsDraftFilterApplied={setIsDraftFilterApplied}
                    isDraftFilterApplied={isDraftFilterApplied}
                  />
                }
                size="middle"
                enterButton
                onChange={(e) => debounceSearch(e?.target?.value)}
                placeholder="Enter serial number to search the product"
                allowClear
                addonAfter={
                  <Button type="primary" size="middle">
                    <SearchOutlined />
                  </Button>
                }
              />
            </div>

            <div className="bg-white px-3 rounded-lg shadow mb-4">
              <Tabs
                activeKey={tab}
                onTabClick={(val) => {
                  setTab(val);
                  setStartIndex(0);
                  setCurrentPage(1);
                  setViewSize(10);
                }}
                tabBarExtraContent={
                  tab === 'VERIFIED' ? excelDownloadBtnVerified : excelDownloadBtnPending
                }
              >
                <TabPane tab={<p className="px-4 m-0">Approved Equipments</p>} key="VERIFIED">
                  <ProductListTable
                    isVerifiedFromState={productDetail?.is_verified}
                    viewSize={viewSize}
                    currentPage={currentPage}
                    setViewSize={setViewSize}
                    setCurrentPage={setCurrentPage}
                    setStartIndex={setStartIndex}
                    columns={columns}
                    dataSource={verified?.records || []}
                    loading={loading}
                    totalRecords={verified?.totalCount}
                  />
                </TabPane>
                <TabPane tab={<p className="px-4 m-0">Pending Equipments</p>} key="PENDING">
                  <ProductListTable
                    viewSize={viewSize}
                    currentPage={currentPage}
                    setViewSize={setViewSize}
                    setCurrentPage={setCurrentPage}
                    setStartIndex={setStartIndex}
                    columns={columns}
                    dataSource={pending?.records || []}
                    loading={loading}
                    totalRecords={pending?.totalCount}
                  />
                </TabPane>
              </Tabs>
            </div>

            <div className="bg-white px-3 rounded-t-lg shadow">
              <p className="p-4 font-bold m-0">Draft Equipments</p>

              <DraftsTable
                searchText={searchText}
                columns={columns}
                drafts={drafts}
                currentDraftPage={currentDraftPage}
                viewDraftSize={viewDraftSize}
                setStartDraftIndex={setStartDraftIndex}
                setCurrentDraftPage={setCurrentDraftPage}
              />
            </div>
          </>
        )}
      </Page>
    </div>
  );
};

export default connect(({ user, product, loading }) => ({
  loading: loading.effects['product/allproducts'],
  drafts: product.drafts,
  currentUser: user.currentUser,
  productDetail: product.productDetail,
  pending: product.pending,
  verified: product.verified,
}))(AllProducts);
