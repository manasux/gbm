import React, { useState, useEffect } from 'react';
import { history, connect, useParams } from 'umi';
import { Badge, Button, Card, Col, Row } from 'antd';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';

const { Meta } = Card;

const HospitalStats = ({
  currentUser,
  totalCount,
  totalCountPMS,
  totalCountBranches,
  dispatch,
}) => {
  const { profileId } = useParams();

  console.log(profileId);
  useEffect(() => {
    dispatch({
      type: 'product/getTotalBranchStats',
      payload: {
        pathParams: {
          branchId: profileId
            ? profileId
            : currentUser?.personal_details?.organizationDetails?.orgPartyId,
        },
      },
    });
  }, []);

  console.log(totalCountBranches?.stats?.complaintsCount);

  return (
    <div className="mx-12">
      <Page
        title="Branch Statistics"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Branches',
                path: '/branches/all',
              },
              {
                name: 'Statistics',
                path: `/branches/stats/${currentUser?.id}`,
              },
            ]}
          />
        }
      >
        {/* TODO: Complaints */}
        <div className="bg-white p-1 px-3 rounded-lg shadow">
          <div className="flex justify-between mt-2 mb-2">
            <span className="px-4 font-semibold font-bold">
              <Badge size="small" offset={[10, 0]}>
                Complaints
              </Badge>
            </span>
            <Button
              type="primary"
              onClick={(event) => {
                event.stopPropagation();
                history.push(`/complaints/all`);
              }}
            >
              View Complaints
            </Button>
          </div>
          <div className="site-card-wrapper mt-5 mb-5">
            <Row gutter={16}>
              <Col span={6}>
                <Card
                  title="Open"
                  size="small"
                  style={{
                    textAlign: 'center',
                    backgroundImage: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
                  }}
                >
                  <p className="font-bold">
                    {totalCountBranches?.stats?.complaintsCount?.CRQ_OPEN}
                  </p>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  size="small"
                  title="In Progress"
                  style={{
                    textAlign: 'center',
                    backgroundImage:
                      'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
                  }}
                >
                  <p className="font-bold">
                    {totalCountBranches?.stats?.complaintsCount?.CRQ_INPROGRESS}
                  </p>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  size="small"
                  title="Hold"
                  style={{
                    textAlign: 'center',
                    backgroundImage: 'linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)',
                  }}
                >
                  <p className="font-bold">
                    {totalCountBranches?.stats?.complaintsCount?.CRQ_HOLD}
                  </p>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  size="small"
                  title="Closed"
                  style={{
                    textAlign: 'center',
                    backgroundImage: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
                  }}
                >
                  <p className="font-bold">
                    {totalCountBranches?.stats?.complaintsCount?.CRQ_CLOSED}
                  </p>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
        {/* TODO: PMS */}
        <div className="bg-white p-1 px-3 rounded-lg shadow mt-5">
          <div className="flex justify-between mt-2 mb-2">
            <span className="px-4 font-semibold font-bold">
              <Badge size="small" offset={[10, 0]}>
                PMS
              </Badge>
            </span>
            <Button
              type="primary"
              onClick={(event) => {
                event.stopPropagation();
                history.push(`/pms`);
              }}
            >
              View PMS
            </Button>
          </div>
          <div className="site-card-wrapper mt-5 mb-5">
            <Row gutter={16}>
              <Col span={6}>
                <Card
                  size="small"
                  title="All"
                  style={{
                    textAlign: 'center',
                    backgroundImage: 'linear-gradient(to right, #cfd9df 0%, #e2ebf0 100%)',
                  }}
                >
                  <p className="font-bold">{totalCountBranches?.stats?.pmsCount?.allCount}</p>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  size="small"
                  title="Overdue"
                  style={{
                    textAlign: 'center',
                    backgroundImage:
                      'linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%)',
                  }}
                >
                  <p className="font-bold">{totalCountBranches?.stats?.pmsCount?.overdueCount}</p>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  title="Upcoming"
                  size="small"
                  style={{
                    textAlign: 'center',
                    backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
                  }}
                >
                  <p className="font-bold">{totalCountBranches?.stats?.pmsCount?.upcomingCount}</p>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  title="Completed"
                  size="small"
                  style={{
                    textAlign: 'center',
                    backgroundImage: 'linear-gradient(to right, #96fbc4 0%, #f9f586 100%)',
                  }}
                >
                  <p className="font-bold">{totalCountBranches?.stats?.pmsCount?.completedCount}</p>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
        {/* TODO: Contracts */}
        <div className="bg-white p-1 px-3 rounded-lg shadow mt-5">
          <div className="flex justify-between mt-2 mb-2">
            <span className="px-4 font-semibold font-bold">
              <Badge size="small" offset={[10, 0]}>
                Contracts
              </Badge>
            </span>
            <Button
              type="primary"
              onClick={(event) => {
                event.stopPropagation();
                history.push(`/contracts`);
              }}
            >
              View Contracts
            </Button>
          </div>
          <div className="site-card-wrapper mt-5 mb-5">
            <Row gutter={16}>
              <Col span={12}>
                <Card
                  title="Out of Contract"
                  size="small"
                  style={{
                    textAlign: 'center',
                    backgroundImage: 'linear-gradient(to right, #88d3ce 0%, #6e45e2 100%)',
                  }}
                >
                  <p className="font-bold">
                    {totalCountBranches?.stats?.contractsCount?.expiredContracts}
                  </p>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title="Under Contract"
                  size="small"
                  style={{
                    textAlign: 'center',
                    backgroundImage: 'linear-gradient(to right, #d9afd9 0%, #97d9e1 100%)',
                  }}
                >
                  <p className="font-bold">
                    {totalCountBranches?.stats?.contractsCount?.activeContracts}
                  </p>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
        {/* TODO: Equipments */}
        <div className="bg-white p-1 px-3 rounded-lg shadow mt-5">
          <div className="flex justify-between mt-2 mb-2">
            <span className="px-4 font-semibold font-bold">
              <Badge size="small" offset={[10, 0]}>
                Equipments
              </Badge>
            </span>
            <Button
              type="primary"
              onClick={(event) => {
                event.stopPropagation();
                history.push(`/equipments/all`);
              }}
            >
              View Equipments
            </Button>
          </div>
          <div className="site-card-wrapper mt-5 mb-5">
            <Row gutter={16}>
              <Col span={8}>
                <Card
                  title="Approved"
                  size="small"
                  style={{
                    textAlign: 'center',
                    backgroundImage: 'linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)',
                  }}
                >
                  <p className="font-bold">{totalCountBranches?.stats?.verifiedProducts}</p>
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  size="small"
                  title="Pending"
                  style={{
                    textAlign: 'center',
                    backgroundImage: 'linear-gradient(60deg, #96deda 0%, #50c9c3 100%)',
                  }}
                >
                  <p className="font-bold">{totalCountBranches?.stats?.pendingProducts}</p>
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  title="Draft"
                  size="small"
                  style={{
                    textAlign: 'center',
                    backgroundImage: 'linear-gradient(to top, #c79081 0%, #dfa579 100%)',
                  }}
                >
                  <p className="font-bold">{totalCountBranches?.stats?.draftProducts}</p>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
        {/* TODO: Contacts */}
        <div className="bg-white p-1 px-3 rounded-lg shadow mt-5">
          <div className="flex justify-between mt-2 mb-2">
            <span className="px-4 font-semibold font-bold">
              <Badge size="small" offset={[10, 0]}>
                Contacts
              </Badge>
            </span>
            <Button
              type="primary"
              onClick={(event) => {
                event.stopPropagation();
                history.push(`/contacts/all`);
              }}
            >
              View Contacts
            </Button>
          </div>
          <div className="site-card-wrapper mt-5 mb-5">
            <Row gutter={16}>
              <Col span={12}>
                <Card
                  size="small"
                  title="Primary"
                  style={{
                    textAlign: 'center',
                    backgroundImage: 'linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)',
                  }}
                >
                  <p className="font-bold">
                    {totalCountBranches?.stats?.contactsCount?.primaryContactCount}
                  </p>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  size="small"
                  title="Not Primary"
                  style={{
                    textAlign: 'center',
                    backgroundImage: 'linear-gradient(to right, #accbee 0%, #e7f0fd 100%)',
                  }}
                >
                  <p className="font-bold">
                    {totalCountBranches?.stats?.contactsCount?.notPrimaryContactCount}
                  </p>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </Page>
    </div>
  );
};

const mapStateToProps = ({ user, product }) => ({
  currentUser: user?.currentUser,
  totalCount: product?.totalCount,
  totalCountPMS: product?.totalCountPMS,
  totalCountBranches: product?.totalCountBranches,
});
export default connect(mapStateToProps)(HospitalStats);
