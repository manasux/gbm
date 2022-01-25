/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import HospitalImageUpload from '../HospitalImageUpload';
import { Link, connect, useParams } from 'umi';
import { Button, Col, Row, Tag, Tooltip } from 'antd';
import moment from 'moment';
import CardSection from '@/components/CardSection';
import {
  ContainerOutlined,
  DoubleLeftOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import ProductUpdateDetails from '@/pages/Products/AddProduct/ProductUpdateDetails';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import ProfileUpdateDetails from './ProfileUpdateDetails';
import CustomerDocuments from './CustomerDocuments';
import { useGetCustomer } from '@/query/useCustomer';

const HospitalBranchProfile = ({ currentUser }) => {
  const { profileId } = useParams();

  const customer = useGetCustomer({
    pathParams: {
      customerId: profileId
        ? profileId
        : currentUser?.personal_details?.organizationDetails?.orgPartyId,
    },
  });

  const { data: customerRecord, refetch: refetchCustomer } = customer || { data: '' };

  const Item = ({ data, value }) => (
    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} className="mt-4">
      <div style={{ lineHeight: '15px !important' }}>
        <p className="m-0 text-gray-600 font-semibold text-sm whitespace-nowrap">{data}</p>
        <p className="m-0 text-blue-900 font-semibold w-full" style={{ fontSize: '1rem' }}>
          {value}
        </p>
      </div>
    </Col>
  );
  return (
    <div className="mx-12">
      <Page
        title="Hospital Profile"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Hospital Profile',
                path: '/branch-profile',
              },
            ]}
          />
        }
        primaryAction={
          <Link to="/branches/all">
            <Button type="primary" icon={<DoubleLeftOutlined style={{ fontSize: '16px' }} />}>
              Go to hosptal profiles
            </Button>
          </Link>
        }
      >
        <HospitalImageUpload customerRecord={customerRecord} />
        <div className="mt-6">
          <Col lg={24} xl={24} md={24} sm={24} xs={24}>
            <div className="flex justify-between flex-wrap">
              <div className="flex items-center flex-auto text-xs uppercase font-semibold py-2">
                <span className="bg-yellow-400 text-yellow-900 rounded-full rounded-r-none pr-2 pl-4 py-1">
                  Renews on
                </span>
                <span className=" bg-gray-400 text-blue-900 rounded-full rounded-l-none pl-2  pr-4 py-1">
                  {customerRecord && customerRecord?.subscription?.endDate
                    ? moment(customerRecord?.subscription?.endDate).format('LL')
                    : 'n/a'}
                </span>
              </div>
              <div className="flex items-center pr-2">
                <p className="m-0 text-blue-900 text-sm font-medium capitalize ">
                  Subscription Type
                </p>

                <p className="m-0 ml-2 text-gray-600 text-sm font-bold capitalize">
                  {(customerRecord && customerRecord?.subscription?.billingFrequency) || 'n/a'}
                </p>
              </div>
            </div>
          </Col>
        </div>
        <div className="mt-6">
          <CardSection
            leftContent={
              <div className="pr-8">
                <div className="text-blue-900 font-semibold text-xl">
                  <PhoneOutlined /> Point of Contact
                </div>
                <div className="text-gray-600">
                  <p className="mt-4">The basic details of hospital's point of contact.</p>
                </div>
              </div>
            }
            rightContent={
              <div className="bg-white shadow rounded">
                <div className="p-4 border-b">
                  <Row gutter={([24], [24])}>
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <Item
                        data="First Name"
                        value={(customerRecord && customerRecord?.companyPoc?.firstName) || 'n/a'}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <Item
                        data="Last Name"
                        value={(customerRecord && customerRecord?.companyPoc?.lastName) || 'n/a'}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <Item
                        data="Email"
                        value={
                          (customerRecord &&
                            customerRecord?.companyPoc?.emailAddresses?.find((item) => item?.email)
                              ?.email) ||
                          'n/a'
                        }
                      />
                    </Col>
                  </Row>
                </div>
              </div>
            }
          />
          <CardSection
            leftContent={
              <div className="pr-8">
                <div className="text-blue-900 font-semibold text-xl">
                  <EnvironmentOutlined style={{ fontSize: '20px' }} /> Billing Address
                </div>
                <div className="text-gray-600">
                  <p className="mt-4">Location of this hospital.</p>
                </div>
              </div>
            }
            rightContent={
              <div className="bg-white shadow rounded">
                <div className="p-4 border-b">
                  <Row gutter={([24], [24])}>
                    <Col xs={24} sm={12} md={12} lg={8} className="mt-4">
                      <div className="capitalize  text-xs font-semibold ml-3 ">
                        <div style={{ lineHeight: '15px !important' }}>
                          <div className="text-gray-600 font-semibold text-sm mb-1">
                            Address Line 1
                          </div>

                          <Tooltip placement="topLeft" title="Billing Address Line One">
                            <div
                              className="text-blue-900 font-semibold "
                              style={{ fontSize: '1rem' }}
                            >
                              {(customerRecord?.addresses?.length > 0 &&
                                customerRecord?.addresses[0]?.addressLine1) ||
                                'n/a'}
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} className="mt-4">
                      <div className="capitalize  text-xs font-semibold ml-3 ">
                        <div style={{ lineHeight: '15px !important' }}>
                          <div className="text-gray-600 font-semibold text-sm mb-1">
                            Address Line 2
                          </div>

                          <Tooltip placement="topLeft" title="Billing Address Line Two">
                            <div
                              className="text-blue-900 font-semibold "
                              style={{ fontSize: '1rem' }}
                            >
                              {(customerRecord?.addresses?.length > 0 &&
                                customerRecord?.addresses[0]?.addressLine2) ||
                                'n/a'}
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <Item
                        data="City"
                        value={
                          (customerRecord?.addresses?.length > 0 &&
                            customerRecord?.addresses[0]?.city) ||
                          'n/a'
                        }
                      />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <Item
                        data="State"
                        value={
                          (customerRecord?.addresses?.length > 0 &&
                            customerRecord?.addresses[0]?.stateName) ||
                          'n/a'
                        }
                      />
                    </Col>

                    <Col xs={24} sm={12} md={12} lg={8}>
                      <Item
                        data="Region"
                        value={
                          (customerRecord?.addresses?.length > 0 &&
                            customerRecord?.addresses[0]?.region) ||
                          'n/a'
                        }
                      />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <Item
                        data="Country"
                        value={
                          (customerRecord?.addresses?.length > 0 &&
                            customerRecord?.addresses[0]?.countryName) ||
                          'n/a'
                        }
                      />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <Item
                        data="PinCode"
                        value={
                          (customerRecord?.addresses?.length > 0 &&
                            customerRecord?.addresses[0]?.postalCode) ||
                          'n/a'
                        }
                      />
                    </Col>
                  </Row>
                </div>
              </div>
            }
          />
          <CardSection
            leftContent={
              <div className="pr-8">
                <div className="flex items-center text-blue-900">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                      />
                    </svg>
                  </span>
                  <div className="text-blue-900 font-semibold text-xl mr-2">Shipping Address</div>
                </div>
                <div className="text-gray-600">
                  <p className="mt-4">The shipping address of this customer.</p>
                </div>
              </div>
            }
            rightContent={
              <div className="bg-white shadow rounded">
                <div className="p-4 border-b">
                  <Row gutter={([24], [24])}>
                    <Col xs={24} sm={12} md={12} lg={8} className="mt-4">
                      <div className="capitalize  text-xs font-semibold ml-3 ">
                        <div style={{ lineHeight: '15px !important' }}>
                          <div className="text-gray-600 font-semibold text-sm mb-1">
                            Address Line 1
                          </div>

                          <Tooltip placement="topLeft" title="Shipping Address Line One">
                            <div
                              className="text-blue-900 font-semibold "
                              style={{ fontSize: '1rem' }}
                            >
                              {customerRecord?.addresses[1]?.addressLine1}
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} className="mt-4">
                      <div className="capitalize  text-xs font-semibold ml-3 ">
                        <div style={{ lineHeight: '15px !important' }}>
                          <div className="text-gray-600 font-semibold text-sm mb-1">
                            Address Line 2
                          </div>

                          <Tooltip placement="topLeft" title="Shipping Address Line Two">
                            <div
                              className="text-blue-900 font-semibold "
                              style={{ fontSize: '1rem' }}
                            >
                              {customerRecord?.addresses[1]?.addressLine2}
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <Item data="City" value={customerRecord?.addresses[1]?.city} />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <Item data="State" value={customerRecord?.addresses[1]?.stateName} />
                    </Col>

                    <Col xs={24} sm={12} md={12} lg={8}>
                      <Item data="Region" value={customerRecord?.addresses[1]?.region} />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <Item data="Country" value={customerRecord?.addresses[1]?.countryName} />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <Item data="PinCode" value={customerRecord?.addresses[1]?.postalCode} />
                    </Col>
                  </Row>
                </div>
              </div>
            }
          />
          <CardSection
            leftContent={
              <div className="pr-8">
                <div className="text-blue-900 font-semibold text-xl">
                  <ContainerOutlined /> Additional Details
                </div>
                <div className="text-gray-600">
                  <p className="mt-4">PAN, GST, Amount Paid etc...</p>
                </div>
              </div>
            }
            rightContent={
              <div className="bg-white shadow rounded">
                <CustomerDocuments customer={customerRecord} refetchCustomer={refetchCustomer} />
                <div className="px-4 border-b">
                  <Row gutter={([24], [24])}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                      <Item
                        data="Amount Paid"
                        value={customerRecord?.subscription?.grandTotal || 'n/a'}
                      />
                    </Col>
                  </Row>
                </div>
              </div>
            }
          />
          <ProfileUpdateDetails profileDetails={customerRecord} />
        </div>
      </Page>
    </div>
  );
};

const mapStateToProps = ({ user, customer }) => ({
  currentUser: user?.currentUser,
});
export default connect(mapStateToProps)(HospitalBranchProfile);
