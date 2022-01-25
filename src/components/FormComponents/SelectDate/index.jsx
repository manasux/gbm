import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Form, Row, Col } from 'antd';
import { CalendarTwoTone } from '@ant-design/icons';
import classNames from 'classnames';
import styles from './index.less';

const SelectDate = ({
  placeholder,
  name,
  rules,
  onChange,
  defaultValue,
  disabledDate,
  defaultPickerValue,
  ...rest
}) => {
  return (
    <Row>
      <Col
        xs={24}
        sm={24}
        md={24}
        lg={24}
        xl={24}
        xxl={24}
        className={classNames(styles.pickerStyle)}
      >
        <Form.Item name={name} rules={rules}>
          <DatePicker
            {...rest}
            getPopupContainer={(node) => node.parentNode}
            suffixIcon={
              <CalendarTwoTone className={classNames(styles.iconStyles)} twoToneColor="#005be7" />
            }
            disabledDate={disabledDate}
            size="middle"
            style={{ width: '100%' }}
            placeholder={placeholder}
            // onSelect={onSelect}
            onChange={onChange}
            defaultPickerValue={defaultPickerValue}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

SelectDate.propTypes = {
  placeholder: PropTypes.string,
  rules: PropTypes.array,
};

export default SelectDate;
