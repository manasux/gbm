import CardSection from '@/components/CardSection';
import { Col, Form, Input, Row, Select } from 'antd';
import React from 'react';

const ProductChoiceForm = () => {
  return (
    <div>
      <CardSection
        leftContent={
          <div className="pr-8">
            <div className="text-blue-900 font-semibold text-xl">Your product choice</div>
            <div className="text-gray-600">
              <p className="mt-4">The basic overview of the customer details</p>
            </div>
          </div>
        }
        rightContent={
          <div className="bg-white shadow rounded">
            <div className="p-4 border-b">
              <Row gutter={[12, 0]}>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name="beds"
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Product code can't be blank!",
                      },
                    ]}
                    label={<span className="formLabel ">Product code</span>}
                  >
                    <Input size="large" placeholder="Enter product code " />
                  </Form.Item>
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name="beds"
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Serial number can't be blank!",
                      },
                    ]}
                    label={<span className="formLabel ">Serial number</span>}
                  >
                    <Input size="large" placeholder="Enter serial number " />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[12, 0]}>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name="model_number"
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Model number can't be blank!",
                      },
                    ]}
                    label={<span className="formLabel ">Model number</span>}
                  >
                    <Input size="large" placeholder="Enter model number " />
                  </Form.Item>
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name="company_name"
                    label={<span className="formLabel">Product family</span>}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Product family can't be blank!",
                      },
                    ]}
                  >
                    <Select placeholder="Select product family" size="large">
                      <Select.Option>TV</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name="company_name"
                    label={<span className="formLabel">Product type</span>}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Product type can't be blank!",
                      },
                    ]}
                  >
                    <Select placeholder="Select product type" size="large">
                      <Select.Option>TV</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name="company_name"
                    label={<span className="formLabel">Product sub-type</span>}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Product sub-type can't be blank!",
                      },
                    ]}
                  >
                    <Select placeholder="Select product sub-type" size="large">
                      <Select.Option>TV</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name="company_name"
                    label={<span className="formLabel">Warranty type</span>}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Product type can't be blank!",
                      },
                    ]}
                  >
                    <Select placeholder="Select warranty type" size="large">
                      <Select.Option>TV</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name="company_name"
                    label={<span className="formLabel">Service type</span>}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Product sub-type can't be blank!",
                      },
                    ]}
                  >
                    <Select placeholder="Select service type" size="large">
                      <Select.Option>TV</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default ProductChoiceForm;
