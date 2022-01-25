import PhoneNumber from '@/components/PhoneNumber';
import { callApi } from '@/utils/apiUtils';
import { Col, Form, Input, Row } from 'antd';
import React from 'react';

const AddPocForm = ({ form }) => {
  return (
    <div>
      <div className="px-6 pt-6">
        <div className="text-blue-900 font-semibold text-xl">Hospital point of contact</div>
        <div className="text-gray-600">
          <p className="mt-4">The basic details of hospital point of contact.</p>
        </div>
      </div>

      <div className="">
        <Row gutter={24} className="px-6 pt-6">
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              name={['contacts', 'firstName']}
              label={<span className="formLabel">First Name</span>}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "First name can't be blank!",
                },
              ]}
            >
              <Input size="middle" placeholder="Enter POC first name" />
            </Form.Item>
          </Col>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              name={['contacts', 'lastName']}
              label={<span className="formLabel">Last Name</span>}
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Last name can't be blank!",
                },
              ]}
            >
              <Input size="middle" placeholder="Enter POC last name" />
            </Form.Item>
          </Col>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label={<span className="formLabel">Enter Your Login Email</span>}
              name={['contacts', 'email']}
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
              <Input size="middle" placeholder="Enter login email address" type="email" />
            </Form.Item>
          </Col>

          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              required
              label={<span className="font-semibold text-gray-800">Phone Number</span>}
            >
              <PhoneNumber
                countryCode={['contacts', 'countryCode']}
                rules={[
                  {
                    required: true,
                    message: "Phone number can't be blank!",
                    min: 10,
                    len: 10,
                  },
                ]}
                form={form}
                name={['contacts', 'phone']}
                placeholder="Enter POC phone number"
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
      {/* Comment it For Now May Need This In Future */}
      {/* <div className="bg-gray-100 p-4 border-b">
        <div className="mb-4">
          <div className="font-semibold">
            What role would you like to give your customer&apos;s POC?
          </div>
          <div>
            After POC accepts his invitation he will be able to manage his organization in the role
            selected below.
          </div>
        </div>
        <Form.Item
          name={['contacts', 'role_type_id']}
          initialValue="CT_ADMIN"
          rules={[
            {
              required: true,
              message: 'Please select the POC role',
            },
          ]}
        >
          <Radio.Group className="w-full ">
            <div className="rounded border bg-white rounded">
              <div
                onClick={() => form.setFieldsValue({ contacts: { role_type_id: 'CT_ADMIN' } })}
                className="hover:bg-gray-100 border-b rounded rounded-b-none px-4 "
              >
                <Radio
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                  }}
                  value="CT_ADMIN"
                >
                  <div className="flex-auto whitespace-normal cursor-pointer leading-normal py-2">
                    <div className="">
                      <div className="font-semibold">Owner</div>
                      <span>
                        Has access to all organization manager functions plus manage organization
                        level settings.
                      </span>
                    </div>
                  </div>
                </Radio>
              </div>
              <div
                onClick={() => form.setFieldsValue({ contacts: { role_type_id: 'CT_MANAGER' } })}
                className="flex items-center hover:bg-gray-100 border-b rounded rounded-b-none px-4 "
              >
                <Radio
                  value="CT_MANAGER"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <div className="whitespace-normal cursor-pointer leading-normal py-2">
                    <div className="font-semibold">Manager</div>
                    <div className="flex-1 w-full">
                      Has access to all employee functions plus can manage organization products,
                      pricing, order discounts.
                    </div>
                  </div>
                </Radio>
              </div>
              <div
                onClick={() => form.setFieldsValue({ contacts: { role_type_id: 'CT_EMPLOYEE' } })}
                className="flex items-center hover:bg-gray-100 rounded rounded-b-none px-4 "
              >
                <Radio
                  value="CT_EMPLOYEE"
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <div className="flex-auto whitespace-normal cursor-pointer leading-normal py-2">
                    <div className="font-semibold">Employee</div>
                    <div>Has access to view and fullfill orders.</div>
                  </div>
                </Radio>
              </div>
            </div>
          </Radio.Group>
        </Form.Item>
      </div> */}
    </div>
  );
};

export default AddPocForm;
