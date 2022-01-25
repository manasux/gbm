import React from 'react';
import { Input, Row, Col, Form, Radio } from 'antd';
import { callApi } from '@/utils/apiUtils';
import PhoneNumber from '@/components/PhoneNumber';
import Address from '@/components/Address';

const InviteForm = ({ form }) => {
  return (
    <>
      <Row gutter={24}>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Form.Item
            name="firstName"
            label={<span className="formLabel">First name</span>}
            rules={[
              {
                required: true,
                whitespace: true,
                message: "First name can't be blank!",
              },
            ]}
          >
            <Input placeholder="Enter first name" size="large" />
          </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Form.Item
            name="lastName"
            label={<span className="formLabel">Last name</span>}
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Last name can't be blank!",
              },
            ]}
          >
            <Input placeholder="Enter last name" size="large" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label={<span className="formLabel">Email</span>}
        name="email"
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
        <Input placeholder="Enter email address" size="large" type="email" />
      </Form.Item>
      <Form.Item label={<span className="formLabel ">Phone number</span>}>
        <PhoneNumber
          type="staff"
          countryCode={['phone', 'countryCode']}
          rules={[
            {
              required: true,
              message: "Company phone number can't be blank and of minimum 10 digits",
              min: 10,
              len: 10,
            },
          ]}
          form={form}
          name={['phone', 'phone']}
          placeholder="Enter company phone number"
        />
      </Form.Item>
    </>
  );
};
export default InviteForm;
