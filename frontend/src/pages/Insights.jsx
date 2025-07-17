import React from 'react';
import InsightCard from '../components/InsightCard';
import { TrendingUp, Home, DollarSign, BarChart3, MapPin, Calendar, Users, Target } from 'lucide-react';

const Insights = () => {
  const marketMetrics = [
    {
      title: 'Average Property Value',
      value: '$1.2M',
      change: 8.5,
      type: 'currency',
      icon: Home
    },
    {
      title: 'Market Stability Index',
      value: '8.4/10',
      change: 2.1,
      type: 'score',
      icon: TrendingUp
    },
    {
      title: 'Properties Analyzed',
      value: '25,847',
      change: 12.3,
      type: 'number',
      icon: BarChart3
    },
    {
      title: 'Average Price/SqFt',
      value: '$756',
      change: 5.2,
      type: 'currency',
      icon: DollarSign
    }
  ];

  const neighborhoodData = [
    {
      name: 'Financial District',
      avgPrice: '$1.1M',
      stability: 8.7,
      trend: 'up',
      properties: 145
    },
    {
      name: 'Midtown East',
      avgPrice: '$1.4M',
      stability: 9.1,
      trend: 'up',
      properties: 203
    },
    {
      name: 'Greenwich Village',
      avgPrice: '$1.3M',
      stability: 8.9,
      trend: 'stable',
      properties: 167
    },
    {
      name: 'Upper East Side',
      avgPrice: '$1.2M',
      stability: 8.5,
      trend: 'up',
      properties: 189
    },
    {
      name: 'Chelsea',
      avgPrice: '$1.1M',
      stability: 8.3,
      trend: 'stable',
      properties: 156
    }
  ];

  const monthlyTrends = [
    { month: 'Jan', value: 1150000, stability: 8.2 },
    { month: 'Feb', value: 1180000, stability: 8.3 },
    { month: 'Mar', value: 1200000, stability: 8.1 },
    { month: 'Apr', value: 1220000, stability: 8.4 },
    { month: 'May', value: 1250000, stability: 8.6 },
    { month: 'Jun', value: 1280000, stability: 8.7 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Insights</h1>
          <p className="text-gray-600">Comprehensive analysis of property market trends and stability indicators</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {marketMetrics.map((metric, index) => (
            <InsightCard
              key={index}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              type={metric.type}
              icon={metric.icon}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Market Trends Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Trends (6 Months)</h3>
            <div className="space-y-4">
              {monthlyTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600 w-8">{trend.month}</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(trend.value / 1300000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ${(trend.value / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-gray-500">
                      {trend.stability}/10
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stability Score Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stability Score Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Excellent (9-10)</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  <span className="text-sm font-medium">35%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Good (8-8.9)</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-sm font-medium">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fair (7-7.9)</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                  <span className="text-sm font-medium">20%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Neighborhood Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Neighborhood Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Neighborhood</th>
                  <th className="px-6 py-3">Avg Price</th>
                  <th className="px-6 py-3">Stability</th>
                  <th className="px-6 py-3">Trend</th>
                  <th className="px-6 py-3">Properties</th>
                </tr>
              </thead>
              <tbody>
                {neighborhoodData.map((neighborhood, index) => (
                  <tr key={index} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {neighborhood.name}
                    </td>
                    <td className="px-6 py-4 text-green-600 font-semibold">
                      {neighborhood.avgPrice}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        neighborhood.stability >= 9 ? 'bg-green-100 text-green-800' :
                        neighborhood.stability >= 8 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {neighborhood.stability}/10
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        neighborhood.trend === 'up' ? 'bg-green-100 text-green-800' :
                        neighborhood.trend === 'down' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {neighborhood.trend === 'up' ? '↗ Rising' :
                         neighborhood.trend === 'down' ? '↘ Falling' :
                         '→ Stable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {neighborhood.properties}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Market Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Strong Market Growth</h4>
                  <p className="text-sm text-gray-600">Property values have increased 8.5% over the past month, indicating a robust market.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">High Stability Scores</h4>
                  <p className="text-sm text-gray-600">80% of properties show stability scores above 8.0, indicating market confidence.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Premium Neighborhoods</h4>
                  <p className="text-sm text-gray-600">Midtown East and Greenwich Village show the highest stability and growth potential.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Investment Opportunities</h4>
                  <p className="text-sm text-gray-600">Properties in emerging neighborhoods show strong potential for appreciation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;