import React from 'react';
import { Popover, Avatar } from 'antd';
import { getInitials } from '@/utils/common';
import styles from './index.less';

/**
 * @AvatarHoverViewRest - The purpose of this component to display assignees
 *
 */
const AvatarHoverViewRest = ({ children, assignees, title }) => {
  return (
    <Popover
      overlayClassName={styles.AssigneeHover}
      placement="topRight"
      content={
        <div className="w-64">
          <div className={styles.PopoverTitle}>
            <div>{title || 'Task assignees'}</div>
          </div>
          <div className={styles.PopoverBody}>
            {assignees?.map((profileData) => (
              <div className="flex p-2 hover:bg-gray-200 border-b ">
                <div>
                  <Avatar className={styles.AvatarBg}>
                    {getInitials(profileData?.assigneePartyName)}
                  </Avatar>
                </div>

                <div className="pl-2">
                  <div className="">
                    <div>{profileData?.assigneePartyName}</div>
                    <div>{profileData?.phoneNumber}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      {children}
    </Popover>
  );
};

export default AvatarHoverViewRest;
