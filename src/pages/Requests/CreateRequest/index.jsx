import React from 'react';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import { Button, Form } from 'antd';
import { FooterToolbar } from '@ant-design/pro-layout';
import ProductChoiceForm from './ProductChoiceForm';
import ProductIssueForm from './ProductIssueForm';
import ContactInforamtionForm from './ContactInformationForm';

const CreateRequest = () => {
  const [form] = Form.useForm();
  return (
    <div className="container mx-auto">
      <Page
        title="Request a Service"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Request a Service',
                path: '/requests/create',
              },
            ]}
          />
        }
      >
        <Form layout="vertical" hideRequiredMark colon={false} onFinish={() => {}} form={form}>
          <div className="mb-12">
            <ProductChoiceForm form={form} />
            <ProductIssueForm form={form} />
            <ContactInforamtionForm form={form} />
          </div>
          <FooterToolbar
            extra={
              <div className="container mx-auto">
                <div className="flex justify-end xl:mr-16 py-2 ">
                  <Button type="primary" htmlType="submit">
                    Raise Request
                  </Button>
                </div>
              </div>
            }
          />
        </Form>
      </Page>
    </div>
  );
};

export default CreateRequest;
