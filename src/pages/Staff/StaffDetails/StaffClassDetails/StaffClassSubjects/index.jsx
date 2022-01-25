import { connect } from 'umi';
import React from 'react';
import { CarryOutOutlined, FormOutlined } from '@ant-design/icons';

const StaffClassSubject = ({ subjects, subjectId, setShowFooter, setSubjectId }) => {
  return (
    <div className="bg-white shadow rounded">
      {subjects &&
        subjects?.map((subject) => (
          <div
            key={subject.id}
            className="flex items-center justify-between border-b p-4 cursor-pointer"
            style={{
              borderRight: subjectId === subject.id ? '6px solid #005be7' : 'none',
              borderLeft: subjectId === subject.id ? '6px solid #005be7' : 'none',
            }}
            onClick={() => {
              setShowFooter(true);
              setSubjectId(subject.id);
            }}
          >
            <div className="flex items-center text-xl">
              <span className="bg-gray-200 px-3 py-2 rounded-full">
                <CarryOutOutlined />
              </span>
              <div className="text-blue-900 ml-4 font-medium text-lg">{subject?.name}</div>
            </div>
          </div>
        ))}
    </div>
  );
};

<span style={{ paddingRight: '10px' }}>
  <span>
    <FormOutlined />
  </span>{' '}
  <span>Tasks</span>
</span>;

export default connect(({ classes }) => ({
  classInfo: classes.classInfo,
}))(StaffClassSubject);
