import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Form } from 'antd';

const { RangePicker } = DatePicker;

const Rangepicker = ({ name, rules, label }) => {
  return (
    <Form.Item name={name} rules={rules} label={<span className="formLabel">{label}</span>}>
      <RangePicker style={{ width: '100%' }} />
    </Form.Item>
  );
};

Rangepicker.propTypes = {
  name: PropTypes.string || PropTypes.array,
  rules: PropTypes.array,
  label: PropTypes.string,
};

export default Rangepicker;
