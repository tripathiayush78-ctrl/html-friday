import React, { useMemo, useState } from 'react';
import { Card, Avatar, Segmented, Typography } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import DataChart from './DataChart.jsx';

const { Text } = Typography;
const SEGMENT_OPTIONS = ['Overall', 'Only Full Time', 'Only Contractors'];

/**
 * ChatMessageCard
 * ----------------
 * This is THE reusable component the assignment specifically asks for:
 * one component renders every bubble in the conversation, branching on
 * `message.sender` ('user' | 'ai') and `message.payload.type`
 * ('text' | 'chart'), instead of a different component per message kind.
 * Adding a new payload type later (e.g. 'table' or 'error') means adding
 * one more branch here, not a new component tree wired up separately.
 *
 * Expected message shape (see src/data/mockDb.json for real examples):
 * {
 *   id, sender: 'user' | 'ai', timestamp,
 *   payload:
 *     | { type: 'text', text }
 *     | { type: 'chart', title, categories, segments: { [segmentName]: series } }
 * }
 */
export default function ChatMessageCard({ message }) {
  const isUser = message.sender === 'user';
  const isChart = message.payload?.type === 'chart';

  // This local state deliberately lives HERE, not lifted up to App.jsx.
  // Which Segmented option is selected is a pure display concern for THIS
  // one card — it must never trigger a re-render of the rest of the chat
  // history, and it must never be written to localStorage (it's not part
  // of the conversation, it's transient UI state).
  const [activeSegment, setActiveSegment] = useState(SEGMENT_OPTIONS[0]);

  // Re-derive only the active series when the segment changes. Memoized
  // for the same reason DataChart memoizes its options object: this
  // shouldn't be recomputed on renders unrelated to this card.
  const activeSeries = useMemo(() => {
    if (!isChart) return null;
    return message.payload.segments[activeSegment] ?? message.payload.segments.Overall;
  }, [isChart, message.payload, activeSegment]);

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '8px 0' }}>
        <div
          style={{
            background: '#775DD0',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: '16px 16px 4px 16px',
            maxWidth: '70%',
          }}
        >
          {message.payload.text}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 12, margin: '8px 0', maxWidth: isChart ? '90%' : '70%' }}>
      <Avatar icon={<ThunderboltOutlined />} style={{ backgroundColor: '#775DD0', flexShrink: 0 }} />
      <Card size="small" style={{ borderRadius: 16, flex: 1 }}>
        {!isChart && <Text>{message.payload.text}</Text>}

        {isChart && (
          <>
            <Segmented
              options={SEGMENT_OPTIONS}
              value={activeSegment}
              onChange={setActiveSegment}
              style={{ marginBottom: 12 }}
            />
            <DataChart
              title={message.payload.title}
              categories={message.payload.categories}
              series={activeSeries}
            />
          </>
        )}
      </Card>
    </div>
  );
}
