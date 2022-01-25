import React from 'react';
import { Button, Col, Form, Input, message, Row } from 'antd';
import { connect, history, Link } from 'umi';
import logo from '@/assets/logo/logo.svg';
import bgImg from '@/assets/background-image.svg';
import UserAuthLayout from '../UserAuthLayout';

const ForgotPassword = ({ dispatch, loading }) => {
  const [form] = Form.useForm();
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
              <div className="font-bold text-4xl text-center">Forgot Password?</div>
              <div className="text-gray-500 text-base text-center">
                Enter your email to receive reset password link.
              </div>
            </div>
            <div className="">
              <Form
                form={form}
                hideRequiredMark
                colon={false}
                layout="vertical"
                onFinish={(val) => {
                  dispatch({
                    type: 'user/userForgotPassword',
                    payload: {
                      body: val,
                    },
                  }).then((res) => {
                    if (res) {
                      message.success('Password reset link sent successfully!');
                      history.replace('/user/login');
                    }
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
                <Button type="primary" loading={loading} block size="large" htmlType="submit">
                  Send reset password link
                </Button>
              </Form>
              <div className="text-center mt-4">
                <Link to="/user/login">Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserAuthLayout>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['user/userForgotPassword'],
}))(ForgotPassword);
