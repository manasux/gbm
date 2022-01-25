import { connect } from 'dva';
import React from 'react';
import logo from '@/assets/logo/sidebar_logo.png';
import styles from './index.less';

function BusinessLogo({ currentUser }) {
  return (
    <div className="h-32 flex items-center min-w-max">
      <div>
        <img
          className="h-16 w-full"
          src={currentUser?.personal_details?.organizationDetails?.logoImageUrl || logo}
          alt="image"
        />
      </div>
      <div className="text-base text-center font-medium text-gray-700 pl-2">
        {currentUser?.personal_details?.organizationDetails?.organizationName}
      </div>
    </div>
  );
}

const mapstateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapstateToProps, (dispatch) => ({ dispatch }))(BusinessLogo);
