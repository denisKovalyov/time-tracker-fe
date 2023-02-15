import React, { useState, useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import UserService, { UserData } from '../../services/user';
import './index.css';

const User = () => {
  const [userData, setUserData] = useState<UserData>({} as UserData);

  useEffect(() => {
    UserService.getUser().then((data) => {
      setUserData({ ...data })
    });
  }, []);

  const { login } = userData;

  return (
    <div className="container">
      <Avatar icon={<UserOutlined />} />
      <span className="name">
        { login }
      </span>
    </div>
  );
};

export default User;
