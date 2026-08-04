import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';

/**
 * ChatInput
 * ---------
 * Draft text lives in local useState, NOT in the shared chatHistory state.
 * The parent only learns about a message once the user commits it (Enter
 * or the send button). This matters for performance: if draft text were
 * stored in the same state as chatHistory, every keystroke would re-render
 * the ENTIRE message list (and every chart in it). Keeping it local means
 * a keystroke only re-renders this one small input.
 */
export default function ChatInput({ onSend, disabled }) {
  const [draft, setDraft] = useState('');

  const commit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setDraft('');
  };

  return (
    <div style={{ display: 'flex', gap: 8, padding: 16, borderTop: '1px solid #EFEFF4' }}>
      <Input
        size="large"
        placeholder="Ask Friday about your workforce data..."
        value={draft}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onPressEnter={commit}
      />
      <Button type="primary" size="large" icon={<SendOutlined />} onClick={commit} disabled={disabled} />
    </div>
  );
}
