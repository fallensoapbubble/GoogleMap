import React from 'react';
import { Target, Users, Award, TrendingUp, Shield, Database, MapPin, Calculator } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Database,
      title: 'Comprehensive Data Integration',
      description: 'We combine multiple data sources including property records, market trends, and location-based indicators to provide accurate valuations.'
    },
    {
      icon: MapPin,
      title: 'Location Intelligence',
      description: 'Our platform analyzes proximity to schools, transportation, amenities, and other location factors that impact property values.'
    },
    {
      icon: Calculator,
      title: 'Advanced Valuation Models',
      description: 'Proprietary algorithms that consider historical sales, market conditions, and property characteristics for precise valuations.'
    },
    {
      icon: Shield,
      title: 'Risk Assessment',
      description: 'Comprehensive risk analysis including market stability, environmental factors, and economic indicators.'
    }
  ];

  const stats = [
    { label: 'Properties Analyzed', value: '25,000+' },
    { label: 'Data Sources', value: '15+' },
    { label: 'Years of Data', value: '10+' },
    { label: 'Market Coverage', value: '50+ Cities' }
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-Founder',
      background: 'Former Goldman Sachs analyst with 15 years in real estate finance',
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Michael Rodriguez',
      role: 'CTO & Co-Founder',
      background: 'Ex-Google engineer specializing in machine learning and big data',
      image: 'https://images.pexels.com/photos/3760790/pexels-photo-3760790.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Head of Data Science',
      background: 'PhD in Economics from MIT, former Federal Reserve researcher',
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              About PropValuate
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              We're revolutionizing real estate valuation through advanced data analytics, 
              machine learning, and comprehensive market intelligence.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To democratize access to professional-grade real estate valuation tools and market insights, 
                empowering individuals and businesses to make informed property investment decisions.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We believe that accurate property valuation shouldn't be limited to large institutions. 
                By combining public data with advanced analytics, we're making sophisticated real estate 
                analysis accessible to everyone.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Target className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Accuracy</h3>
                    <p className="text-sm text-gray-600">Precise valuations you can trust</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Accessibility</h3>
                    <p className="text-sm text-gray-600">Tools for everyone</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Real estate analysis"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-4 rounded-lg">
                <Award className="w-8 h-8 mb-2" />
                <div className="text-sm font-semibold">Industry Leading</div>
                <div className="text-xs">Valuation Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Do It</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform leverages cutting-edge technology and comprehensive data sources 
              to deliver unparalleled real estate insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Impact</h2>
            <p className="text-xl text-blue-100">
              Trusted by thousands of users across the real estate industry
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our team combines deep expertise in real estate, finance, and technology 
              to deliver exceptional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-gray-600">{member.background}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of real estate professionals who trust our platform for accurate 
            property valuations and market insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Start Free Trial
            </button>
            <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;