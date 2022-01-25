import React from 'react';
import { Popover, Avatar } from 'antd';
import { getInitials } from '@/utils/common';
import styles from './styles.less';

/**
 *
 * @AvatarHoverView - The purpose of this component to display more details
 * of assignee on hover of avatar.
 */

const AvatarHoverView = ({ profile, children }) => {
  return (
    <Popover
      overlayClassName={styles.AssigneeHover}
      content={
        <div className="p-3 flex items-center self-start cursor-pointer">
          <Avatar size={40} className={styles.AvatarBg}>
            {/* display initials of assignee */}
            {getInitials(profile.name)}
          </Avatar>
          <div className="ml-2">
            <div className="text-gray-900 text-sm font-normal">{profile.name}</div>
            <div className="text-gray-600 mt-1 text-xs">{profile.phone}</div>
          </div>
        </div>
      }
    >
      {children}
    </Popover>
  );
};

export default AvatarHoverView;
