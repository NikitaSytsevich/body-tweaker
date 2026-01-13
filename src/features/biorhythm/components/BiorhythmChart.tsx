import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip } from 'recharts';

interface Props {
  data: any[];
}

export const BiorhythmChart = ({ data }: Props) => {
  return (
    <div className="w-full h-64 mt-4 bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis dataKey="date" tick={{fontSize: 10, fill: '#9ca3af'}} axisLine={false} tickLine={false} interval={2} />
          <YAxis domain={[-100, 100]} hide />
          <ReferenceLine y={0} stroke="#e5e7eb" strokeDasharray="3 3" />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            labelStyle={{ color: '#6b7280', fontSize: '12px' }}
          />
          <Line type="monotone" dataKey="physical" stroke="#ef4444" strokeWidth={3} dot={false} name="Физика" />
          <Line type="monotone" dataKey="emotional" stroke="#22c55e" strokeWidth={3} dot={false} name="Эмоции" />
          <Line type="monotone" dataKey="intellectual" stroke="#3b82f6" strokeWidth={3} dot={false} name="Интеллект" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
