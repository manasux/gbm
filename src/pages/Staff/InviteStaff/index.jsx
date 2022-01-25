import React, { useState, useEffect } from 'react';
import Address from '@/components/Address';
import Breadcrumbs from '@/components/BreadCrumbs';
import CardSection from '@/components/CardSection';
import Page from '@/components/Page';
import { SmileOutlined } from '@ant-design/icons';
import { FooterToolbar } from '@ant-design/pro-layout';
import { Button, Col, Form, Input, notification, Row, Select, Tag } from 'antd';

import { connect, history } from 'umi';
import InviteForm from './InviteForm';
import StaffTypeForm from './StaffTypeForm';
import DocForm from './DocForm';
import OrgForm from './OrgForm';
import CheckValidation from '@/components/CheckValidation';
import { getPhoneObject } from '@/utils/utils';

const { Option } = Select;

const InviteStaff = ({ dispatch, loading, currentUser, supervisorList }) => {
  const [filelist, setFilelist] = useState([]);
  const [orgFileList, setOrgFileList] = useState([]);
  const [roleType, setRoleType] = useState('EMPLOYEE');

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({
      type: 'company/getSupervisors',
      payload: {},
    });
  }, [dispatch]);

  const button = (
    <Button
      onClick={() => {
        form.submit();
      }}
      type="primary"
      loading={loading}
    >
      Send Invite
    </Button>
  );

  const onStaffFinishHandler = (values) => {
    let data = {
      ...values,
      roles: [values?.roles || undefined],
      phone: getPhoneObject(values?.phone?.phone, values?.phone?.countryCode),
      contents: [...filelist],
      organization: {
        ...values?.organization,
        orgAddress: values?.orgAddress,
        contents: [...orgFileList],
      },
      address: {
        addressLine1: values?.[0]?.address?.address_line_1,
        addressLine2: values?.[0]?.address?.address_line_2,
        ...values?.[0]?.address,
      },
    };
    delete data?.[0]?.address?.address_line_1;
    delete data?.[0]?.address?.address_line_2;

    if (data?.roles?.[0] === undefined) {
      delete data.roles;
    }
    delete data.orgAddress;

    dispatch({ type: 'staff/createStaff', payload: [data] }).then((res) => {
      if (res?.responseMessage === 'success') {
        notification.open({
          message: 'Great Job!',
          description: (
            <div>
              You have successfully sent the invitation to{' '}
              <strong>
                {values.firstName} {values.lastName}
              </strong>
              .
            </div>
          ),
          icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        });
        form.resetFields();
        history.push('/staff/list');
      } else {
        notification.error({
          message: 'Oops! Something went wrong.',
          description: 'Please verify your email and try again!',
        });
      }
    });
  };

  return (
    <div className="container mx-auto">
      <Page
        title="Invite Staff"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Invite Staff',
                path: '/staff/invite',
              },
            ]}
          />
        }
      >
        <Form
          layout="vertical"
          hideRequiredMark
          colon={false}
          onFinish={onStaffFinishHandler}
          form={form}
          autoComplete="off"
        >
          <div className="mb-12">
            <CardSection
              leftContent={
                <div className="pr-8">
                  <div className="text-blue-900 font-semibold text-xl">Basic details</div>
                  <div className="text-gray-600">
                    <p className="mt-4">
                      Give staff access to your store by sending them an invitation.
                    </p>
                  </div>
                </div>
              }
              rightContent={
                <div className="bg-white shadow rounded p-4">
                  <InviteForm form={form} />
                </div>
              }
            />
            <div className="mt-4">
              <CardSection
                leftContent={
                  <div className="pr-8">
                    <div className="text-blue-900 font-semibold text-xl">Address</div>
                    <div className="text-gray-600">
                      <p className="mt-4">The address details of staff.</p>
                    </div>
                  </div>
                }
                rightContent={
                  <div className="bg-white shadow rounded p-4">
                    <Address form={form} />
                  </div>
                }
              />
            </div>

            <div className="mt-4">
              <CardSection
                leftContent={
                  <div className="pr-8">
                    <div className="text-blue-900 font-semibold text-xl">Staff Role</div>
                    <div className="text-gray-600">
                      <p className="mt-4">The staff type details.</p>
                    </div>
                  </div>
                }
                rightContent={
                  <div className="bg-white shadow rounded p-4">
                    <StaffTypeForm form={form} roleType={roleType} setRoleType={setRoleType} />
                  </div>
                }
              />
            </div>

            <div className="mt-4">
              <CardSection
                leftContent={
                  <div className="pr-8">
                    <div className="text-blue-900 font-semibold text-xl">
                      Designation and Supervisor
                    </div>
                    <div className="text-gray-600">
                      <p className="mt-4">The staff designation and supervisor details</p>
                    </div>
                  </div>
                }
                rightContent={
                  <div className="bg-white shadow rounded p-4">
                    <Row gutter={24}>
                      <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                        <Form.Item
                          name="designation"
                          label={<span className="formLabel">Designation</span>}
                          rules={[
                            {
                              required: true,
                              message: 'Please enter designation',
                            },
                          ]}
                        >
                          <Input placeholder="Enter designation" size="large" />
                        </Form.Item>
                      </Col>
                      <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                        <Form.Item
                          name="division"
                          label={<span className="formLabel">Division</span>}
                          rules={[
                            {
                              required: true,
                              message: 'Please enter division',
                            },
                          ]}
                        >
                          <Input placeholder="Enter division" size="large" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      name={['manager', 'id']}
                      label={<span className="formLabel">Supervisor</span>}
                      rules={[
                        {
                          required: true,
                          message: 'Please select supervisor',
                        },
                      ]}
                    >
                      <Select
                        className="w-full"
                        size="large"
                        placeholder="Select supervisor"
                        showSearch
                        filterOption={(inp, option) => {
                          const keyword = option?.children?.props?.children[0]?.props?.children[2]?.props?.children
                            ?.toLowerCase()
                            ?.split(' ')
                            ?.includes(inp?.toLowerCase());
                          return option?.key === inp || keyword;
                        }}
                        notFoundContent="No reference found"
                      >
                        {supervisorList?.result?.map((item) => (
                          <Option key={item?.id} value={item?.partyId}>
                            <div className="flex justify-between">
                              <span className="capitalize">
                                <Tag color="#108ee9">{item?.id}</Tag>{' '}
                                <span className="text-green-900 font-bold">{item?.toName}</span>
                                <span className="text-blue-800 font-bold">, {item?.city}</span>
                              </span>
                              <span>
                                <Tag color="geekblue">{item?.designation}</Tag>
                              </span>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                }
              />
            </div>

            <div className="mt-4">
              <CardSection
                noPadding
                leftContent={
                  <div className="pr-8">
                    <div className="text-blue-900 font-semibold text-xl">Documents</div>
                    <div className="text-gray-600">
                      <p className="mt-4">Provide pan and aadhar document details.</p>
                    </div>
                  </div>
                }
                rightContent={
                  <div className="bg-white shadow rounded p-4">
                    <DocForm form={form} filelist={filelist} setFilelist={setFilelist} />
                  </div>
                }
              />
            </div>
            {/* <CheckValidation show={roleType === 'PARTNER'}>
              <>
                <div className="mt-4">
                  <CardSection
                    noPadding
                    leftContent={
                      <div className="pr-8">
                        <div className="text-blue-900 font-semibold text-xl">Organisation</div>
                        <div className="text-gray-600">
                          <p className="mt-4">Provide organisation details.</p>
                        </div>
                      </div>
                    }
                    rightContent={
                      <div className="bg-white shadow rounded p-4">
                        <OrgForm
                          form={form}
                          type="orgAddress"
                          setOrgFileList={setOrgFileList}
                          orgFileList={orgFileList}
                        />
                      </div>
                    }
                  />
                </div>
                <div className="mt-4">
                  <CardSection
                    noPadding
                    leftContent={
                      <div className="pr-8">
                        <div className="text-blue-900 font-semibold text-xl">
                          Organisation address
                        </div>
                        <div className="text-gray-600">
                          <p className="mt-4">Provide organisation address details.</p>
                        </div>
                      </div>
                    }
                    rightContent={
                      <div className="bg-white shadow rounded p-4">
                        <Address form={form} type="orgAddress" />
                      </div>
                    }
                  />
                </div>
              </>
            </CheckValidation> */}

            <FooterToolbar
              extra={
                <div className="container mx-auto">
                  <div className="flex justify-end xl:mr-16 py-2 ">{button}</div>
                </div>
              }
            />
          </div>
        </Form>
      </Page>
    </div>
  );
};

export default connect(({ loading, user, company }) => ({
  supervisorList: company?.supervisorList,
  currentUser: user?.currentUser,
  loading: loading.effects['staff/createStaff'],
}))(InviteStaff);
