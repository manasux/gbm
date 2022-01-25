import { connect } from 'umi';
import React from 'react';
import { CarryOutOutlined, FormOutlined } from '@ant-design/icons';

const StaffClassSection = ({ sections, sectionId, setSectionId }) => {
  return (
    <div className="bg-white shadow rounded cursor-pointer">
      {sections &&
        sections?.map((section) => (
          <div
            style={{
              borderRight: sectionId === section.id ? '6px solid #005be7' : 'none',
              borderLeft: sectionId === section.id ? '6px solid #005be7' : 'none',
            }}
            key={section.id}
            className="flex items-center justify-between border-b p-4"
            onClick={() => setSectionId(section.id)}
          >
            <div className="flex items-center text-xl">
              <span className="bg-gray-200 px-3 py-2 rounded-full">
                <CarryOutOutlined />
              </span>
              <div className="text-blue-900 ml-4 font-medium text-lg">{section?.name}</div>
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
}))(StaffClassSection);
