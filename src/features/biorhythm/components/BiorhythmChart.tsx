import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip } from 'recharts';

export interface BiorhythmDataPoint {
  date: string;
  physical: number;
  emotional: number;
  intellectual: number;
}

interface Props {
  data: BiorhythmDataPoint[];
}

export const BiorhythmChart = ({ data }: Props) => {
  return (
    <div className="w-full h-64 mt-4 bg-white dark:bg-[#2C2C2E] rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-white/10">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" className="dark:stroke-[#38383A]" />
          <XAxis dataKey="date" tick={{fontSize: 10, fill: '#9ca3af'}} axisLine={false} tickLine={false} interval={2} />
          <YAxis domain={[-100, 100]} hide />
          <ReferenceLine y={0} stroke="#e5e7eb" className="dark:stroke-[#38383A]" strokeDasharray="3 3" />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#0F172A'
            }}
            contentStyle-dark={{
              backgroundColor: 'rgba(44, 44, 46, 0.95)',
              color: '#FFFFFF'
            }}
            labelStyle={{ color: '#6b7280', fontSize: '12px' }}
            itemStyle={{ color: '#0F172A' }}
            itemStyle-dark={{ color: '#FFFFFF' }}
          />
          <Line type="monotone" dataKey="physical" stroke="#ef4444" className="dark:stroke-[#FF6B6B]" strokeWidth={3} dot={false} name="Физика" />
          <Line type="monotone" dataKey="emotional" stroke="#22c55e" className="dark:stroke-[#4ADE80]" strokeWidth={3} dot={false} name="Эмоции" />
          <Line type="monotone" dataKey="intellectual" stroke="#3b82f6" className="dark:stroke-[#60A5FA]" strokeWidth={3} dot={false} name="Интеллект" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
