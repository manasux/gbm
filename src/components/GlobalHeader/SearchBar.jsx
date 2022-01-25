import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const SearchBar = () => {
  return (
    <>
      <div
        className={classNames('mx-2 mb-1 mt-1 rounded-full', styles.mainInput)}
        style={{ width: '30%', backgroundColor: '#F0F0F0' }}
      >
        <Input
          bordered={false}
          className={classNames(styles.mainInput)}
          size="medium"
          placeholder="Search"
          prefix={
            <div className="mx-4 ">
              <SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </div>
          }
        />
      </div>
    </>
  );
};

export default SearchBar;
