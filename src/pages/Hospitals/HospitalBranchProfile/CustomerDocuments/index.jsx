import {
  CaretRightOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Button, Col, Collapse, Divider, Popconfirm, message, Tooltip } from 'antd';
import PNG from '@/assets/file-types/png_doc.svg';
import PDF from '@/assets/file-types/pdf_doc.svg';
import moment from 'moment';
import style from './index.less';
import { useEffect, useState } from 'react';
import UpdateDocuments from '../UpdateDocuments';
import AppModal from '@/components/AppModal';
import { queryClient } from '@/layouts/SecurityLayout';
import { useParams, connect } from 'umi';
import { useDeleteCustomerContents } from '@/query/useMutateCustomer';
import { useGetContents } from '@/query/useCustomer';
import CheckValidation from '@/components/CheckValidation';

const { Panel } = Collapse;

const CustomerDocuments = ({ customer, refetchCustomer, currentUser }) => {
  const [isDocumentsVisible, setIsDocumentsVisible] = useState(false);
  const [documentInfo, setDocumentInfo] = useState('');
  const [isModalDisplay, setIsModalDisplay] = useState(false);
  const [viewDocInfo, setViewDocInfo] = useState('');
  const { profileId } = useParams();
  const updateCustomer = useDeleteCustomerContents();
  const [panelKey, setPanelKey] = useState('');

  const customerContents = useGetContents({
    pathParams: {
      customerId: profileId
        ? profileId
        : currentUser?.personal_details?.organizationDetails?.orgPartyId,
    },
  });
  const { refetch, isRefetching, data } = customerContents;

  const { panNumber: panValue, gstNumber: gstValue, documentName: otherDocValue } = customer || {};

  const { contents } = data || { contents: [] };

  const onDeleteContents = (contentId) => {
    updateCustomer
      ?.mutateAsync({
        pathParams: {
          partyId: profileId
            ? profileId
            : currentUser?.personal_details?.organizationDetails?.orgPartyId,
          contentId,
        },
      })
      .then((res) => {
        if (res?.responseMessage === 'success') {
          message.success(`You have deleted your document successfully`);
          refetch();
        } else {
          message.error('Something went wrong!');
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

                  <div className="flex flex-col-reverse justify-around">
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
            <CheckValidation show={isRefetching}>
              <div className="text-center p-10">
                <SyncOutlined spin style={{ color: 'rgb(124 58 237)', fontSize: '1.125rem' }} />
              </div>
            </CheckValidation>
          </div>
        </Col>
      )
    );
  };
  return (
    <div className={`bg-white shadow rounded ${style?.styleDocuments}`}>
      <div className="bg-white rounded p-4 font-bold text-blue-900 text-md border-b">Documents</div>
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        className="site-collapse-custom-collapse"
        activeKey={panelKey}
      >
        <Panel
          header={
            <div
              className="flex justify-between w-full"
              onClick={() => (panelKey === '1' ? setPanelKey('') : setPanelKey('1'))}
            >
              <div className="inline">
                <p className="text-sm text-gray-600 uppercase m-0 inline ">
                  Permanent Account Number
                </p>
                <p className="font-semibold text-black m-0">{panValue || ''}</p>
              </div>
              <Tooltip title={`Edit ${''} PAN Details`}>
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    setDocumentInfo({
                      typeId: 'PAN_CARD',
                      formName: 'panNumber',
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
            <div
              className="flex justify-between w-full"
              onClick={() => (panelKey === '2' ? setPanelKey('') : setPanelKey('2'))}
            >
              <div className="inline">
                <p className="text-sm text-gray-600 uppercase m-0 inline ">GST</p>
                <p className="font-semibold text-black m-0">{gstValue || ''}</p>
              </div>
              <Tooltip title={`Edit GST Details`}>
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    setDocumentInfo({
                      typeId: 'GST_NUM',
                      formName: 'gstNumber',
                      label: 'GST number',
                      value: gstValue,
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
            <div
              className="flex justify-between w-full"
              onClick={() => (panelKey === '3' ? setPanelKey('') : setPanelKey('3'))}
            >
              <div className="inline">
                <p className="text-sm text-gray-600 uppercase m-0 inline ">Other Documents</p>
                <p className="font-semibold text-black m-0">{otherDocValue || ''}</p>
              </div>
              <Tooltip title={`Edit ${''} Other Documents`}>
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    setDocumentInfo({
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
      <UpdateDocuments
        isDocumentsVisible={isDocumentsVisible}
        setIsDocumentsVisible={setIsDocumentsVisible}
        documentInfo={documentInfo}
        setDocumentInfo={setDocumentInfo}
        refetchCustomer={refetchCustomer}
        refetch={refetch}
        setPanelKey={setPanelKey}
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

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser,
});

export default connect(mapStateToProps)(CustomerDocuments);
