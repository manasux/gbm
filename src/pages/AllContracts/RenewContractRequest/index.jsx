import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import styles from './index.less';
import { connect } from 'umi';

const { TextArea } = Input;

const RenewContractRequest = ({ contractIds, dispatch, setShowModal, setTab }) => {
  const [form] = Form.useForm();

  const onFinishSendContractRequest = (value) => {
    const body = {
      ...value,
      contractIds,
    };

    dispatch({
      type: 'contracts/sendContractRequest',
      payload: {
        body,
      },
    })?.then((res) => {
      if (res?.responseMessage === 'success') {
        message?.success('You have successfully generated contract renewal request');
        setShowModal(false);
        setTab('REQUESTED');
      } else {
        message?.error('Something went wrong!');
      }
    });
  };

  return (
    <div className={`bg-white shadow rounded mb-4 border-b p-5 ${styles?.formStyle}`}>
      <Form form={form} onFinish={onFinishSendContractRequest}>
        <Form.Item
          name={'note'}
          label={<span className="">Message</span>}
          rules={[
            {
              required: true,
              message: 'Please type message to send contract request',
            },
          ]}
        >
          <div className="text-gray-800 rounded mb-4 ">
            <TextArea rows={4} />
          </div>
        </Form.Item>
        <div className="flex justify-end w-full space-x-4">
          <Button type="ghost" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Send
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default connect()(RenewContractRequest);
