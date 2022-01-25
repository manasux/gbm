import { CaretRightOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Divider, Popconfirm, message, Tooltip } from 'antd';
import PNG from '@/assets/file-types/png_doc.svg';
import PDF from '@/assets/file-types/pdf_doc.svg';
import moment from 'moment';
import style from './index.less';
import { useEffect, useState } from 'react';
import UpdateStaffDocuments from '../../component/UpdateStaffDocuments';
import AppModal from '@/components/AppModal';
import { queryClient } from '@/layouts/SecurityLayout';
import { useParams } from 'umi';
import { useDeleteStaffContents } from '@/query/useMutateStaff';

const { Panel } = Collapse;

const StaffDocuments = ({ partyType, info, refetchStaff, refetchStaffContents }) => {
  const [isDocumentsVisible, setIsDocumentsVisible] = useState(false);
  const [documentInfo, setDocumentInfo] = useState('');
  const [updatedFileList, setUpdatedFileList] = useState([]);
  const { partyIdentifications, partyAttributes } = info || {
    partyIdentifications: '',
    partyAttributes: '',
  };
  const [isModalDisplay, setIsModalDisplay] = useState(false);
  const [viewDocInfo, setViewDocInfo] = useState('');
  const { profileId } = useParams();
  const deleteStaffContent = useDeleteStaffContents();

  const contentRec = queryClient.getQueryData(['contents', profileId]);
  const { contents } = contentRec || [];

  const onDeleteContents = (contentId) => {
    deleteStaffContent
      ?.mutateAsync({
        pathParams: { partyId: profileId, contentId },
      })
      .then((res) => {
        if (res?.responseMessage === 'success') {
          message?.success('You have successfully deleted your content!');
        } else {
          message?.error('Oops! Something went wrong!');
        }
      });
  };

  const getDocumentName = (typeId) => {
    switch (typeId) {
      case 'OTHER_DOCUMENT':
        return <p className="capitalize m-0">Other document</p>;

      default:
        return <p className="capitalize m-0">{typeId?.replace('_', ' ')?.toLowerCase()}</p>;
    }
  };

  const { partyIdentificationTypeId: panID, value: panValue } = (partyIdentifications &&
    partyIdentifications?.find((item) => item?.partyIdentificationTypeId === 'PAN_CARD')) || {
    partyIdentificationTypeId: '',
    value: '',
  };

  const { partyIdentificationTypeId: aadharID, value: aadharValue } = (partyIdentifications &&
    partyIdentifications?.find((item) => item?.partyIdentificationTypeId === 'AADHAAR_CARD')) || {
    partyIdentificationTypeId: '',
    value: '',
  };

  const { attrName: otherDocID, attrValue: otherDocValue } = (partyAttributes &&
    partyAttributes?.find((item) => item?.attrName === 'OTHER_DOCUMENT')) || {
    attrName: '',
    attrValue: '',
  };

  const getDocuments = (documents) => {
    return (
      documents?.length > 0 && (
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <div className="mt-4">
            {documents?.map((info, index) => (
              <div key={info?.uid}>
                {index !== 0 && <Divider />}

                <div className="w-full flex justify-between mt-4 ">
                  <div className="flex">
                    <div className="">
                      <img src={info?.type?.includes('pdf') ? PDF : PNG} alt="PNG" />
                    </div>
                    <div className=" mx-6 ">
                      <div className="text-blue-900 text-md font-semibold">{info?.name}</div>
                      <div className="capitalize text-blue-800">
                        {getDocumentName(info?.contentTypeId)}
                      </div>
                      <div className="text-gray-600 font-normal text-xs">
                        {moment(info?.createdDate).format('LL') || ''} at{' '}
                        {moment(info?.createdDate).format('LT') || ''}
                      </div>
                      <div className="capitalize text-blue-800">
                        File size: {info?.formattedFileSize}
                      </div>

                      <div className="text-blue-800 font-semibold text-xs">
                        Uploaded by <span className="underline">{info?.createdBy || 'n/a'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex mx-2 " style={{ float: 'right' }}>
                    <div className={`mx-2`}>
                      {' '}
                      <Popconfirm
                        title="Are you sure you want to delete this attachment?"
                        onConfirm={() => onDeleteContents(info?.id)}
                        okText="Delete"
                        cancelText="Cancel"
                        okType="danger"
                      >
                        <Button type="danger" shape="circle" size="small">
                          <DeleteOutlined />
                        </Button>
                      </Popconfirm>
                    </div>

                    <Button
                      type="primary"
                      shape="circle"
                      size="small"
                      onClick={() => {
                        setViewDocInfo(info);
                        setIsModalDisplay(true);
                      }}
                    >
                      <EyeOutlined />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Col>
      )
    );
  };
  return (
    <div className={`bg-white shadow ${style?.styleDocuments}`}>
      <div className="bg-white rounded p-4 font-bold text-blue-900 text-md border-b">
        {partyType} Documents
      </div>
      <Collapse
        bordered={false}
        accordion
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        className="site-collapse-custom-collapse"
      >
        <Panel
          header={
            <div className="flex justify-between w-full">
              <div className="inline">
                <p className="text-sm text-gray-600 uppercase m-0 inline ">
                  Permanent Account Number
                </p>
                <p className="font-semibold text-black m-0">{panValue || ''}</p>
              </div>
              <Tooltip title={`Edit ${partyType} PAN Details`}>
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    setDocumentInfo({
                      partyType,
                      typeId: panID,
                      formName: 'panCard',
                      label: 'Pan number',
                      value: panValue,
                    });
                    setIsDocumentsVisible(true);
                  }}
                  className={` text-blue-700 font-semibold hover:font-bold border-blue-600 p-2`}
                  style={{ color: '#3182ce' }}
                />
              </Tooltip>
            </div>
          }
          key="1"
          className="site-collapse-custom-panel"
        >
          {getDocuments(contents?.filter((item) => item?.contentTypeId === 'PAN_CARD'))}
        </Panel>
        <Panel
          header={
            <div className="flex justify-between w-full">
              <div className="inline">
                <p className="text-sm text-gray-600 uppercase m-0 inline ">Aadhar Number</p>
                <p className="font-semibold text-black m-0">{aadharValue || ''}</p>
              </div>
              <Tooltip title={`Edit ${partyType} Aadhar Details`}>
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    setDocumentInfo({
                      partyType,
                      typeId: aadharID,
                      formName: 'aadharCard',
                      label: 'Aadhar number',
                      value: aadharValue,
                    });
                    setIsDocumentsVisible(true);
                  }}
                  className={` text-blue-700 font-semibold hover:font-bold border-blue-600 p-2`}
                  style={{ color: '#3182ce' }}
                />
              </Tooltip>
            </div>
          }
          key="2"
          className="site-collapse-custom-panel"
        >
          {getDocuments(contents?.filter((item) => item?.contentTypeId === 'AADHAAR_CARD'))}
        </Panel>
        <Panel
          header={
            <div className="flex justify-between w-full">
              <div className="inline">
                <p className="text-sm text-gray-600 uppercase m-0 inline ">Other Documents</p>
                <p className="font-semibold text-black m-0">{otherDocValue || ''}</p>
              </div>
              <Tooltip title={`Edit ${partyType} Other Documents`}>
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    setDocumentInfo({
                      partyType,
                      typeId: otherDocID,
                      formName: 'documentName',
                      label: 'Other document',
                      value: otherDocValue,
                    });
                    setIsDocumentsVisible(true);
                  }}
                  className={` text-blue-700 font-semibold hover:font-bold border-blue-600 p-2`}
                  style={{ color: '#3182ce' }}
                />
              </Tooltip>
            </div>
          }
          key="3"
          className="site-collapse-custom-panel"
        >
          {getDocuments(contents?.filter((item) => item?.contentTypeId === 'OTHER_DOCUMENT'))}
        </Panel>
      </Collapse>
      <UpdateStaffDocuments
        isDocumentsVisible={isDocumentsVisible}
        setIsDocumentsVisible={setIsDocumentsVisible}
        documentInfo={documentInfo}
        setDocumentInfo={setDocumentInfo}
        updatedFileList={updatedFileList}
        setUpdatedFileList={setUpdatedFileList}
        refetchStaff={refetchStaff}
        refetchStaffContents={refetchStaffContents}
      />

      <AppModal
        showModal={isModalDisplay}
        setViewDocInfo={setViewDocInfo}
        titleName={<div className="capitalize">{viewDocInfo?.name}</div>}
        subtitle={
          <div>
            {moment(viewDocInfo?.createdDate).format('LL')} at{' '}
            {moment(viewDocInfo?.createdDate).format('LT')}
          </div>
        }
        setShowModal={setIsModalDisplay}
        footer={
          <div className="text-blue-500 font-semibold text-xs">
            Uploaded by <span className="underline">{viewDocInfo?.createdBy}</span>
          </div>
        }
        width={null}
      >
        <div style={{ width: '60vw', height: '60vh' }}>
          <iframe
            width="100%"
            height="100vh"
            title="Documents Preview"
            src={viewDocInfo?.downloadUrl}
            className="h-full"
            frameBorder="0"
          />
        </div>
      </AppModal>
    </div>
  );
};

export default StaffDocuments;
