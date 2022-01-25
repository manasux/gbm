import React from 'react';
import { Input, Form } from 'antd';

const NumberInput = (props) => {
  const { name, rules, maxlength } = props;
  const onChange = (e) => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    // eslint-disable-next-line no-restricted-globals
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      props.form.setFieldsValue({
        [name]: value,
      });
    } else {
      props.form.setFieldsValue({
        [name]: '',
      });
    }
  };
  return (
    <Input.Group compact>
      <Form.Item name={name} rules={rules} maxlenght={maxlength} noStyle>
        <Input {...props} onChange={onChange} />
      </Form.Item>
    </Input.Group>
  );
};

export default NumberInput;
