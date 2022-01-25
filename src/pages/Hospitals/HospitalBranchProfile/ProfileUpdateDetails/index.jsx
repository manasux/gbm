import React from 'react';
import moment from 'moment';
import { Link, connect } from 'umi';

const ProductUpdateDetails = ({ profileDetails }) => {
  return (
    <div className="bg-gray-200 rounded-lg px-4 py-2">
      <div className="flex justify-between pt-2 text-gray-900 font-semibold">
        <div className="">
          <div className="text-sm">
            Created By{' '}
            <Link className="underline" to="">
              {profileDetails?.createdBy || 'n/a'}
            </Link>
            <div>
              on {moment(profileDetails?.createdAt).format('LL')} at{' '}
              {moment(profileDetails?.createdAt).format('LT')}
            </div>
          </div>
        </div>

        <div className="text-sm">
          <>
            Last Modified By{' '}
            <Link className="underline" to="">
              {profileDetails?.lastUpdatedBy || 'n/a'}
            </Link>
            <div>
              on {moment(profileDetails?.updatedAt).format('LL')} at{' '}
              {moment(profileDetails?.updatedAt).format('LT')}
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default connect(() => ({}))(ProductUpdateDetails);
