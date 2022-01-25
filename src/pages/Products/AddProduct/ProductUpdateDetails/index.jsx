import React from 'react';
import moment from 'moment';
import { Link, connect } from 'umi';

const ProductUpdateDetails = ({ productDetail }) => {
  return (
    <div className="bg-gray-200 rounded-lg px-4 py-2">
      <div className="flex justify-between pt-2 text-gray-900 font-semibold">
        <div className="">
          <div className="text-sm">
            Created By{' '}
            <Link className="underline" to="">
              {productDetail?.created_by?.name || 'Amit Mathur'}
            </Link>
            <div>
              on {moment(productDetail?.created_at).format('LL')} at{' '}
              {moment(productDetail?.created_at).format('LT')}
            </div>
          </div>
        </div>

        <div className="text-sm">
          <>
            Last Modified By{' '}
            <Link className="underline" to="">
              {productDetail?.updated_by?.name || 'Sandeep Singh'}
            </Link>
            <div>
              on {moment(productDetail?.updated_at).format('LL')} at{' '}
              {moment(productDetail?.updated_at).format('LT')}
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default connect(() => ({}))(ProductUpdateDetails);
