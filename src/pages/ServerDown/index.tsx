import React, { useEffect } from 'react';
import { connect, history } from 'umi';
import Serverdown from '@/assets/server-down-featured-removebg-preview.png';
import { getRedirectURL } from '@/utils/utils';

let interval: NodeJS.Timeout;

export default connect(
  () => ({}),
  (dispatch: (arg0: { type: string }) => Promise<boolean>) => ({ dispatch }),
)((props: { dispatch: (arg0: { type: string }) => Promise<boolean> }) => {
  const checkServer = () => {
    props
      .dispatch({
        type: 'login/checkServer',
      })
      .then((available: boolean) => {
        if (available) {
          getRedirectURL((redirect: string) => {
            history.push(redirect || '/');
          });
        }
      });
  };
  useEffect(() => {
    interval = setInterval(() => {
      checkServer();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex h-screen">
      <div className="m-auto text-center">
        <div className="text-4xl font-bold">Oh Snap!</div>
        <div className="text-xl text-gray-600">Server down!</div>
        <div>
          <img src={Serverdown} alt="Server down" />
        </div>
        <div className="mt-4">
          <div className="text-center text-lg">Trying to establish communication...</div>
        </div>
      </div>
    </div>
  );
});
