import React, { useEffect } from 'react';
import { Input, Select, Form } from 'antd';
import styles from './styles.less';
import { connect } from 'umi';

const { Option } = Select;
const PhoneNumber = (props) => {
  const { name, rules, countryCode, telephonicCode, dispatch } = props;
  // added the event listener to stop incrementing number field on mouse scroll event,
  // removed that event listener when component is unmounted
  useEffect(() => {
    // Calling API to GET All Countries Telephonic Codes
    dispatch({
      type: 'common/getTelephonicCode',
    });

    // eslint-disable-next-line func-names
    const eventListener = document.addEventListener('wheel', function () {
      if (
        document.activeElement.type === 'number' &&
        document.activeElement.classList.contains('noscroll')
      ) {
        document.activeElement.blur();
      }
    });
    return () => {
      document.removeEventListener('wheel', eventListener);
    };
  }, []);

  useEffect(() => {}, []);

  return (
    <Input.Group className={styles.container}>
      <Form.Item initialValue="IN" name={countryCode} noStyle>
        <Select size="middle" defaultValue="IN">
          {telephonicCode &&
            telephonicCode?.map((item) => (
              <Option key={item?.teleCode} value={item?.countryCode}>
                {item?.countryName}
              </Option>
            ))}

          {/* <Option value="IN">IN (+91)</Option> */}
        </Select>
      </Form.Item>
      <Form.Item name={name} rules={rules} noStyle>
        <Input type="number" size="middle" {...props} maxLength={10} className="noscroll" />
      </Form.Item>
    </Input.Group>
  );
};

const mapStateToProps = ({ common }) => ({
  telephonicCode: common?.telephonicCode,
});

export default connect(mapStateToProps)(PhoneNumber);
