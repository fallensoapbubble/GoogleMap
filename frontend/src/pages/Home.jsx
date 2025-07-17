import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, MapPin, Calculator, BarChart3, ArrowRight, Shield, Target, Clock } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Interactive Property Map',
      description: 'Visualize properties with color-coded valuations and market stability indicators across different neighborhoods',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Calculator,
      title: 'Advanced Valuation Engine',
      description: 'AI-powered property valuation using historical data, location factors, and market trends',
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      icon: BarChart3,
      title: 'Market Analytics Dashboard',
      description: 'Comprehensive market trends, stability scores, and investment opportunity analysis',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: TrendingUp,
      title: 'Investment Insights',
      description: 'Data-driven recommendations for optimal real estate investment strategies and risk assessment',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Risk Assessment',
      description: 'Comprehensive risk analysis based on location, market conditions, and historical data'
    },
    {
      icon: Target,
      title: 'Precision Valuation',
      description: 'Accurate property valuations using multiple data sources and advanced algorithms'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Live market data and instant property value updates as conditions change'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Property Valuation &
              <span className="text-blue-600"> Market Stability</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Leverage comprehensive property data, location-based indicators, and advanced analytics 
              to make informed real estate decisions with confidence and precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/map"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>Explore Properties</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/insights"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
              >
                View Market Insights
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Real Estate Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines public property data with location-based indicators 
              to provide comprehensive market analysis and valuation insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for real estate professionals who demand accuracy, efficiency, and actionable insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">25K+</div>
              <div className="text-gray-600">Properties Analyzed</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-xl">
              <div className="text-4xl font-bold text-emerald-600 mb-2">95%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl">
              <div className="text-4xl font-bold text-orange-600 mb-2">1,200+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
              <div className="text-4xl font-bold text-purple-600 mb-2">$2.5B</div>
              <div className="text-gray-600">Properties Valued</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Real Estate Analysis?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of real estate professionals who rely on our platform for accurate property valuations and market insights.
          </p>
          <Link
            to="/add-property"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <span>Get Started Today</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;