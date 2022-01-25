import { Divider, message, Popconfirm, Table } from 'antd';
import React, { useEffect } from 'react';
import { connect, useParams } from 'umi';
import { DeleteOutlined } from '@ant-design/icons';
import CheckValidation from '@/components/CheckValidation';
import EmptyStateContainer from '@/components/EmptyStateContainer';

const AllStaffClasses = ({ staffDetails, dispatch, getStaffDetail }) => {
  const { staffId } = useParams();

  useEffect(() => {
    dispatch({
      type: 'staff/getStaffDetails',
      payload: {
        staffId,
      },
    });
  }, []);
  const deleteClass = (classId, sectionId, subjectId) => {
    dispatch({
      type: 'staff/deleteStaffClassAssociation',
      payload: {
        staffId: staffDetails.id,
        body: {
          teacher_class_subject_detail: [
            { class_id: classId, section_id: sectionId, subject_id: subjectId },
          ],
        },
      },
    }).then((res) => {
      if (res) {
        message.success('Class deleted successfully!');
        getStaffDetail();
      }
    });
  };

  const Columns = [
    {
      title: 'Sr. No.',
      dataIndex: 'srno',
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Class',
      dataIndex: 'classDetails',
      align: 'center',
      render: (val, classDetails) => classDetails.classDetails.name,
    },
    {
      title: 'Section',
      dataIndex: 'sectionDetails',
      align: 'center',
      render: (val, classDetails) => classDetails.sectionDetails.name,
    },
    {
      title: 'Subject',
      dataIndex: 'subjectDetails',
      align: 'center',
      render: (val, classDetails) => classDetails.subjectDetails.name,
    },
    {
      title: 'Action',
      align: 'center',
      render: (classDetails) => (
        <>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure you want to delete this class?"
            onConfirm={() =>
              deleteClass(
                classDetails.classDetails.id,
                classDetails.sectionDetails.id,
                classDetails.subjectDetails.id,
              )
            }
            okText="Delete"
            cancelText="Cancel"
            okType="danger"
          >
            <a className="text-red-600 hover:text-red-700">
              <DeleteOutlined />
              Delete
            </a>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <CheckValidation
      show={staffDetails?.length > 0}
      fallback={<EmptyStateContainer type="class" />}
    >
      <Table
        columns={Columns}
        dataSource={staffDetails?.teacher_class_details}
        rowKey={(classDetails) =>
          `${classDetails.subjectDetails.id} +
        ${classDetails.sectionDetails.id} +
        ${classDetails.classDetails.id}`
        }
      />
    </CheckValidation>
  );
};

export default connect(({ staff }) => ({
  staffDetails: staff.staffDetails,
}))(AllStaffClasses);
