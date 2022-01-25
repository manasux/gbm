/* eslint-disable no-nested-ternary */

import React, { useEffect, useState } from 'react';
import { Rate } from 'antd';

const StarRating = ({ onRatingFeedback, recordId, ratingRec }) => {
  const [rateValue, setRateValue] = useState('');

  const onRateChange = (rate) => {
    setRateValue(rate);
    onRatingFeedback(rate, recordId);
  };
  useEffect(() => {
    setRateValue(ratingRec);
  }, []);
  return <Rate allowHalf value={rateValue} onChange={(val) => onRateChange(val)} />;
};
export default StarRating;
