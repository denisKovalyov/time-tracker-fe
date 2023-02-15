import React, { useState } from 'react';
import Projects from '../Projects';
import Stats from '../Stats';
import User from '../User';
import ProjectProvider from "../../providers/ProjectProvider";
import { Layout, Menu } from 'antd';

import './index.css';

const { Header, Content } = Layout;

const MENU_ITEMS: {[key: string]: React.ReactElement} = {
  Projects: <Projects />,
  Stats: <Stats />,
};

const MENU_LABELS = Object.keys(MENU_ITEMS);

function LayoutComponent() {
  const [menuItem, setMenuItem] = useState(MENU_LABELS[0]);

  return (
    <ProjectProvider>
      <Layout>
        <Header className="header">
          <Menu
            className="menu"
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[menuItem]}
            items={MENU_LABELS.map((label) => {
              return {
                key: label,
                label,
              };
            })}
            onClick={({ key }) => setMenuItem(key)}
          />
          <User />
        </Header>
        <Content style={{ padding: '25px 50px' }}>
          {MENU_ITEMS[menuItem]}
        </Content>
      </Layout>
    </ProjectProvider>
  );
}

export default LayoutComponent;
