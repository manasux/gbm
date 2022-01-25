/**
 *@BaseView - The Purpose of this component is that user can update its general  account information here
 *
 */
import { Button, Upload, message, Avatar, Spin, Skeleton } from 'antd';
import React, { useState, useRef } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import CardSection from '@/components/CardSection';
import Breadcrumbs from '@/components/BreadCrumbs';
import Page from '@/components/Page';
import userPic from '@/assets/icons/m-2.svg';
import BasicDetailsForm from './BasicDetailsForm';

/**
 *@AvatarView - The Purpose of Avatar View component is that user can upload an image on organization avatar field
 *
 */
const AvatarView = (props) => {
  const [state, setState] = useState({ avatar: null });
  const canvasRef = useRef(null);

  function onFileChangeHandler(info) {
    if (info.file.status === 'uploading') {
      setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      setState({ loading: true });
      const fileSize = info.file.size / 1024;
      if (fileSize > 2048) {
        message.error('File is larger than 1 MB');
        setState({ loading: false });
        return;
      }

      const canvas = canvasRef.current;
      const img = new Image();
      const ctx = canvas.getContext('2d');
      img.onload = async () => {
        const ix = img.width;
        const iy = img.height;
        let cix;
        let ciy;
        let sx = 0;
        let sy = 0;

        if (ix <= iy) {
          sx = (ix - iy) / 2;
          ciy = iy;
          cix = iy;
        } else {
          sy = (iy - ix) / 2;
          ciy = ix;
          cix = ix;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, sx, sy, cix, ciy, 0, 0, 512, 512);
        // convert the canvas data to base64 string
        const dataUrl = canvas.toDataURL('image/png');
        const bytes =
          dataUrl.split(',')[0].indexOf('base64') >= 0
            ? atob(dataUrl.split(',')[1])
            : window.unescape(dataUrl.split(',')[1]);

        const max = bytes.length;
        const ia = new Uint8Array(max);

        for (let i = 0; i < max; i += 1) {
          ia[i] = bytes.charCodeAt(i);
        }

        const newImageFileFromCanvas = new File([ia], `image_${Date.now()}.png`, {
          type: 'image/png',
        });

        const data = new FormData();
        data.append('file', newImageFileFromCanvas);
        props.dispatch({
          type: 'user/userAvatarUpload',
          payload: {
            body: data,
            pathParams: {
              partyId: props?.currentUser?.id,
            },
          },
        });
        setState({
          avatar: dataUrl,
          loading: false,
        });
        message.success(`${info.file.name} file uploaded successfully`);
      };

      const fileReader = new FileReader();
      fileReader.onload = () => {
        img.src = fileReader.result;
      };
      if (info.file.originFileObj) {
        fileReader.readAsDataURL(info.file.originFileObj);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
  return (
    <>
      <div className="text-base font-semibold mb-2 justify-center">
        <div>
          <span className="font-semibold text-xl items-center flex text-blue-900 justify-center">
            Avatar
          </span>
        </div>

        <br />
      </div>

      <div className={['avatar', 'mb-6', 'text-center'].join(' ')}>
        {state.avatar || props?.currentUser?.personal_details?.avatar_url ? (
          <>
            {state.loading ? (
              <Spin spinning={state.loading}>
                <Skeleton />
              </Spin>
            ) : (
              <img
                height="150px"
                src={state.avatar || props?.currentUser?.personal_details?.avatar_url}
                alt="avatar"
                className="rounded-full"
              />
            )}
          </>
        ) : (
          <>
            <Avatar src={userPic} size={80}>
              <UserOutlined style={{ fontSize: 40 }} />
            </Avatar>
          </>
        )}
        <div className="mt-4 text-gray-600 items-center flex justify-center">
          <span className="font-normal text-sm m-0 p-0">
            PNG, JPG will be automatically resized to maximum of 300px by 300px
          </span>
        </div>
      </div>
      <div className="mt-4 items-center flex justify-center">
        <canvas id="canvas" height="512" width="512" style={{ display: 'none' }} ref={canvasRef} />
        <Upload
          onChange={onFileChangeHandler}
          multiple={false}
          showUploadList={false}
          accept=".png,.jpg,.jpeg"
        >
          <div>
            <Button
              type="primary"
              className="Button"
              loading={state.loading || props.userAvatarLoading}
              shape={state.loading || props.userAvatarLoading ? 'loading' : 'plus'}
            >
              {state.avatar || props.avatar ? <span>Change Avatar</span> : <span>Add Avatar</span>}
            </Button>
          </div>
        </Upload>
      </div>
    </>
  );
};

const UserProfile = ({ dispatch, currentUser }) => {
  return (
    <div className="container mx-auto">
      <Page
        title="Profile"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Profile',
                path: '/user-profile',
              },
            ]}
          />
        }
      >
        <CardSection
          className="mt-4"
          leftContent={
            <div className="pr-8 ">
              <div className="text-blue-900 font-semibold text-xl">Avatar</div>
              <div className="text-gray-600">
                <p className="mt-2">Upload you image.</p>
                <p className="mt-4">
                  PNG, JPG will be automatically resized to maximum of 300px by 300px.
                </p>
              </div>
            </div>
          }
          rightContent={
            <div className="bg-white rounded shadow">
              <div className="p-4 border-b">
                <AvatarView dispatch={dispatch} currentUser={currentUser} />
              </div>
            </div>
          }
        />

        <CardSection
          noPadding
          className="mt-4"
          leftContent={
            <div className="pr-8 ">
              <div className="text-blue-900 font-semibold text-xl">Your details</div>
              <div className="text-gray-600">
                <p className="mt-4">
                  Fill your details like name, aadhar number, date of birth and qualification.
                </p>
              </div>
            </div>
          }
          rightContent={<BasicDetailsForm />}
        />
      </Page>
    </div>
  );
};

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(UserProfile);
