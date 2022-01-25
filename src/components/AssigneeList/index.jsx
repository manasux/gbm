import React from 'react';
import { Avatar, Button } from 'antd';
import { getInitials } from '@/utils/common';
import AvatarHoverView from '../AvatarHoverView';
import styles from './index.less';
import AvatarHoverViewRest from '../AvatarHoverViewRest';

const AssigneeList = ({ assignees, setEditAssignees, taskData }) => {
  return (
    <div className=" rounded border-2 border-gray-200 bg-white">
      <div className="border-b p-4">
        <div>
          <span className="font-medium">Assignees</span>
        </div>
      </div>
      <div className="text-xs text-gray-500 p-2">
        <span>Add assignees here. They can view and edit the task.</span>
      </div>
      <div className="p-4 justify-center flex">
        <Avatar.Group>
          {assignees?.slice(0, 10)?.map((user) => (
            <AvatarHoverView
              profile={{
                id: user.assigneePartyId,
                name: user.assigneePartyName,
                phone: user.phoneNumber,
              }}
            >
              <Avatar className={styles.ProjectMemberAvatar}>
                {getInitials(user.assigneePartyName)}
              </Avatar>
            </AvatarHoverView>
          ))}

          {assignees && assignees?.length > 10 && (
            <AvatarHoverViewRest
              title={`Task assignees (${assignees?.length - 10})`}
              assignees={assignees.slice(10, assignees.length)}
            >
              <Avatar className={styles.PlustextAvatar}>+{assignees.length - 10}</Avatar>
            </AvatarHoverViewRest>
          )}
        </Avatar.Group>
      </div>
      <div className="p-4">
        <Button
          onClick={() => {
            setEditAssignees({
              visible: true,
              assigneeList: taskData?.assignee_list,
            });
          }}
          type="primary"
          block
        >
          Add assignees
        </Button>
      </div>
    </div>
  );
};

export default AssigneeList;
