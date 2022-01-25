import React from 'react';
import logo from '@/assets/logo/logo.svg';
import { Col, Row } from 'antd';
import bgImg from '@/assets/background-image.svg';

const UserAuthLayout = ({ children }) => {
  return (
    <div className="flex items-center justify-center h-screen overflow-y-auto">
      <Row className="h-full w-full">
        <Col xs={0} sm={0} md={0} lg={12} xl={12} className="h-full">
          <div
            style={{
              backgroundImage: `url(${bgImg})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
            className="bg-gray-100 h-full flex flex-col items-center justify-center mx-auto"
          >
            <img src={logo} alt="GBM Force" className="h-64" />
            <div className="text-center">
              <div className="text-4xl py-6 font-bold text-gray-800">Global Bio-medical Force</div>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} className="h-full self-center">
          {children}
        </Col>
      </Row>
    </div>
  );
};

export default UserAuthLayout;
