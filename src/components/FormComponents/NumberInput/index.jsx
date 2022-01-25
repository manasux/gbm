import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';

const NumberInput = ({
  placeholder,
  name,
  rules,
  label,
  form,
  setFields,
  setWarrantyValue,
  isDisabled,
  setPMSValue,
  setContractPrice,
  defaultValue,
  initialValue,
  min,
  onChange,
}) => {
  return (
    <Form.Item name={name} rules={rules} initialValue={initialValue}>
      <Input
        size="middle"
        disabled={isDisabled}
        type="number"
        placeholder={placeholder}
        onChange={onChange}
        min={min}
        defaultValue={defaultValue}
      />
    </Form.Item>
  );
};

NumberInput.propTypes = {
  placeholder: PropTypes.string,
  rules: PropTypes.array,
  label: PropTypes.string,
};

export default NumberInput;
