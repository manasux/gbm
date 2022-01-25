/* eslint-disable react-hooks/exhaustive-deps */
import { Tabs, Button, Modal, Carousel, Form, message } from 'antd';

import { connect } from 'umi';
import React, { useState, useEffect, useRef } from 'react';
import {
  CarryOutOutlined,
  FormOutlined,
  LeftOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import CheckValidation from '@/components/CheckValidation';
import StaffClassSection from './StaffClassSection';
import StaffClassSubject from './StaffClassSubjects';
import AllStaffClasses from './StaffClassTable';

const { TabPane } = Tabs;

const selectionSteps = ['class', 'subject', 'section'];

const StaffClassDetails = ({
  dispatch,
  allClassesList,
  staffDetails,
  getStaffDetail,
  updateClassLoading,
}) => {
  const getAllClasses = () => {
    dispatch({
      type: 'classes/getAllClasses',
    });
  };
  useEffect(() => {
    getAllClasses();
  }, []);
  const [subjects, setSubject] = useState('');
  const [sections, setSections] = useState('');
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [visible, setVisible] = useState(false);
  const [showFooter, setShowFooter] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const cars = useRef();
  const [form] = Form.useForm();
  const onFinish = () => {
    dispatch({
      type: 'staff/staffClassAssociation',
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
        message.success('Staff Member class details updated successfully!');
        setVisible(false);
        getStaffDetail();
      }
    });
  };

  const Footer = () => {
    return (
      <div className="flex justify-end">
        <div>
          <Button
            type="link"
            onClick={() => {
              setVisible(false);
            }}
          >
            Cancel
          </Button>
        </div>
        <div>
          <Button
            onClick={() => {
              form.submit();
            }}
            type="primary"
            loading={updateClassLoading}
          >
            Update
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded">
      <Tabs defaultActiveKey="CLASSES" className="">
        <TabPane
          tab={
            <span className="px-4">
              <span>
                <FormOutlined />
              </span>
              <span>Classes</span>
            </span>
          }
          key="CLASSES"
        >
          <div className="flex justify-end">
            <Button
              icon={<PlusSquareOutlined />}
              type="primary"
              onClick={() => {
                setVisible(true);
              }}
            >
              Add Classes
            </Button>
          </div>
          <Modal
            maskClosable={false}
            title={
              <div className="flex items-center">
                <CheckValidation show={selectionSteps[currentStep] !== 'class'}>
                  <LeftOutlined
                    className="mr-4"
                    onClick={() => {
                      cars?.current?.slick?.slickPrev();
                      setShowFooter(false);
                      setCurrentStep((prev) => prev - 1);
                      switch (selectionSteps[currentStep]) {
                        case 'section':
                          return setSubjectId('');
                        case 'subject':
                          return setSectionId('');
                        default:
                          return null;
                      }
                    }}
                  />
                </CheckValidation>
                <span>Assign Class to {staffDetails?.display_name}</span>
              </div>
            }
            onCancel={() => {
              setCurrentStep('class');
              setVisible(false);
            }}
            visible={visible}
            footer={showFooter && Footer()}
            bodyStyle={{ padding: 0 }}
          >
            <Carousel ref={cars} dots={false}>
              <div className="bg-white rounded">
                {allClassesList?.map((classList) => (
                  <div
                    key={classList.id}
                    style={{
                      borderRight: classId === classList.id ? '6px solid #005be7' : 'none',
                      borderLeft: classId === classList.id ? '6px solid #005be7' : 'none',
                    }}
                    className="flex items-center justify-between border-b p-4 cursor-pointer"
                    onClick={() => {
                      setCurrentStep((prev) => prev + 1);
                      cars?.current?.slick?.slickNext();
                      setSections(classList.sections);
                      setSubject(classList.subjects);
                      setClassId(classList.id);
                      setShowFooter(null);
                    }}
                  >
                    <div className="flex items-center text-xl cursor-pointer w-full">
                      <span className="bg-gray-200 px-3 py-2 rounded-full">
                        <CarryOutOutlined />
                      </span>
                      <div className="text-blue-900 ml-4 font-medium text-lg">
                        {classList?.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div
                // className="cursor-pointer"
                onClick={() => {
                  setCurrentStep((prev) => prev + 1);
                  cars?.current?.slick?.slickNext();
                  setShowFooter(null);
                }}
              >
                <StaffClassSection
                  sections={sections}
                  setSectionId={setSectionId}
                  sectionId={sectionId}
                />
              </div>
              <div>
                <Form onFinish={onFinish} form={form}>
                  <StaffClassSubject
                    subjectId={subjectId}
                    subjects={subjects}
                    setShowFooter={setShowFooter}
                    setSubjectId={setSubjectId}
                  />
                </Form>
              </div>
            </Carousel>
          </Modal>
          <AllStaffClasses {...{ getStaffDetail }} />
        </TabPane>
      </Tabs>
    </div>
  );
};

<span style={{ paddingRight: '10px' }}>
  <span>
    <FormOutlined />
  </span>{' '}
  <span>Tasks</span>
</span>;

export default connect(({ classes, staff, loading }) => ({
  updateClassLoading: loading.effects['staff/staffClassAssociation'],
  staffDetails: staff.staffDetails,
  allClassesList: classes?.allClassesList,
}))(StaffClassDetails);
