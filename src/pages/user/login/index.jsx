import React, { useState } from 'react';
import { Alert, Form, Input, Button, Row, Col } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { connect, Link } from 'umi';
import logo from '@/assets/logo/logo.svg';
import bgImg from '@/assets/background-image.svg';
import UserAuthLayout from '../UserAuthLayout';

const Login = ({ dispatch, loading = false }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState(false);
  return (
    <UserAuthLayout>
      <div
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
        className="w-full h-full bg-white flex items-center justify-center my-auto"
      >
        <div className="max-w-sm">
          <div className="">
            <div className="flex justify-center">
              <Row>
                <Col xs={24} sm={24} md={24} lg={0} xl={0}>
                  <img src={logo} alt="Store illustration" className="h-32 self-center" />
                </Col>
              </Row>
            </div>
            <div className="my-6">
              <div className="font-bold text-4xl text-center">Welcome back!</div>
              <div className="text-gray-500 text-base text-center">
                Enter your email address and password to log in
              </div>
            </div>
            <div className="">
              {error && (
                <div className="my-2">
                  <Alert
                    message="Invalid email address or password!"
                    type="error"
                    showIcon
                    closable
                  />
                </div>
              )}
              <Form
                hideRequiredMark
                form={form}
                onFieldsChange={() => setError(false)}
                colon={false}
                layout="vertical"
                onFinish={(val) => {
                  const apiToken = btoa(`${val.email_address}:${val.password}`);
                  dispatch({
                    type: 'login/login',
                    payload: apiToken,
                    cb: (res) => {
                      if (res?.status === 'notok') {
                        setError(true);
                      }
                    },
                  });
                }}
              >
                <Form.Item
                  name="email_address"
                  label={<span className="formLabel">Email</span>}
                  rules={[
                    {
                      type: 'email',
                      message: 'Please enter a valid email address!',
                    },
                    {
                      required: true,
                      message: "Email can't be blank!",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Password can't be blank!",
                    },
                  ]}
                  name="password"
                  label={<span className="formLabel">Password</span>}
                >
                  <Input.Password
                    size="large"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>
                <Button type="primary" loading={loading} block size="large" htmlType="submit">
                  Login
                </Button>
                <div className="text-center mt-4">
                  <Link to="/user/forgotpassword">Forgot Password ?</Link>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </UserAuthLayout>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['login/login'],
}))(Login);
