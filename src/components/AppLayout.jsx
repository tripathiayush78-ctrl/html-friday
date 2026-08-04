import React, { useState } from 'react';
import { Layout, Menu, Avatar, Typography } from 'antd';
import {
  ThunderboltOutlined,
  MessageOutlined,
  FileTextOutlined,
  SearchOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;
const { Text } = Typography;

// Antd's <Menu> wants an `items` array rather than JSX children in v5/v6 —
// this is the current, non-deprecated API.
const NAV_ITEMS = [
  { key: 'workspace', icon: <ThunderboltOutlined />, label: 'Workspace' },
  { key: 'conversations', icon: <MessageOutlined />, label: 'Conversations' },
  { key: 'notebook', icon: <FileTextOutlined />, label: 'Notebook' },
  { key: 'search', icon: <SearchOutlined />, label: 'Search' },
];

/**
 * AppLayout
 * ---------
 * Pure presentational shell — it knows nothing about chat state or
 * localStorage. It only owns UI-local state (which nav item looks
 * selected). Keeping it "dumb" means it's trivially reusable and testable
 * on its own, and App.jsx stays free to change how chat state works
 * without ever touching this file.
 *
 * @param {ReactNode} children - rendered inside <Content> (the chat UI)
 * @param {Array<{id,title,date}>} threads - right-sidebar thread list
 */
export default function AppLayout({ children, threads = [] }) {
  const [selectedKey, setSelectedKey] = useState('conversations');

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={220} theme="light" style={{ borderRight: '1px solid #EFEFF4' }}>
        <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar style={{ backgroundColor: '#775DD0' }}>F</Avatar>
          <Text strong>Friday</Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(e) => setSelectedKey(e.key)}
          items={NAV_ITEMS}
          style={{ borderInlineEnd: 'none' }}
        />
      </Sider>

      {/* display:flex + flexDirection:column here (not on Layout itself) is
          what lets the child scroll area take flex:1 and the chat input
          pin to the bottom, inside a full-height column. */}
      <Content style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {children}
      </Content>

      <Sider width={280} theme="light" style={{ borderLeft: '1px solid #EFEFF4', padding: 16, overflowY: 'auto' }}>
        <Text strong style={{ display: 'block', marginBottom: 12 }}>
          Trending Analysis
        </Text>
        {threads.map((thread) => (
          <div
            key={thread.id}
            style={{ padding: 12, borderRadius: 10, background: '#F8F7FC', marginBottom: 10 }}
          >
            <Text style={{ fontSize: 13, display: 'block' }}>{thread.title}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{thread.date}</Text>
          </div>
        ))}
      </Sider>
    </Layout>
  );
}
