import { Tooltip } from 'antd';
import React from 'react';

const CustomTooltip = (props) => {
  if (props.show) {
    return <Tooltip {...props}>{props.children}</Tooltip>;
  }
  return props.children;
};

export default CustomTooltip;
