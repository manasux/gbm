import { getInitials } from '@/utils/common';
import React from 'react';
import moment from 'moment';
import { DeleteOutlined, FormOutlined } from '@ant-design/icons';
import { Avatar, Button, Popconfirm } from 'antd';
import EmptyStateContainer from '../EmptyStateContainer';
import CheckValidation from '../CheckValidation';
import styles from './index.less';
import TruncateText from '../TruncateText';

const ViewNotes = ({ teacherTaskNotes, deleteNotes, setEditNoteModal, setAddNoteModalVisible }) => {
  return (
    <div className="bg-white shadow">
      <div className=" p-2 flex justify-between border-b">
        <div className="pt-1 text-base font-semibold">Notes</div>
        <CheckValidation show={teacherTaskNotes?.length > 0}>
          <div className="pr-2 pt-1">
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setAddNoteModalVisible(true);
              }}
            >
              Add Note
            </Button>
          </div>
        </CheckValidation>
      </div>
      <CheckValidation
        show={teacherTaskNotes?.length > 0}
        fallback={
          <EmptyStateContainer
            type="notes"
            showAddButton
            onButtonClick={() => setAddNoteModalVisible(true)}
          />
        }
      >
        {teacherTaskNotes.map((item) => (
          <div className={`${styles.TaskNotesView} flex border-0 border-b shadow-xs p-3`}>
            <div>
              <Avatar
                style={{
                  background: '#1c9cff',
                }}
              >
                {getInitials(item.displayName)}
              </Avatar>
            </div>
            <div className="w-full ml-2">
              <div className="flex justify-between mb-1">
                <div>
                  <span>
                    <span className="text-blue-700 text-sm capitalize">{item.displayName}</span>
                    <span className="text-gray-700 text-xs font-semibold">
                      added a note {moment(item.noteDateTime).fromNow()}
                    </span>
                  </span>
                </div>
                <div className={`${styles.ActionButtons} text-xs flex mr-2`}>
                  <div
                    id="EditNoteModalVisible"
                    onClick={() =>
                      setEditNoteModal({
                        visible: true,
                        note: item.noteInfo,
                        noteId: item.taskNoteId,
                      })
                    }
                    className="cursor-pointer text-blue-600"
                  >
                    <FormOutlined /> Edit
                  </div>
                  <Popconfirm
                    title="Are you sure you want to delete this note?"
                    onConfirm={() => deleteNotes(item.taskNoteId)}
                    onCancel={() => {}}
                    cancelText="Cancel"
                    okText="Delete"
                    okType="danger"
                    okButtonProps={{
                      id: 'Confirm-Remove',
                    }}
                  >
                    <div id="DeleteButton" className="cursor-pointer ml-3 text-red-600">
                      <DeleteOutlined /> Delete
                    </div>
                  </Popconfirm>
                </div>
              </div>
              <TruncateText
                lines="2"
                dangerouslySetInnerHTML
                buttonPosition="right"
                charCountForNotShowingButtons={180}
                className="text-xs font-normal "
              >
                {item.noteInfo}
              </TruncateText>
            </div>
          </div>
        ))}
      </CheckValidation>
    </div>
  );
};

export default ViewNotes;
