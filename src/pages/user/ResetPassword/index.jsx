import React, { useEffect } from 'react';
import { Button, Form, Input, message } from 'antd';
import JWT from 'jwt-decode';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { connect, history } from 'umi';
import UserAuthLayout from '../UserAuthLayout';
import styles from '../index.less';

const ForgotPassword = ({
  dispatch,
  loading,
  location: {
    query: { token },
  },
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!token && token?.emailAddress) {
      history.replace('/user/login');
    } else {
      const decodedToken = JWT(token);
      form.setFieldsValue({
        email_address: decodedToken?.userLoginId,
      });
    }
  }, []);

  return (
    <UserAuthLayout>
      <div className="">
        <div className="">
          <p className={styles.DescriptionText}>Reset Password!</p>
          <p className="text-gray-500 text-base text-center">
            Please enter a new password to reset your current password
          </p>
        </div>
        <div className="px-16">
          {/* {error && (
            <div className="my-2">
              <Alert message="Invalid email address or password!" type="error" showIcon closable />
            </div>
          )} */}
          <Form
            form={form}
            // onFieldsChange={() => setError(false)}
            colon={false}
            layout="vertical"
            onFinish={(val) => {
              dispatch({
                type: 'user/resetUserPassword',
                payload: {
                  body: {
                    email_address: val.email_address,
                    password: val.password,
                    invite_token: token,
                  },
                },
              }).then((res) => {
                if (res) {
                  message.success('Password changed successfully!');
                  history.replace('/user/login');
                }
              });
            }}
            className={styles.SignUpForm}
          >
            <Form.Item
              name="email_address"
              label={<span className="formLabel">Email address</span>}
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
              <Input size="large" disabled placeholder="Please enter your email here" />
            </Form.Item>
            <Form.Item name="password" label={<span className="formLabel">Password</span>}>
              <Input.Password
                size="large"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Button
              className="mt-4"
              type="primary"
              loading={loading}
              block
              size="large"
              htmlType="submit"
            >
              Reset Password
            </Button>
          </Form>
        </div>
      </div>
    </UserAuthLayout>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['user/resetUserPassword'],
}))(ForgotPassword);
