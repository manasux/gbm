import React from 'react';
import { Avatar } from 'antd';
import { getInitials } from '@/utils/common';
import AvatarHoverView from '../AvatarHoverView';

const AssigneeList = ({ assignees }) => {
  return (
    <>
      {assignees?.map((item) => (
        <AvatarHoverView
          profile={{
            id: item.assigneePartyId,
            name: item.assigneePartyName,
            phone: item.phoneNumber,
          }}
        >
          <span className="m-1">
            <Avatar
              className="mr-1"
              style={{
                backgroundColor: '#1c9cff',
              }}
            >
              {getInitials(item?.assigneePartyName)}
            </Avatar>
          </span>
        </AvatarHoverView>
      ))}
    </>
  );
};

export default AssigneeList;
