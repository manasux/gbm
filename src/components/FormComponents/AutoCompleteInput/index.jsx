import React from 'react';
import PropTypes from 'prop-types';
import { AutoComplete, Form } from 'antd';

const AutoCompleteInput = ({ placeholder, name, label, rules, children, onSearch, onSelect }) => {
  return (
    <Form.Item name={name} rules={rules} label={<span className="formLabel">{label}</span>}>
      <AutoComplete onSearch={onSearch} onSelect={onSelect} placeholder={placeholder}>
        {children}
      </AutoComplete>
    </Form.Item>
  );
};

AutoCompleteInput.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string || PropTypes.array,
  rules: PropTypes.array,
  label: PropTypes.string,
  onSearch: PropTypes.func,
  onSelect: PropTypes.func,
};

export default AutoCompleteInput;
