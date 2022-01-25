import { CaretRightOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Divider, Popconfirm, Tooltip, message } from 'antd';
import React, { useState } from 'react';
import PNG from '@/assets/file-types/png_doc.svg';
import PDF from '@/assets/file-types/pdf_doc.svg';
import moment from 'moment';
import style from './index.less';
import AppModal from '@/components/AppModal';
import UpdateStaffDocuments from '../../component/UpdateStaffDocuments';
import { useDeleteStaffContents } from '@/query/useMutateStaff';
import { useGetContents } from '@/query/useStaff';
import UpdateOrgDocuments from '../../component/UpdateOrgDocuments';

const { Panel } = Collapse;

const OrganizationDocuments = ({ partyType, info, refetchStaff }) => {
  const [isDocumentsVisible, setIsDocumentsVisible] = useState(false);
  const [documentInfo, setDocumentInfo] = useState('');
  const [updatedFileList, setUpdatedFileList] = useState([]);
  const [isModalDisplay, setIsModalDisplay] = useState(false);
  const [viewDocInfo, setViewDocInfo] = useState('');

  const { organization, partyAttributes } = info || {
    organization: '',
    partyAttributes: [],
  };

  const { attrValue: otherDocValue } = (partyAttributes &&
    partyAttributes?.find((item) => item?.attrName === 'OTHER_DOCUMENT')) || {
    attrValue: '',
  };

  const deleteStaffContent = useDeleteStaffContents();

  // Calling Query API to get Organization Contents
  const contentsRec = useGetContents(organization?.orgPartyId);
  const { data: contentsData, refetch: refetchStaffOrgContents } = contentsRec || {};
  const { contents } = contentsData || [];

  const onDeleteContents = (contentId) => {
    deleteStaffContent
      ?.mutateAsync({
        pathParams: { partyId: organization?.orgPartyId, contentId },
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
      case 'GST_NUM':
        return <p className="capitalize m-0">GST</p>;

      default:
        return <p className="capitalize m-0">{typeId?.replace('_', ' ')?.toLowerCase()}</p>;
    }
  };
  const fileSizeConvertor = (size) => {
    if (size && size / 1024 / 1024 > 0) {
      const newSize = (size / 1024 / 1024).toFixed(2);
      return `${newSize} MB`;
    }
    return null;
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
                        {moment(new Date().toISOString()).format('LL')} at{' '}
                        {moment(new Date().toISOString()).format('LT')} -{' '}
                        {fileSizeConvertor(info?.size)}
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
        Organization Documents
      </div>
      <Collapse
        bordered={false}
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
                <p className="font-semibold text-black m-0">{organization?.panCard || ''}</p>
              </div>
              <Tooltip title={`Edit ${partyType} PAN Details`}>
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    setDocumentInfo({
                      partyType: `${partyType} Organization`,
                      partyId: organization?.orgPartyId,
                      typeId: 'PAN_CARD',
                      formName: 'panCard',
                      label: 'Pan number',
                      value: organization?.panCard,
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
                <p className="text-sm text-gray-600 uppercase m-0 inline ">GST Number</p>
                <p className="font-semibold text-black m-0">{organization?.gstNum || ''}</p>
              </div>
              <Tooltip title={`Edit ${partyType} GST Details`}>
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    setDocumentInfo({
                      partyType: `${partyType} Organization`,
                      partyId: organization?.orgPartyId,
                      typeId: 'GST_NUM',
                      formName: 'gstNum',
                      label: 'GST number',
                      value: organization?.gstNum,
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
          {getDocuments(contents?.filter((item) => item?.contentTypeId === 'GST_NUM'))}
        </Panel>
        <Panel
          header={
            <div className="flex justify-between w-full">
              <div className="inline">
                <p className="text-sm text-gray-600 uppercase m-0 inline ">Other Documents</p>
                <p className="font-semibold text-black m-0">{otherDocValue || 'n/a'}</p>
              </div>
              <Tooltip title={`Edit ${partyType} Other Documents`}>
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    setDocumentInfo({
                      partyType: `${partyType} Organization`,
                      partyId: organization?.orgPartyId,
                      typeId: 'OTHER_DOCUMENT',
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
      <UpdateOrgDocuments
        isDocumentsVisible={isDocumentsVisible}
        setIsDocumentsVisible={setIsDocumentsVisible}
        documentInfo={documentInfo}
        setDocumentInfo={setDocumentInfo}
        updatedFileList={updatedFileList}
        setUpdatedFileList={setUpdatedFileList}
        refetchStaff={refetchStaff}
        refetchStaffOrgContents={refetchStaffOrgContents}
      />
      <AppModal
        showModal={isModalDisplay}
        setViewDocInfo={setViewDocInfo}
        titleName={<div className="capitalize">{viewDocInfo?.name}</div>}
        subtitle={
          <div className="">
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
        <div style={{ width: '60vw', height: '60vh', overflow: 'auto' }}>
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

export default OrganizationDocuments;
