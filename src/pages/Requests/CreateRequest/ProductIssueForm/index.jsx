import CardSection from '@/components/CardSection';
import { Col, Form, Input, Row, Select } from 'antd';
import React from 'react';

const ProductIssueForm = () => {
  return (
    <div className="mt-4">
      <CardSection
        leftContent={
          <div className="pr-8">
            <div className="text-blue-900 font-semibold text-xl">Product issue</div>
            <div className="text-gray-600">
              <p className="mt-4">The contact person details overview of the product issue.</p>
            </div>
          </div>
        }
        rightContent={
          <div className="bg-white shadow rounded">
            <div className="p-4 border-b">
              <Row gutter={[12, 0]}>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name="company_name"
                    label={<span className="formLabel">Topic</span>}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Topic can't be blank!",
                      },
                    ]}
                  >
                    <Select placeholder="Select product issue topic" size="large">
                      <Select.Option>TV</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name="company_name"
                    label={<span className="formLabel"> Sub topic</span>}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Product sub-type can't be blank!",
                      },
                    ]}
                  >
                    <Select placeholder="Select product issue sub-topic" size="large">
                      <Select.Option>TV</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="company_name"
                label={<span className="formLabel"> Symptoms</span>}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Product sub-type can't be blank!",
                  },
                ]}
              >
                <Input.TextArea
                  placeholder="Enter the details of product issue symptoms"
                  autoSize={{ minRows: 4, maxRows: 10 }}
                />
              </Form.Item>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default ProductIssueForm;
