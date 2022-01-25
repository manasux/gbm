import React from 'react';
import PropTypes from 'prop-types';
import { Select, Form, Input, Row, Col } from 'antd';
import { isProductAttributeExists } from '@/services/product';
import classNames from 'classnames';
import styles from './index.less';

const SelectInput = ({
  placeholder,
  name,
  label,
  rules,
  setSuplierDetails,
  children,
  onSearch,
  onSelect,
  showSearch,
  setFields,
  type,
  showOtherOptionError,
  setShowOtherOptionError,
  selectedOption,
  setSelectedOption,
  disabled,
  ...rest
}) => {
  const responsiveCol1 = {};
  const responsiveCol2 = {};
  if (selectedOption && selectedOption[type]) {
    responsiveCol1.xs = 24;
    responsiveCol1.sm = 24;
    responsiveCol1.md = 24;
    responsiveCol1.lg = 6;
    responsiveCol1.xl = 6;
    responsiveCol1.xxl = 6;

    responsiveCol2.xs = 24;
    responsiveCol2.sm = 24;
    responsiveCol2.md = 24;
    responsiveCol2.lg = 18;
    responsiveCol2.xl = 18;
    responsiveCol2.xxl = 18;
  } else {
    responsiveCol1.xs = 24;
    responsiveCol1.sm = 24;
    responsiveCol1.md = 24;
    responsiveCol1.lg = 24;
    responsiveCol1.xl = 24;
    responsiveCol1.xxl = 24;

    responsiveCol2.xs = 0;
    responsiveCol2.sm = 0;
    responsiveCol2.md = 0;
    responsiveCol2.lg = 0;
    responsiveCol2.xl = 0;
    responsiveCol2.xxl = 0;
  }

  return (
    <>
      <Row className={classNames(styles.inputStyle)}>
        <Col {...responsiveCol1}>
          <Form.Item name={name} rules={rules}>
            <Select
              getPopupContainer={(node) => node.parentNode}
              disabled={disabled}
              allowClear
              size="middle"
              {...rest}
              filterOption={false}
              showSearch={showSearch}
              onSearch={onSearch}
              onSelect={onSelect}
              placeholder={placeholder}
            >
              {children}
            </Select>
          </Form.Item>
        </Col>
        {selectedOption && selectedOption[type] && (
          <Col {...responsiveCol2}>
            <Form.Item
              name={[name[0], 'label']}
              rules={[
                ...rules,
                ({ getFieldValue }) => ({
                  async validator(rule, value) {
                    if (value) {
                      const resp = await isProductAttributeExists({
                        attribute_name: type,
                        attribute_value: value,
                        attribute_type_id:
                          type === 'productSubType' ? getFieldValue(['type_info', 'id']) : '',
                      });
                      if (resp.exists) {
                        // eslint-disable-next-line prefer-promise-reject-errors
                        return Promise.reject(
                          `${type.charAt(0).toUpperCase() + type.slice(1)} already exists`,
                        );
                      }
                      return Promise.resolve();
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input type="text" size="middle" placeholder="Other option" />
            </Form.Item>
          </Col>
        )}
      </Row>
    </>
  );
};

SelectInput.propTypes = {
  placeholder: PropTypes.string,
  rules: PropTypes.array,
  label: PropTypes.string,
  onSearch: PropTypes.func,
  onSelect: PropTypes.func,
};

export default SelectInput;
