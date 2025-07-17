import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const InsightCard = ({ title, value, change, type, icon: Icon }) => {
  const getChangeIcon = () => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getChangeColor = () => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeText = () => {
    if (change > 0) return `+${change}%`;
    if (change < 0) return `${change}%`;
    return '0%';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
          )}
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
          {getChangeIcon()}
          <span className="text-sm font-medium">{getChangeText()}</span>
        </div>
      </div>
      
      <div className="text-2xl font-bold text-gray-900">
        {type === 'currency' ? `$${value}` : value}
      </div>
      
      <div className="mt-2 text-sm text-gray-600">
        vs last month
      </div>
    </div>
  );
};

export default InsightCard;