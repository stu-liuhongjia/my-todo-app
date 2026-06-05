'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import LeaveForm from '@/components/LeaveForm';
import LeaveList from '@/components/LeaveList';

export default function Home() {
  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    const { data, error } = await supabase.from('leave_requests').select('*');
    if (error) {
      console.error('获取请假记录失败:', error);
      return;
    }
    setRequests(data || []);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">学生请假管理系统</h1>
      <LeaveForm refresh={fetchRequests} />
      <LeaveList requests={requests} refresh={fetchRequests} />
    </div>
  );
}
