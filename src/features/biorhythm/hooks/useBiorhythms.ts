import { useState, useMemo } from 'react';
import dayjs from 'dayjs';

const CYCLES = {
  PHYSICAL: 23,
  EMOTIONAL: 28,
  INTELLECTUAL: 33,
};

export const useBiorhythms = () => {
  const [birthDate, setBirthDate] = useState(() => localStorage.getItem('bio_birthDate') || '2000-01-01');
  const [targetDate, setTargetDate] = useState(dayjs().format('YYYY-MM-DD'));

  const handleBirthDateChange = (date: string) => {
    setBirthDate(date);
    localStorage.setItem('bio_birthDate', date);
  };

  const calculate = (birth: string, target: string) => {
    const b = dayjs(birth);
    const t = dayjs(target);
    const diff = t.diff(b, 'day');

    return {
      physical: Math.sin((2 * Math.PI * diff) / CYCLES.PHYSICAL),
      emotional: Math.sin((2 * Math.PI * diff) / CYCLES.EMOTIONAL),
      intellectual: Math.sin((2 * Math.PI * diff) / CYCLES.INTELLECTUAL),
    };
  };

  // Данные на сегодня
  const todayStats = useMemo(() => {
    const data = calculate(birthDate, targetDate);
    return {
      physical: Math.round(data.physical * 100),
      emotional: Math.round(data.emotional * 100),
      intellectual: Math.round(data.intellectual * 100),
    };
  }, [birthDate, targetDate]);

  // Данные для графика (15 дней)
  const chartData = useMemo(() => {
    const data = [];
    const start = dayjs(targetDate).subtract(3, 'day');
    
    for (let i = 0; i < 15; i++) {
      const current = start.add(i, 'day');
      const val = calculate(birthDate, current.toISOString());
      data.push({
        date: current.format('D.MM'),
        physical: parseFloat((val.physical * 100).toFixed(0)),
        emotional: parseFloat((val.emotional * 100).toFixed(0)),
        intellectual: parseFloat((val.intellectual * 100).toFixed(0)),
      });
    }
    return data;
  }, [birthDate, targetDate]);

  return { birthDate, setBirthDate: handleBirthDateChange, targetDate, setTargetDate, todayStats, chartData };
};
