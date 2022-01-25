import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { Link } from 'umi';
import emptySeatEmptyStateSvg from '@/assets/icons/space-empty.svg';
import CheckValidation from '../CheckValidation';

const EmptyStateContainer = ({ subHeading, goto, showAddButton = false, onButtonClick, type }) => {
  const renderButton = () => {
    let btnJSX = null;
    if (showAddButton) {
      if (goto) {
        btnJSX = (
          <Link to={goto}>
            <Button type="primary" className="mt-3" shape="circle" onClick={onButtonClick}>
              <PlusOutlined />
            </Button>
            <div className="font-semibold text-blue-700 text-xs mt-1">{subHeading}</div>
          </Link>
        );
      } else if (onButtonClick) {
        btnJSX = (
          <>
            <Button type="primary" className="mt-3" shape="circle" onClick={onButtonClick}>
              <PlusOutlined />
            </Button>
            <div className="font-semibold text-blue-700 text-xs mt-1">{subHeading}</div>
          </>
        );
      }
    }

    return btnJSX;
  };
  return (
    <div className="flex justify-center ">
      <div className={`text-center bg-white ${type === 'Recent Tasks' && 'py-6'}`}>
        <img
          src={emptySeatEmptyStateSvg}
          alt="No address"
          style={{ marginInline: '14%', height: '95px' }}
          className="mt-2"
        />
        <div className=" text-gray-700 text-base -mt-8 font-bold">No Data</div>
        <div className="font-normal text-gray-500 text-sm">There are no item(s) to show here</div>
        <CheckValidation show={subHeading}>
          <div className="text-base font-semibold">{subHeading}</div>
        </CheckValidation>
        {renderButton()}
      </div>
    </div>
  );
};
export default EmptyStateContainer;
