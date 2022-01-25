import { useState } from 'react';
import { Form, Select, Radio, Row, Col, Input } from 'antd';
import CheckValidation from '@/components/CheckValidation';

const { Option } = Select;

const StaffTypeForm = ({ form, setRoleType, roleType }) => {
  const onRoleChangeHandler = (e) => {
    setRoleType(e.target.value);
  };

  return (
    <>
      <div className="bg-gray-100 p-4 border-b">
        {' '}
        <div className="mb-4">
          <div className="font-semibold">What role would you like to give your staff?</div>
          <div>
            After your staff accepts their invitation they will be able to manage your organization
            in the role selected below.
          </div>
        </div>
        <Form.Item
          name="roles"
          initialValue="STORE_ADMIN"
          rules={[
            {
              required: true,
              message: 'Please select staff role',
            },
          ]}
        >
          <Radio.Group className="w-full ">
            <div className="rounded border bg-white rounded">
              <div
                onClick={() => form.setFieldsValue({ roles: 'STORE_ADMIN' })}
                className="hover:bg-gray-100 border-b rounded rounded-b-none px-4 "
              >
                <Radio
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                  }}
                  value="STORE_ADMIN"
                >
                  <div className="flex-auto whitespace-normal cursor-pointer leading-normal py-2">
                    <div className="">
                      <div className="font-semibold">Admin</div>
                      <span>
                        Has access to all organization manager functions plus manage organization
                        level settings.
                      </span>
                    </div>
                  </div>
                </Radio>
              </div>
              <div
                onClick={() => form.setFieldsValue({ roles: 'STORE_MANAGER' })}
                className="flex items-center hover:bg-gray-100 border-b rounded rounded-b-none px-4 "
              >
                <Radio
                  value="STORE_MANAGER"
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
                onClick={() => form.setFieldsValue({ roles: 'STORE_EMPLOYEE' })}
                className="flex items-center hover:bg-gray-100 rounded rounded-b-none px-4 "
              >
                <Radio
                  value="STORE_EMPLOYEE"
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
      </div>
    </>
  );
};

export default StaffTypeForm;
