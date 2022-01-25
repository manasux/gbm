/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Input, Radio, Button } from 'antd';
import React, { useEffect } from 'react';
import Modal from '@/components/AppModal';
import PhoneNumber from '@/components/PhoneNumber';
import SelectInput from '@/components/FormComponents/SelectInput';
import TextInput from '@/components/FormComponents/TextInput';
import styles from './index.less';

const UpdateDeleteHospitalContact = ({ showModal, setShowModal, selectedContact }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      first_name: selectedContact?.firstName,
      last_name: selectedContact?.lastName,
      company_designation: selectedContact?.designation,
      company_department: selectedContact?.department,
      primary_email: selectedContact?.primaryEmail,
      primary_contact: selectedContact?.primaryContact,
    });
  }, [selectedContact]);
  return (
    <div>
      <Modal
        showModal={showModal}
        titleName="Edit Contact"
        setShowModal={setShowModal}
        footer={
          <Button
            loading={false}
            size="middle"
            onClick={() => form.submit()}
            type="primary"
            className="cursor-pointer  font-semibold"
          >
            Update contact
          </Button>
        }
      >
        <div className="p-6 ">
          <Form
            layout="vertical"
            colon={false}
            form={form}
            onFinish={(values) => console.log(values)}
            className={styles.InputStyle}
          >
            <span className="formLabel">First Name</span>

            <TextInput
              name="first_name"
              placeholder="Enter First Name"
              rules={[{ required: true, message: 'Please Enter Person First Name!' }]}
              autoFocus
            />

            <span className="formLabel">Last Name</span>

            <TextInput
              name="last_name"
              placeholder="Enter Last Name"
              rules={[{ required: false, message: 'Please Enter  Person LastName Name!' }]}
            />

            <span className="formLabel">Mobile No.</span>
            <Form.Item>
              <PhoneNumber
                countryCode={['primary_phone', 'country_code']}
                rules={[
                  {
                    required: true,
                    message: "phone number can't be blank!",
                    min: 10,
                    len: 10,
                  },
                ]}
                form={form}
                name={['primary_phone', 'phone']}
                placeholder="Enter phone number"
              />
            </Form.Item>
            <span className="formLabel">Designation</span>

            <TextInput
              name="company_designation"
              placeholder="Enter Designation"
              rules={[{ required: true, message: 'Please Enter Designation!' }]}
              autoFocus
            />
            <span className="formLabel">Department</span>
            <SelectInput
              rules={[{ required: true, message: 'Please Select department name' }]}
              name={'company_department'}
              placeholder="Select Department"
              showSearch="true"
              type="department"
            ></SelectInput>

            <span className="formLabel">Email</span>

            <Form.Item
              name="primary_email"
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
              <Input size="middle" placeholder="Enter POC email address" type="email" />
            </Form.Item>

            <span className="formLabel">Primary Contact</span>
            <Form.Item
              name={'primary_contact'}
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
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateDeleteHospitalContact;
