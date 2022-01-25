import React from 'react';
import { Row, Col } from 'antd';
import classNames from 'classnames';
/**
 * @typedef CardSection - is the card section with two cols
 * @type {object}
 * @property {object} rightContent - is the right section
 * @property {object} leftContent - is the left section
 * @property {string} className - is the extra styles for this section
 */
const CardSection = ({ rightContent, leftContent, className, noPadding }) => (
  <Row gutter={24} className={classNames(noPadding ? '' : 'border-b pb-4 mb-6', className)}>
    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
      {leftContent}
    </Col>
    <Col xs={24} sm={24} md={24} lg={16} xl={16}>
      {rightContent}
    </Col>
  </Row>
);
export default CardSection;
