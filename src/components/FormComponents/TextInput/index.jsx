import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';

const TextInput = ({ placeholder, name, rules, disabled }) => {
  return (
    <Form.Item name={name} rules={rules}>
      <Input autocomplete="off" size="middle" placeholder={placeholder} disabled={disabled} />
    </Form.Item>
  );
};

TextInput.propTypes = {
  placeholder: PropTypes.string,
  rules: PropTypes.array,
};

export default TextInput;
