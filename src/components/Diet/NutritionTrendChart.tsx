import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface NutritionTrendChartProps {
  data: Array<{
    date: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    calorieTarget: number;
    proteinTarget: number;
    carbsTarget: number;
    fatTarget: number;
  }>;
  period: 'week' | 'month' | '3months';
}

export default function NutritionTrendChart({ data, period }: NutritionTrendChartProps) {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [selectedMetric, setSelectedMetric] = useState<'calories' | 'protein' | 'carbs' | 'fat'>('calories');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (period === 'week') {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } else if (period === 'month') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const chartData = data.map(item => ({
    ...item,
    formattedDate: formatDate(item.date)
  }));

  const metricConfig = {
    calories: {
      label: 'Calories',
      color: '#f97316',
      targetKey: 'calorieTarget',
      unit: ''
    },
    protein: {
      label: 'Protein',
      color: '#3b82f6',
      targetKey: 'proteinTarget',
      unit: 'g'
    },
    carbs: {
      label: 'Carbs',
      color: '#10b981',
      targetKey: 'carbsTarget',
      unit: 'g'
    },
    fat: {
      label: 'Fat',
      color: '#f59e0b',
      targetKey: 'fatTarget',
      unit: 'g'
    }
  };

  const currentConfig = metricConfig[selectedMetric];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-sm text-gray-600">
            <span style={{ color: currentConfig.color }}>
              {currentConfig.label}: {Math.round(data[selectedMetric])}{currentConfig.unit}
            </span>
          </p>
          <p className="text-sm text-gray-500">
            Target: {Math.round(data[currentConfig.targetKey])}{currentConfig.unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Nutrition Trends</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChartType('line')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === 'line' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === 'bar' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="flex gap-2 mb-4">
        {Object.entries(metricConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setSelectedMetric(key as any)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedMetric === key
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={{
              backgroundColor: selectedMetric === key ? config.color : undefined
            }}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={currentConfig.color}
                strokeWidth={3}
                dot={{ fill: currentConfig.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: currentConfig.color, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey={currentConfig.targetKey}
                stroke="#9ca3af"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey={selectedMetric}
                fill={currentConfig.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm">
          <div 
            className="w-3 h-3 rounded"
            style={{ backgroundColor: currentConfig.color }}
          />
          <span className="text-gray-600">Actual {currentConfig.label}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-1 bg-gray-400" style={{ borderStyle: 'dashed' }} />
          <span className="text-gray-600">Target</span>
        </div>
      </div>
    </div>
  );
}