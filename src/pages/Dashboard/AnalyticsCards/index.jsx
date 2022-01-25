import {
  AreaChartOutlined,
  DesktopOutlined,
  PieChartOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';
import styles from '../index.less';

const AnalyticsCards = () => {
  return (
    <Row gutter={24}>
      <Col xl={6} lg={6} md={24} sm={24} xs={24}>
        <div className={styles.PendindCard}>
          <div className="">
            <div className="text-2xl font-bold">80</div>
            <div className="text-sm">Pending Tests</div>
          </div>
          <div className="">
            <DesktopOutlined className="text-4xl" />
          </div>
        </div>
      </Col>
      <Col xl={6} lg={6} md={24} sm={24} xs={24}>
        <div className={styles.ResultsCard}>
          <div className="">
            <div className="text-2xl font-bold">1</div>
            <div className="text-sm truncate">New Results Available</div>
          </div>
          <div className="">
            <AreaChartOutlined className="text-4xl" />
          </div>
        </div>
      </Col>
      <Col xl={6} lg={6} md={24} sm={24} xs={24}>
        <div className={styles.PerformanceCard}>
          <div className="">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm">Performance</div>
          </div>
          <div className="">
            <PieChartOutlined className="text-4xl" />
          </div>
        </div>
      </Col>
      <Col xl={6} lg={6} md={24} sm={24} xs={24}>
        <div className={styles.WalletCard}>
          <div className="">
            <div className="text-2xl font-bold">$1</div>
            <div className="text-sm">Wallet Balance</div>
          </div>
          <div className="">
            <WalletOutlined className="text-4xl" />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default AnalyticsCards;
