import CardSection from '@/components/CardSection';
import PhoneNumber from '@/components/PhoneNumber';
import { Col, Form, Input, Row } from 'antd';
import React from 'react';

const ContactInforamtionForm = ({ form }) => {
  return (
    <div className="mt-4">
      <CardSection
        leftContent={
          <div className="pr-8">
            <div className="text-blue-900 font-semibold text-xl">Contact information</div>
            <div className="text-gray-600">
              <p className="mt-4">The contact information of the point of contact.</p>
            </div>
          </div>
        }
        rightContent={
          <div className="bg-white shadow rounded">
            <div className="p-4 border-b">
              <Row gutter={24}>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name={['contacts', 'first_name']}
                    label={<span className="formLabel">First name</span>}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "First name can't be blank!",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Enter POC first name" />
                  </Form.Item>
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name={['contacts', 'last_name']}
                    label={<span className="formLabel">Last name</span>}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Last name can't be blank!",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Enter POC last name" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label={<span className="formLabel">Email</span>}
                name={['contacts', 'email']}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Email can't be blank!",
                  },
                  {
                    message: 'Please enter a valid email address!',
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  },
                ]}
              >
                <Input size="large" placeholder="Enter POC email address" type="email" />
              </Form.Item>
              <Form.Item
                required
                label={<span className="font-semibold text-gray-800">Phone Number</span>}
              >
                <PhoneNumber
                  countryCode={['contacts', 'country_code']}
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
            </div>
          </div>
        }
      />
    </div>
  );
};

export default ContactInforamtionForm;
