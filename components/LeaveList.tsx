import { supabase } from '@/lib/supabase';

export default function LeaveList({
  requests,
  refresh,
}: {
  requests: any[];
  refresh: () => void;
}) {
  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('leave_requests')
      .update({ status })
      .eq('id', id);
    if (error) {
      console.error('更新状态失败:', error);
      alert('状态更新失败，请重试');
      return;
    }
    refresh();
  };

  const deleteRequest = async (id: string) => {
    const { error } = await supabase
      .from('leave_requests')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('删除记录失败:', error);
      alert('删除失败，请重试');
      return;
    }
    refresh();
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">请假记录</h2>
      <div className="space-y-2">
        {requests.map((req) => (
          <div
            key={req.id}
            className="border p-3 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex justify-between">
              <span className="font-medium">{req.name}</span>
              <span className="text-sm text-gray-500">
                {req.class} | {req.days}天
              </span>
            </div>
            <p className="text-gray-700 text-sm mt-1">{req.reason}</p>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => updateStatus(req.id, 'approved')}
                className={`px-3 py-1 text-sm rounded ${
                  req.status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                已批准
              </button>
              <button
                onClick={() => deleteRequest(req.id)}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
