import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import RequestTable from './RequestTable';

const RequestList = (props) => {
  const { requestList, dispatch } = props;
  const [acceptedKeyword, setAcceptedKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);

  useEffect(() => {
    dispatch({
      type: 'request/getallrequests',
      payload: {
        query: {
          view_size: viewSize,
          start_index: startIndex,
          keyword: acceptedKeyword,
        },
      },
    });
  }, [viewSize, startIndex, acceptedKeyword]);

  return (
    <div className="container mx-auto">
      <Page
        title="Requests"
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'All Requests',
                path: '/requests/all',
              },
            ]}
          />
        }
      >
        <div className="bg-white shadow rounded">
          <RequestTable
            viewSize={viewSize}
            totalRecords={requestList}
            currentPage={currentPage}
            setViewSize={setViewSize}
            setCurrentPage={setCurrentPage}
            setStartIndex={setStartIndex}
            setKeyword={setAcceptedKeyword}
          />
        </div>
      </Page>
    </div>
  );
};
export default connect(({ request }) => ({
  requestList: request.requestList,
}))(RequestList);
