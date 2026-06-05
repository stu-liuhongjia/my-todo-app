import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LeaveForm({ refresh }: { refresh: () => void }) {
  const [name, setName] = useState('');
  const [classRoom, setClass] = useState('');
  const [reason, setReason] = useState('');
  const [days, setDays] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('leave_requests').insert([
      { name, class: classRoom, reason, days: parseInt(days) }
    ]);
    if (error) {
      console.error('提交申请失败:', error);
      alert('申请提交失败，请重试');
      return;
    }
    refresh();
    // 重置表单
    setName('');
    setClass('');
    setReason('');
    setDays('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">提交请假申请</h2>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="姓名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="班级"
          value={classRoom}
          onChange={(e) => setClass(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="请假原因"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="请假天数"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          提交申请
        </button>
      </div>
    </form>
  );
}
