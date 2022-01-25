/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Col, Table, Divider, Row, Avatar, Rate } from 'antd';
import EmptyStateContainer from '@/components/EmptyStateContainer';
import classNames from 'classnames';
import moment from 'moment';
import styles from './index.less';
import ProductResultDrawer from './ProductResultDrawer';
import { getInitials } from '@/utils/common';
import { EyeOutlined } from '@ant-design/icons';

const ProductResultList = ({
  dispatch,
  productResultList,
  loading,
  productResultDetail,
  allComments,
  currentUser,
}) => {
  const [visible, setVisible] = useState(false);

  const fetchComments = (id) => {
    dispatch({
      type: 'product/fetchComments',
      payload: {
        pathParams: {
          party_id: currentUser?.personal_details?.organizationDetails?.orgPartyId,
        },
        query: {
          custRequestId: id,
        },
      },
    });
  };

  const getProductResultDetail = (record) => {
    dispatch({
      type: 'product/getProductResultDetail',
      payload: {
        pathParams: { productId: record?.productId },
      },
    }).then((res) => {
      fetchComments(record?.id);
      setVisible(true);
    });
  };
  const Colomns = [
    {
      title: <span className="text-gray-800 font-medium text-sm">Complaint Raised By</span>,
      align: 'left',
      dataIndex: ['createdBy', 'displayName'],
      render: (data) => (
        <span className="text-blue-600 underline capitalize text-sm">{data || 'n/a'}</span>
      ),
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">Complaint No.</span>,
      align: 'left',
      dataIndex: 'formattedComplaintNo',
      render: (data) => <span className="capitalize text-sm text-green-600">{data}</span>,
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">Complaint Date</span>,
      align: 'left',
      dataIndex: 'createdAt',
      render: (data) => (
        <div>
          <span className="capitalize text-sm text-blue-900">
            {' '}
            {moment(data).format('Do MMMM YYYY')}
          </span>
        </div>
      ),
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">Closing Date</span>,
      align: 'left',
      dataIndex: 'lastUpdatedAt',
      render: (data) => (
        <div className="capitalize text-sm text-blue-900">
          {moment(data).format('Do MMMM YYYY')}
        </div>
      ),
    },
    {
      title: <span className="text-gray-800 font-medium text-sm">Call Closed By</span>,
      align: 'left',
      dataIndex: ['modifiedBy', 'displayName'],
      render: (data) => <div className="capitalize text-sm text-sky-200">{data || 'n/a'}</div>,
    },
    {
      align: 'center',
      dataIndex: 'productId',
      width: 150,
      render: (data, record) => (
        <div
          className="capitalize text-blue-600 underline text-sm"
          onClick={() => {
            getProductResultDetail(record);
          }}
        >
          See Details
        </div>
      ),
    },
  ];
  const Item = ({ data, value }) => (
    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
      <div className={classNames('mt-1', styles.lineStyles)}>
        <div className="text-gray-600 font-semibold text-xs">{data}</div>
        <div className="text-blue-800 font-semibold " style={{ fontSize: '1rem' }}>
          {value}
        </div>
      </div>
    </Col>
  );
  return (
    <>
      <div className="bg-white rounded-lg p-2">
        <Table
          loading={loading}
          className={classNames(styles.tableStyle)}
          scroll={{ x: 1000, y: 500 }}
          columns={Colomns}
          dataSource={productResultList?.records || []}
          rowKey={(record) => record.serial_number}
          pagination={false}
          rowClassName="cursor-pointer"
          locale={{
            emptyText: <EmptyStateContainer />,
          }}
        />
      </div>
      <ProductResultDrawer
        visible={visible}
        setVisible={setVisible}
        width={650}
        productResultDetail={productResultDetail}
      >
        <div className="p-10">
          <Row gutter={[24, 12]}>
            <Item data="Brand" value={productResultDetail?.brand_info?.name || 'n/a'} />
            <Item data="Model" value={productResultDetail?.model?.name || 'n/a'} />
            <Item data="Product" value={productResultDetail?.product?.name || 'n/a'} />
            <Item data="Serial No." value={productResultDetail?.serial_number || 'n/a'} />
            <Item data="Contract Status" value={productResultDetail?.contractStatus || 'n/a'} />

            <Item
              data="Year of Purchase"
              value={moment(productResultDetail?.installation_date).format('Do MMMM YYYY') || 'n/a'}
            />
            <Item data="Total Complaints" value={productResultDetail?.totalComplaints || 'n/a'} />
            <Item data="Up Time" value={productResultList?.upTime || 'n/a'} />
            <Item data="Product Ratings" value={productResultList?.productRating || 'n/a'} />
            <Item data="Company Ratings" value={productResultList?.companyRating || 'n/a'} />
          </Row>
          <Divider />
          <div
            style={{
              height: '220px',
              overflow: 'scroll',
            }}
          >
            <div className="font-medium">Comments</div>

            {allComments?.communications?.map((communication, index) => (
              <div
                key={communication?.id}
                className={classNames(index !== 0 ? 'mt-6' : 'mt-2', 'w-full ')}
              >
                <div
                  className={classNames(
                    'flex space-x-2 items-center',
                    communication?.fromParty?.id ===
                      currentUser?.personal_details?.organizationDetails?.orgPartyId
                      ? ' justify-start'
                      : '  justify-end',
                  )}
                >
                  <div
                    className={classNames(
                      'w-8',
                      communication?.fromParty?.id !==
                        currentUser?.personal_details?.organizationDetails?.orgPartyId && 'mx-4',
                    )}
                  >
                    <Avatar
                      style={{
                        backgroundColor: '#1c9cff',
                      }}
                    >
                      {getInitials(communication?.fromParty?.displayName)}
                    </Avatar>
                  </div>
                  <div
                    className={`p-3 rounded shadow
                    ${
                      communication?.fromParty?.id ===
                      currentUser?.personal_details?.organizationDetails?.orgPartyId
                        ? 'bg-white flex flex-col ml-2 mr-10'
                        : 'bg-blue-600 items-end text-white flex flex-col mr-2'
                    } `}
                  >
                    {communication?.communicationEventTypeId === 'FEEDBACK_NOTE' && (
                      <div>
                        <Rate disabled value={communication?.experienceRating} />
                      </div>
                    )}
                    <div
                      className={`font-semibold text-sm pl-2 pr-2
                        ${
                          communication?.fromParty?.id ===
                          currentUser?.personal_details?.organizationDetails?.orgPartyId
                            ? 'float-left'
                            : 'float-right'
                        }
                        `}
                    >
                      {communication?.note}
                    </div>
                    <div className="">
                      {communication?.attachments?.map((info) => (
                        <div key={info?.id}>
                          <div
                            className="mx-2 cursor-pointer"
                            onClick={() => {
                              setUploadUrl(info?.download_url || info?.downloadUrl);
                              setDisplayFrame(true);
                            }}
                          >
                            {info?.thumbnail_url?.includes('png') ||
                            info?.fileType?.includes('image') ? (
                              <img
                                width={200}
                                height={200}
                                src={info?.download_url || info?.downloadUrl}
                                alt="Compliant Document"
                              />
                            ) : (
                              <>
                                <div className="text-white  bg-blue-700 rounded box-shadow text-center">
                                  <EyeOutlined />
                                  View
                                </div>
                                <div className="cursor-pointer border ">
                                  <iframe
                                    src={info?.download_url}
                                    width="100%"
                                    height={200}
                                    type="application/pdf"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="font-semibold text-xs pl-2 pr-2 mt-2">
                      {moment(communication?.entryDate).format('DD MMMM YYYY')}-
                      {moment(communication?.entryDate).format('HH:MM:SS')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ProductResultDrawer>
    </>
  );
};

export default connect(({ user, product, loading }) => ({
  currentUser: user.currentUser,
  productResultList: product.productResultList,
  productResultDetail: product.productResultDetail,
  allComments: product?.allComments,
  loading: loading.effects['product/getProductResultList'],
}))(ProductResultList);
