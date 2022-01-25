/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Row, Form, Input, Button, Select, notification, Radio, Dropdown, Menu } from 'antd';
import { history, connect } from 'umi';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import styles from './index.less';

import { CloseCircleOutlined, FormOutlined, PhoneOutlined, SmileOutlined } from '@ant-design/icons';
import PhoneNumber from '@/components/PhoneNumber';
import { callApi } from '@/utils/apiUtils';
import SelectInput from '@/components/FormComponents/SelectInput';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import ImageUpload from '@/components/ImageUpload';
import TextArea from 'rc-textarea';
import { getPhoneObject } from '@/utils/utils';

const AddHospitalContact = ({ dispatch, loading, departmentList }) => {
  const [form] = Form.useForm();

  const createContactList = (data) => {
    const body = {
      ...data,
      primaryPhone: getPhoneObject(data?.primaryPhone?.phone, data?.primaryPhone?.countryCode),
    };

    dispatch({
      type: 'hospital/createHospitalContacts',
      payload: {
        body,
        query: { isStaff: true },
      },
    }).then((res) => {
      if (res?.responseMessage === 'success') {
        notification.success({
          message: 'New Contact Added successfully!',
          duration: 3,
          icon: <SmileOutlined style={{ color: '#005be7' }} />,
        });
        history.push(`/contacts/all`);
      } else {
        notification.error({
          message: res?.errorMessage,
          duration: 3,
          icon: <CloseCircleOutlined style={{ color: 'red' }} />,
        });
      }
    });
  };
  const getDepartmentList = (value) => {
    dispatch({
      type: 'department/getAllDepartment',
      payload: {
        query: { view_size: '10', start_index: '0', keyword: value, isVerified: true },
      },
    });
  };
  useEffect(() => {
    getDepartmentList();
  }, []);

  return (
    <div className="mx-12">
      <Page
        title={
          <div>
            Hospital Contact <PhoneOutlined />
          </div>
        }
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Add Contact',
                path: '/contacts/add',
              },
            ]}
          />
        }
      >
        <Form layout="vertical" colon={false} form={form} onFinish={createContactList}>
          <div className="p-8  bg-white rounded">
            <span className="formLabel">First Name</span>
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: 'Please Enter Person First Name!' }]}
            >
              <Input size="middle" placeholder="Enter First Name" autoFocus />
            </Form.Item>
            <span className="formLabel">Last Name</span>
            <Form.Item
              name="lastName"
              rules={[{ required: false, message: 'Please Enter  Person LastName Name!' }]}
            >
              <Input size="middle" placeholder="Enter Last Name" />
            </Form.Item>

            <span className="formLabel">Mobile No.</span>
            <Form.Item>
              <PhoneNumber
                countryCode={['primaryPhone', 'countryCode']}
                rules={[
                  {
                    required: true,
                    message: "phone number can't be blank!",
                    min: 10,
                    len: 10,
                  },
                ]}
                form={form}
                name={['primaryPhone', 'phone']}
                placeholder="Enter phone number"
              />
            </Form.Item>
            <span className="formLabel">Designation</span>

            <Form.Item
              name="companyDesignation"
              rules={[{ required: true, message: 'Please Enter Designation!' }]}
            >
              <SelectInput
                rules={[{ required: true, message: 'Please Select designation' }]}
                name={'companyDesignation'}
                placeholder="Select Designation"
                showSearch="true"
                type="desgination"
              >
                {/* Designation is using Department API: change it to Designation API when avaialble */}
                {Array.isArray(departmentList?.departments) &&
                  departmentList?.departments?.map((department) => (
                    <Select.Option key={department?.id} value={department?.id}>
                      {department?.name}
                    </Select.Option>
                  ))}
              </SelectInput>
            </Form.Item>
            <span className="formLabel">Department</span>
            <SelectInput
              rules={[{ required: true, message: 'Please Select department name' }]}
              name={'companyDepartment'}
              placeholder="Select Department"
              showSearch="true"
              type="department"
            >
              {Array.isArray(departmentList?.departments) &&
                departmentList?.departments?.map((department) => (
                  <Select.Option key={department?.id} value={department?.id}>
                    {department?.name}
                  </Select.Option>
                ))}
            </SelectInput>

            <span className="formLabel">Email</span>

            <Form.Item
              name="primaryEmail"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Email can't be blank!",
                },
                ({ getFieldError }) => ({
                  validator(rule, value) {
                    const a = getFieldError('email');
                    if (a.includes("'email' is not a valid email") || !value || value.length < 2) {
                      return Promise.resolve();
                    }
                    return (
                      callApi(
                        {
                          uriEndPoint: {
                            uri: '/user/isExistingLoginId',
                            method: 'GET',
                            version: '/xapi/v1',
                          },
                          query: {
                            user_id: value,
                          },
                        },
                        {
                          disableNotifications: true,
                        },
                      )
                        .then(() => Promise.resolve())
                        // eslint-disable-next-line prefer-promise-reject-errors
                        .catch(() => Promise.reject('Email already exists. Try again!'))
                    );
                  },
                }),
                {
                  message: 'Please enter a valid email address!',
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                },
              ]}
            >
              <Input size="middle" placeholder="Enter POC email address" type="email" />
            </Form.Item>

            <span className="formLabel">Primary Contact</span>
            <Form.Item
              name={'primaryContact'}
              rules={[{ required: true, message: 'Please Select Primary Contact!' }]}
            >
              <Radio.Group>
                <Radio value="Y">
                  <span className="text-blue-700 font-semibold"> Yes</span>
                </Radio>
                <Radio value="N">
                  <span className="text-red-500 font-semibold">No</span>
                </Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          <div className={classNames('flex justify-end my-6 mb-6', styles.btnStyles)}>
            <div
              className="mx-12 mt-2 cursor-pointer"
              onClick={() => {
                form.resetFields();
                history.push(`/hospital/contacts/all`);
              }}
            >
              <span className="text-gray-500 font-semibold ">Cancel</span>
            </div>
            <Button
              loading={loading}
              size="large"
              onClick={() => form.submit()}
              type="primary"
              className="cursor-pointer text-lg font-semibold"
            >
              Save
            </Button>
          </div>
        </Form>
      </Page>
    </div>

    // Previous code is retained till confirmation from client
    // <div className="px-10">
    //   <Row gutter={24}>
    //     <Col xs={8} sm={8} md={8} lg={8}>
    //       {/* comment it for now may need this */}
    //       {/* <div className="pt-14 pb-8 border-b-2 ">
    //         <ImageUpload />
    //         <h3 className="text-center p-4 font-bold text-2xl">Amit Mathur</h3>
    //       </div>
    //       <div className="pt-12  p-12 ">
    //         <div className="flex justify-between">
    //           <h3 className="text-blue-700">About me</h3>
    //           <div className="text-blue-700">
    //             <FormOutlined className="text-blue-700" />
    //           </div>
    //         </div>

    //         <Form.Item
    //           name="description"
    //           rules={[{ required: false, message: 'Please Enter Person About!' }]}
    //         >
    //           <TextArea
    //             placeholder="Enter person About here..."
    //             showCount
    //             maxLength={100}
    //             rows={6}
    //             autoFocus
    //             form={form}
    //           />
    //         </Form.Item>
    //       </div> */}
    //       <div className="mt-48 mr-10">
    //         <div className="text-blue-900 font-semibold text-xl">
    //           Hospital Contact <PhoneOutlined />
    //         </div>
    //         <div className="text-gray-600">
    //           <p className="mt-4">Fill details of the hospital contact you want to add.</p>
    //         </div>
    //       </div>
    //     </Col>

    //     <Col xs={16} sm={16} md={16} lg={16} className={styles.inputStyle}>
    //       <Form layout="vertical" colon={false} form={form} onFinish={createContactList}>
    //         <div className="p-8  bg-white rounded">
    //           <span className="formLabel">First Name</span>
    //           <Form.Item
    //             name="first_name"
    //             rules={[{ required: true, message: 'Please Enter Person First Name!' }]}
    //           >
    //             <Input size="middle" placeholder="Enter First Name" autoFocus />
    //           </Form.Item>
    //           <span className="formLabel">Last Name</span>
    //           <Form.Item
    //             name="last_name"
    //             rules={[{ required: false, message: 'Please Enter  Person LastName Name!' }]}
    //           >
    //             <Input size="middle" placeholder="Enter Last Name" />
    //           </Form.Item>

    //           <span className="formLabel">Mobile No.</span>
    //           <Form.Item>
    //             <PhoneNumber
    //               countryCode={['primary_phone', 'country_code']}
    //               rules={[
    //                 {
    //                   required: true,
    //                   message: "phone number can't be blank!",
    //                   min: 10,
    //                   len: 10,
    //                 },
    //               ]}
    //               form={form}
    //               name={['primary_phone', 'phone']}
    //               placeholder="Enter phone number"
    //             />
    //           </Form.Item>
    //           <span className="formLabel">Designation</span>
    //           <Form.Item
    //             name="company_designation"
    //             rules={[{ required: true, message: 'Please Enter Designation!' }]}
    //           >
    //             <Input size="middle" placeholder="Enter Designation" />
    //           </Form.Item>
    //           <span className="formLabel">Department</span>
    //           <SelectInput
    //             rules={[{ required: true, message: 'Please Select department name' }]}
    //             name={'company_department'}
    //             placeholder="Select Department"
    //             showSearch="true"
    //             type="department"
    //           >
    //             {Array.isArray(departmentList?.departments) &&
    //               departmentList?.departments?.map((department) => (
    //                 <Select.Option key={department?.id} value={department?.id}>
    //                   {department?.name}
    //                 </Select.Option>
    //               ))}
    //           </SelectInput>

    //           <span className="formLabel">Email</span>

    //           <Form.Item
    //             name="primary_email"
    //             rules={[
    //               {
    //                 required: true,
    //                 whitespace: true,
    //                 message: "Email can't be blank!",
    //               },
    //               ({ getFieldError }) => ({
    //                 validator(rule, value) {
    //                   const a = getFieldError('email');
    //                   if (
    //                     a.includes("'email' is not a valid email") ||
    //                     !value ||
    //                     value.length < 2
    //                   ) {
    //                     return Promise.resolve();
    //                   }
    //                   return (
    //                     callApi(
    //                       {
    //                         uriEndPoint: {
    //                           uri: '/user/isExistingLoginId',
    //                           method: 'GET',
    //                           version: '/xapi/v1',
    //                         },
    //                         query: {
    //                           user_id: value,
    //                         },
    //                       },
    //                       {
    //                         disableNotifications: true,
    //                       },
    //                     )
    //                       .then(() => Promise.resolve())
    //                       // eslint-disable-next-line prefer-promise-reject-errors
    //                       .catch(() => Promise.reject('Email already exists. Try again!'))
    //                   );
    //                 },
    //               }),
    //               {
    //                 message: 'Please enter a valid email address!',
    //                 pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    //               },
    //             ]}
    //           >
    //             <Input size="middle" placeholder="Enter POC email address" type="email" />
    //           </Form.Item>

    //           <span className="formLabel">Primary Contact</span>
    //           <Form.Item
    //             name={'primary_contact'}
    //             rules={[{ required: true, message: 'Please Select Primary Contact!' }]}
    //           >
    //             <Radio.Group>
    //               <Radio value="Y">
    //                 <span className="text-blue-700 font-semibold"> Yes</span>
    //               </Radio>
    //               <Radio value="N">
    //                 <span className="text-red-500 font-semibold">No</span>
    //               </Radio>
    //             </Radio.Group>
    //           </Form.Item>
    //         </div>
    //         <div className={classNames('flex justify-end my-6 mb-6', styles.btnStyles)}>
    //           <div
    //             className="mx-12 mt-2 cursor-pointer"
    //             onClick={() => {
    //               form.resetFields();
    //               history.push(`/hospital/contacts/all`);
    //             }}
    //           >
    //             <span className="text-gray-500 font-semibold ">Cancel</span>
    //           </div>
    //           <Button
    //             loading={loading}
    //             size="large"
    //             onClick={() => form.submit()}
    //             type="primary"
    //             className="cursor-pointer text-lg font-semibold"
    //           >
    //             Save
    //           </Button>
    //         </div>
    //       </Form>
    //     </Col>
    //   </Row>
    // </div>
  );
};

export default connect(({ user, hospital, loading, department }) => ({
  currentUser: user?.currentUser,
  hospitalList: hospital?.hospitalList,
  departmentList: department?.departmentList,
  loading: loading.effects['hospital/createHospitalContacts'],
}))(AddHospitalContact);
