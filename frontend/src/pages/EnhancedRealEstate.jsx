import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow, HeatmapLayer, Circle, Polygon } from '@react-google-maps/api';
import { 
  Filter, List, X, Loader, Home, MapPin, Calendar, Ruler, Phone, Mail, Building,
  TrendingUp, DollarSign, Calculator, BarChart3, Eye, Search, Settings,
  Navigation, Clock, Star, Heart, Share2, Camera, Mic, Layers, Target,
  Activity, Users, Shield, Zap, Brain, Compass, Globe, Wifi
} from 'lucide-react';

// GraphQL queries - same as Google.jsx for consistency
let GRAPHQL_ENDPOINT = 'http://localhost:4000'; 

const GET_PROPERTIES = `
  query GetProperties {
    listedProperties {
      _id
      propertyCategory
      bedroomCount
      bathroomCount
      builtYear
      areaSqFt
      lotSizeInSqFt
      locationDetails {
        streetAddress
        cityName
        stateName
        postalCode
        geoCoordinates {
          coordinates
        }
      }
      ownerAgent {
        fullName
        phoneNumber
        emailAddress
        agencyName
      }
      geoZone {
        zoneName
        averagePrice
        totalTransactions
      }
      propertyTransactions {
        saleDate
        salePrice
        transactionType
      }
    }
  }
`;

const GET_PROPERTY_INSIGHT = `
  query GetPropertyInsight($propertyId: ID!) {
    propertyInsight(propertyId: $propertyId) {
      propertyDetails {
        _id
        propertyCategory
        bedroomCount
        bathroomCount
        builtYear
        areaSqFt
      }
      marketValue {
        estimatedValue
        basedOnZoneAverage
      }
      taxEstimate {
        lastSoldFor
        taxRate
        estimatedTax
        handledBy
      }
    }
  }
`;

const GET_AGENTS = `
  query GetAgents {
    agentProfiles {
      _id
      fullName
      phoneNumber
      emailAddress
      agencyName
    }
  }
`;

const GET_ZONES = `
  query GetZones {
    geoZones {
      _id
      zoneName
      averagePrice
      totalTransactions
    }
  }
`;

// GraphQL client function - same as Google.jsx
const graphqlRequest = async (query, variables = {}) => {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error(result.errors[0].message);
    }
    
    return result.data;
  } catch (error) {
    console.error('GraphQL request failed:', error);
    throw error;
  }
};

// Enhanced data transformation with AI scoring
const transformEnhancedPropertyData = (properties) => {
  return properties.map(property => {
    const transactions = property.propertyTransactions || [];
    const lastTransaction = transactions.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate))[0];
    
    // AI-powered investment score calculation
    const investmentScore = calculateInvestmentScore(property);
    const walkabilityScore = Math.floor(Math.random() * 100); // Mock data
    const safetyScore = Math.floor(Math.random() * 100); // Mock data
    
    return {
      id: property._id,
      lat: property.locationDetails?.geoCoordinates?.coordinates?.[1] || (34.052235 + (Math.random() - 0.5) * 0.1),
      lng: property.locationDetails?.geoCoordinates?.coordinates?.[0] || (-118.243683 + (Math.random() - 0.5) * 0.1),
      price: property.geoZone?.averagePrice || Math.floor(Math.random() * 2000000) + 300000,
      type: property.propertyCategory || 'house',
      bedrooms: property.bedroomCount || Math.floor(Math.random() * 5) + 1,
      bathrooms: property.bathroomCount || Math.floor(Math.random() * 3) + 1,
      yearBuilt: property.builtYear || Math.floor(Math.random() * 50) + 1970,
      sqft: property.areaSqFt || Math.floor(Math.random() * 2000) + 1000,
      address: property.locationDetails?.streetAddress || `${Math.floor(Math.random() * 9999)} Sample St`,
      city: property.locationDetails?.cityName || 'Los Angeles',
      state: property.locationDetails?.stateName || 'CA',
      zone: property.geoZone?.zoneName || 'Downtown',
      agent: property.ownerAgent?.fullName || 'John Doe',
      agentPhone: property.ownerAgent?.phoneNumber || '(555) 123-4567',
      agentEmail: property.ownerAgent?.emailAddress || 'agent@example.com',
      agency: property.ownerAgent?.agencyName || 'Premium Realty',
      
      // Enhanced features
      investmentScore,
      walkabilityScore,
      safetyScore,
      lastSalePrice: lastTransaction?.salePrice || null,
      lastSaleDate: lastTransaction?.saleDate || null,
      priceHistory: transactions.map(t => ({ date: t.saleDate, price: t.salePrice })),
      
      // Mock enhanced data
      commuteTime: Math.floor(Math.random() * 60) + 10,
      schoolRating: Math.floor(Math.random() * 5) + 6,
      crimeRate: Math.random() * 10,
      nearbyAmenities: generateNearbyAmenities(),
      marketTrend: Math.random() > 0.5 ? 'up' : 'down',
      daysOnMarket: Math.floor(Math.random() * 180),
      viewCount: Math.floor(Math.random() * 500),
      favoriteCount: Math.floor(Math.random() * 50),
    };
  });
};

// AI Investment Score Calculator
const calculateInvestmentScore = (property) => {
  let score = 50; // Base score
  
  // Age factor
  const age = new Date().getFullYear() - (property.builtYear || 2000);
  if (age < 10) score += 15;
  else if (age < 20) score += 10;
  else if (age > 50) score -= 10;
  
  // Size factor
  const sqft = property.areaSqFt || 1500;
  if (sqft > 2000) score += 10;
  else if (sqft < 1000) score -= 5;
  
  // Transaction activity
  const transactions = property.geoZone?.totalTransactions || 0;
  if (transactions > 50) score += 10;
  else if (transactions < 10) score -= 5;
  
  return Math.max(0, Math.min(100, score));
};

// Generate mock nearby amenities
const generateNearbyAmenities = () => {
  const amenities = ['Starbucks', 'Whole Foods', 'Gym', 'Park', 'School', 'Hospital', 'Metro Station'];
  return amenities.slice(0, Math.floor(Math.random() * 4) + 2).map(name => ({
    name,
    distance: Math.random() * 2,
    rating: Math.random() * 2 + 3
  }));
};

// Enhanced Filter Component with AI features
const EnhancedFilterPanel = ({ filters, onFiltersChange, zones, agents, onClose }) => {
  const [activeTab, setActiveTab] = useState('basic');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFiltersChange(prev => ({ ...prev, [name]: value }));
  };

  const handleRangeChange = (name, value, index) => {
    const newRange = [...filters[name]];
    newRange[index] = parseInt(value) || 0;
    onFiltersChange(prev => ({ ...prev, [name]: newRange }));
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl shadow-2xl border border-white/20 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Smart Filters</h2>
        <button onClick={onClose} className="text-white/70 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6">
        {['basic', 'lifestyle', 'investment', 'ai'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab 
                ? 'bg-blue-500/50 text-white border border-blue-400/50' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Basic Filters */}
      {activeTab === 'basic' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Price Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange[0]}
                onChange={(e) => handleRangeChange('priceRange', e.target.value, 0)}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange[1]}
                onChange={(e) => handleRangeChange('priceRange', e.target.value, 1)}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Property Type</label>
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleChange}
              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="">All Types</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="apartment">Apartment</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Bedrooms</label>
              <select
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleChange}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="">Any</option>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Bathrooms</label>
              <select
                name="bathrooms"
                value={filters.bathrooms}
                onChange={handleChange}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="">Any</option>
                {[1,2,3,4].map(n => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Lifestyle Filters */}
      {activeTab === 'lifestyle' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Max Commute Time (minutes)</label>
            <input
              type="range"
              min="0"
              max="120"
              value={filters.maxCommute || 60}
              onChange={(e) => onFiltersChange(prev => ({ ...prev, maxCommute: e.target.value }))}
              className="w-full"
            />
            <div className="text-center text-white/70 text-sm">{filters.maxCommute || 60} minutes</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Walkability Score</label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.minWalkability || 50}
              onChange={(e) => onFiltersChange(prev => ({ ...prev, minWalkability: e.target.value }))}
              className="w-full"
            />
            <div className="text-center text-white/70 text-sm">{filters.minWalkability || 50}+ score</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">School Rating</label>
            <select
              name="minSchoolRating"
              value={filters.minSchoolRating || ''}
              onChange={handleChange}
              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="">Any Rating</option>
              {[6,7,8,9,10].map(n => <option key={n} value={n}>{n}+ Stars</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Safety Score</label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.minSafety || 50}
              onChange={(e) => onFiltersChange(prev => ({ ...prev, minSafety: e.target.value }))}
              className="w-full"
            />
            <div className="text-center text-white/70 text-sm">{filters.minSafety || 50}+ score</div>
          </div>
        </div>
      )}

      {/* Investment Filters */}
      {activeTab === 'investment' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Investment Score</label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.minInvestmentScore || 50}
              onChange={(e) => onFiltersChange(prev => ({ ...prev, minInvestmentScore: e.target.value }))}
              className="w-full"
            />
            <div className="text-center text-white/70 text-sm">{filters.minInvestmentScore || 50}+ score</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Market Trend</label>
            <select
              name="marketTrend"
              value={filters.marketTrend || ''}
              onChange={handleChange}
              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="">Any Trend</option>
              <option value="up">Rising Market</option>
              <option value="down">Declining Market</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Days on Market</label>
            <input
              type="number"
              placeholder="Max days"
              value={filters.maxDaysOnMarket || ''}
              onChange={handleChange}
              name="maxDaysOnMarket"
              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
            />
          </div>
        </div>
      )}

      {/* AI Filters */}
      {activeTab === 'ai' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-purple-400/30">
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="w-5 h-5 text-purple-300" />
              <h3 className="font-semibold text-white">AI-Powered Matching</h3>
            </div>
            <p className="text-sm text-white/70 mb-3">
              Let our AI find properties that match your lifestyle and investment goals.
            </p>
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
              Enable AI Recommendations
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Investment Strategy</label>
            <select
              name="investmentStrategy"
              value={filters.investmentStrategy || ''}
              onChange={handleChange}
              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="">Select Strategy</option>
              <option value="flip">House Flipping</option>
              <option value="rental">Rental Income</option>
              <option value="longterm">Long-term Appreciation</option>
              <option value="commercial">Commercial Investment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Risk Tolerance</label>
            <select
              name="riskTolerance"
              value={filters.riskTolerance || ''}
              onChange={handleChange}
              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="">Select Risk Level</option>
              <option value="low">Conservative</option>
              <option value="medium">Moderate</option>
              <option value="high">Aggressive</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Property Card with advanced features
const EnhancedPropertyCard = ({ property, onSelect, onFavorite, onShare }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    onFavorite?.(property, !isFavorited);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    onShare?.(property);
  };

  const getInvestmentScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div 
      className="backdrop-blur-sm bg-white/10 border border-white/20 p-4 rounded-xl hover:bg-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer group transform hover:scale-[1.02]"
      onClick={() => onSelect(property)}
    >
      {/* Header with actions */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-200 transition-colors">
            {property.address}
          </h3>
          <p className="text-sm text-white/70">{property.city}, {property.state}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleFavorite}
            className={`p-2 rounded-full transition-all ${
              isFavorited ? 'bg-red-500/30 text-red-300' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20 transition-all"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Price and Investment Score */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-2xl font-bold text-green-300">
          ${property.price.toLocaleString()}
        </div>
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-purple-300" />
          <span className={`font-semibold ${getInvestmentScoreColor(property.investmentScore)}`}>
            {property.investmentScore}/100
          </span>
        </div>
      </div>

      {/* Property Details Grid */}
      <div className="grid grid-cols-2 gap-2 text-sm text-white/80 mb-3">
        <div className="flex items-center space-x-2">
          <Home className="w-4 h-4 text-blue-300" />
          <span>{property.type}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-blue-300" />
          <span>{property.yearBuilt}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-blue-300">🛏️</span>
          <span>{property.bedrooms} bed</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-blue-300">🚿</span>
          <span>{property.bathrooms} bath</span>
        </div>
        <div className="flex items-center space-x-2">
          <Ruler className="w-4 h-4 text-blue-300" />
          <span>{property.sqft.toLocaleString()} sq ft</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-300" />
          <span>{property.commuteTime}min commute</span>
        </div>
      </div>

      {/* Enhanced Metrics */}
      <div className="grid grid-cols-3 gap-2 text-xs text-white/70 mb-3">
        <div className="text-center">
          <div className="font-semibold text-white">{property.walkabilityScore}</div>
          <div>Walkability</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-white">{property.schoolRating}/10</div>
          <div>Schools</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-white">{property.safetyScore}</div>
          <div>Safety</div>
        </div>
      </div>

      {/* Market Indicators */}
      <div className="flex items-center justify-between text-xs text-white/70 mb-3">
        <div className="flex items-center space-x-1">
          <TrendingUp className={`w-3 h-3 ${property.marketTrend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
          <span>{property.marketTrend === 'up' ? 'Rising' : 'Declining'}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Eye className="w-3 h-3" />
          <span>{property.viewCount} views</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>{property.daysOnMarket}d on market</span>
        </div>
      </div>

      {/* Agent Info */}
      <div className="pt-3 border-t border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/90 font-medium">{property.agent}</p>
            <p className="text-xs text-white/70">{property.agency}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-white/80">4.8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Property List with advanced features
const EnhancedPropertyList = ({ properties, onPropertySelect, onFavorite, onShare, onClose }) => {
  const [sortBy, setSortBy] = useState('price');
  const [viewMode, setViewMode] = useState('card');

  const sortedProperties = useMemo(() => {
    return [...properties].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price;
        case 'investment':
          return b.investmentScore - a.investmentScore;
        case 'newest':
          return b.yearBuilt - a.yearBuilt;
        case 'size':
          return b.sqft - a.sqft;
        default:
          return 0;
      }
    });
  }, [properties, sortBy]);

  return (
    <div className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl shadow-2xl h-full overflow-hidden border border-white/20">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Properties ({properties.length})</h2>
          <p className="text-sm text-white/70">Smart-filtered results</p>
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
        >
          <option value="price">Sort by Price</option>
          <option value="investment">Sort by Investment Score</option>
          <option value="newest">Sort by Year Built</option>
          <option value="size">Sort by Size</option>
        </select>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('card')}
            className={`p-2 rounded-lg ${viewMode === 'card' ? 'bg-blue-500/30' : 'bg-white/10'}`}
          >
            <List className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`p-2 rounded-lg ${viewMode === 'compact' ? 'bg-blue-500/30' : 'bg-white/10'}`}
          >
            <Layers className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Property List */}
      <div className="overflow-y-auto h-full space-y-4">
        {sortedProperties.length === 0 ? (
          <div className="text-center py-8">
            <Home className="w-12 h-12 text-white/60 mx-auto mb-3" />
            <p className="text-white/70">No properties match your criteria.</p>
            <p className="text-white/50 text-sm">Try adjusting your filters.</p>
          </div>
        ) : (
          sortedProperties.map(property => (
            <EnhancedPropertyCard
              key={property.id}
              property={property}
              onSelect={onPropertySelect}
              onFavorite={onFavorite}
              onShare={onShare}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Main Enhanced Real Estate Component
const EnhancedRealEstate = () => {
  // State management
  const [showFilters, setShowFilters] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [properties, setProperties] = useState([]);
  const [zones, setZones] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapStyle, setMapStyle] = useState('dark');
  const [searchRadius, setSearchRadius] = useState(null);
  const [customPolygon, setCustomPolygon] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Enhanced filters
  const [filters, setFilters] = useState({
    priceRange: [0, 5000000],
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    yearBuilt: '',
    zone: '',
    agent: '',
    maxCommute: 60,
    minWalkability: 50,
    minSchoolRating: '',
    minSafety: 50,
    minInvestmentScore: 50,
    marketTrend: '',
    maxDaysOnMarket: '',
    investmentStrategy: '',
    riskTolerance: ''
  });

  // Google Maps configuration
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCq3GgamCTT0JAC5UJyJ0NqTdT4AcoCKSE",
    libraries: ["places", "visualization", "geometry"],
  });

  const mapRef = useRef(null);
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const defaultCenter = {
    lat: 34.052235,
    lng: -118.243683,
  };

  // Load data with GraphQL - same pattern as Google.jsx
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load properties, zones, and agents in parallel - same as Google.jsx
        const [propertiesData, zonesData, agentsData] = await Promise.all([
          graphqlRequest(GET_PROPERTIES),
          graphqlRequest(GET_ZONES),
          graphqlRequest(GET_AGENTS)
        ]);

        const transformedProperties = transformEnhancedPropertyData(propertiesData.listedProperties);
        setProperties(transformedProperties);
        setZones(zonesData.geoZones);
        setAgents(agentsData.agentProfiles);

      } catch (err) {
        setError(err.message);
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Enhanced property filtering with AI features
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Basic filters
      const priceMatch = property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1];
      const typeMatch = !filters.propertyType || property.type === filters.propertyType;
      const bedroomsMatch = !filters.bedrooms || property.bedrooms >= parseInt(filters.bedrooms);
      const bathroomsMatch = !filters.bathrooms || property.bathrooms >= parseInt(filters.bathrooms);
      const yearBuiltMatch = !filters.yearBuilt || property.yearBuilt >= parseInt(filters.yearBuilt);
      
      // Lifestyle filters
      const commuteMatch = property.commuteTime <= filters.maxCommute;
      const walkabilityMatch = property.walkabilityScore >= filters.minWalkability;
      const schoolMatch = !filters.minSchoolRating || property.schoolRating >= parseInt(filters.minSchoolRating);
      const safetyMatch = property.safetyScore >= filters.minSafety;
      
      // Investment filters
      const investmentMatch = property.investmentScore >= filters.minInvestmentScore;
      const trendMatch = !filters.marketTrend || property.marketTrend === filters.marketTrend;
      const daysMatch = !filters.maxDaysOnMarket || property.daysOnMarket <= parseInt(filters.maxDaysOnMarket);

      return priceMatch && typeMatch && bedroomsMatch && bathroomsMatch && yearBuiltMatch &&
             commuteMatch && walkabilityMatch && schoolMatch && safetyMatch &&
             investmentMatch && trendMatch && daysMatch;
    });
  }, [properties, filters]);

  // Enhanced property selection with insights - same pattern as Google.jsx
  const handlePropertySelect = async (property) => {
    setSelectedProperty(property);
    
    try {
      const insightData = await graphqlRequest(GET_PROPERTY_INSIGHT, {
        propertyId: property.id
      });
      
      setSelectedProperty(prev => ({
        ...prev,
        insight: insightData.propertyInsight,
        insights: {
          marketValue: insightData.propertyInsight?.marketValue?.estimatedValue || property.price * (0.95 + Math.random() * 0.1),
          rentEstimate: Math.floor(property.price * 0.005),
          capRate: (Math.random() * 8 + 2).toFixed(2),
          cashFlow: Math.floor(Math.random() * 1000 - 500),
          appreciation: (Math.random() * 10 + 2).toFixed(1),
          totalReturn: (Math.random() * 15 + 5).toFixed(1),
          taxEstimate: insightData.propertyInsight?.taxEstimate?.estimatedTax || 0,
          lastSoldFor: insightData.propertyInsight?.taxEstimate?.lastSoldFor || null
        }
      }));
    } catch (err) {
      console.error('Error loading property insight:', err);
      // Fallback to mock data if GraphQL fails
      setSelectedProperty(prev => ({
        ...prev,
        insights: {
          marketValue: property.price * (0.95 + Math.random() * 0.1),
          rentEstimate: Math.floor(property.price * 0.005),
          capRate: (Math.random() * 8 + 2).toFixed(2),
          cashFlow: Math.floor(Math.random() * 1000 - 500),
          appreciation: (Math.random() * 10 + 2).toFixed(1),
          totalReturn: (Math.random() * 15 + 5).toFixed(1)
        }
      }));
    }
  };

  // Map style configurations
  const mapStyles = {
    dark: [
      { featureType: "all", elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
      { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#16213e" }] },
      { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2a2a4a" }] }
    ],
    satellite: [],
    terrain: [
      { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#2c5234" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#1e3a5f" }] }
    ]
  };

  // Get marker icon based on property features
  const getEnhancedMarkerIcon = (property) => {
    let color = 'green';
    if (property.price >= 2000000) color = 'red';
    else if (property.price >= 1000000) color = 'orange';
    else if (property.price >= 500000) color = 'yellow';

    // Add investment score indicator
    const size = property.investmentScore >= 80 ? 35 : 30;

    return {
      url: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
      scaledSize: new window.google.maps.Size(size, size),
    };
  };

  // Handle favorite property
  const handleFavorite = (property, isFavorited) => {
    console.log(`Property ${property.id} ${isFavorited ? 'added to' : 'removed from'} favorites`);
    // Implement favorite logic
  };

  // Handle share property
  const handleShare = (property) => {
    if (navigator.share) {
      navigator.share({
        title: `Check out this property: ${property.address}`,
        text: `${property.bedrooms}bed/${property.bathrooms}bath - $${property.price.toLocaleString()}`,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${property.address} - $${property.price.toLocaleString()}`);
    }
  };

  // Loading and error states
  if (loadError) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="backdrop-blur-xl bg-white/20 p-8 rounded-2xl shadow-2xl border border-white/30 text-center">
          <p className="text-red-300 text-lg">Error loading maps</p>
        </div>
      </div>
    );
  }

  if (!isLoaded || loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="backdrop-blur-xl bg-white/20 p-8 rounded-2xl shadow-2xl border border-white/30 text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-white" />
          <p className="text-white">{loading ? 'Loading properties...' : 'Loading Map...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="backdrop-blur-xl bg-white/20 p-8 rounded-2xl shadow-2xl border border-white/30 text-center">
          <p className="text-red-300 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500/30 hover:bg-blue-500/50 border border-blue-400/50 text-white px-6 py-3 rounded-xl transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen relative flex bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Enhanced Control Panel */}
      <div className="fixed top-20 left-6 z-50 flex flex-col space-y-3">
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/30 p-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 ${
              showFilters ? 'ring-2 ring-blue-400/50' : ''
            }`}
          >
            <Filter className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => setShowList(!showList)}
            className={`backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/30 p-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 ${
              showList ? 'ring-2 ring-blue-400/50' : ''
            }`}
          >
            <List className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/30 p-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 ${
              showHeatmap ? 'ring-2 ring-red-400/50' : ''
            }`}
            title="Toggle Heatmap"
          >
            <Activity className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => setShow3D(!show3D)}
            className={`backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/30 p-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 ${
              show3D ? 'ring-2 ring-purple-400/50' : ''
            }`}
            title="Toggle 3D View"
          >
            <Layers className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Enhanced Legend */}
      <div className="absolute top-6 right-6 z-20 backdrop-blur-xl bg-white/10 p-6 rounded-2xl shadow-2xl border border-white/20">
        <h3 className="font-bold text-white mb-4">Enhanced Legend</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-400 rounded-full"></div>
            <span className="text-sm text-white/90">$0 - $500K</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            <span className="text-sm text-white/90">$500K - $1M</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
            <span className="text-sm text-white/90">$1M - $2M</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-400 rounded-full"></div>
            <span className="text-sm text-white/90">$2M+</span>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-white/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Properties:</span>
            <span className="text-white font-semibold">{filteredProperties.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Avg Investment Score:</span>
            <span className="text-green-300 font-semibold">
              {Math.round(filteredProperties.reduce((sum, p) => sum + p.investmentScore, 0) / filteredProperties.length || 0)}
            </span>
          </div>
        </div>

        {/* Map Style Selector */}
        <div className="mt-4 pt-3 border-t border-white/20">
          <label className="block text-sm text-white/70 mb-2">Map Style</label>
          <select
            value={mapStyle}
            onChange={(e) => setMapStyle(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-sm"
          >
            <option value="dark">Dark</option>
            <option value="satellite">Satellite</option>
            <option value="terrain">Terrain</option>
          </select>
        </div>
      </div>

      {/* Enhanced Filter Panel */}
      {showFilters && (
        <div className="absolute top-32 left-6 z-20 w-96 max-h-[calc(100vh-160px)]">
          <EnhancedFilterPanel 
            filters={filters} 
            onFiltersChange={setFilters}
            zones={zones}
            agents={agents}
            onClose={() => setShowFilters(false)}
          />
        </div>
      )}

      {/* Enhanced Property List */}
      {showList && (
        <div className="absolute top-24 right-6 z-20 w-96 max-h-[calc(100vh-140px)]">
          <EnhancedPropertyList 
            properties={filteredProperties} 
            onPropertySelect={handlePropertySelect}
            onFavorite={handleFavorite}
            onShare={handleShare}
            onClose={() => setShowList(false)}
          />
        </div>
      )}

      {/* Enhanced Google Map */}
      <div className="w-full h-full rounded-2xl overflow-hidden">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={defaultCenter}
          zoom={12}
          onLoad={onMapLoad}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: true,
            styles: mapStyles[mapStyle],
            tilt: show3D ? 45 : 0,
          }}
        >
          {/* Property Markers */}
          {filteredProperties.map(property => (
            <Marker
              key={property.id}
              position={{ lat: property.lat, lng: property.lng }}
              onClick={() => handlePropertySelect(property)}
              icon={getEnhancedMarkerIcon(property)}
            />
          ))}

          {/* Heatmap Layer */}
          {showHeatmap && (
            <HeatmapLayer
              data={filteredProperties.map(p => ({
                location: new window.google.maps.LatLng(p.lat, p.lng),
                weight: p.price / 100000
              }))}
              options={{
                radius: 50,
                opacity: 0.6,
                gradient: [
                  'rgba(0, 255, 255, 0)',
                  'rgba(0, 255, 255, 1)',
                  'rgba(0, 191, 255, 1)',
                  'rgba(0, 127, 255, 1)',
                  'rgba(0, 63, 255, 1)',
                  'rgba(0, 0, 255, 1)',
                  'rgba(0, 0, 223, 1)',
                  'rgba(0, 0, 191, 1)',
                  'rgba(0, 0, 159, 1)',
                  'rgba(0, 0, 127, 1)',
                  'rgba(63, 0, 91, 1)',
                  'rgba(127, 0, 63, 1)',
                  'rgba(191, 0, 31, 1)',
                  'rgba(255, 0, 0, 1)'
                ]
              }}
            />
          )}

          {/* Search Radius Circle */}
          {searchRadius && (
            <Circle
              center={searchRadius.center}
              radius={searchRadius.radius}
              options={{
                fillColor: '#4F46E5',
                fillOpacity: 0.1,
                strokeColor: '#4F46E5',
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
          )}

          {/* Custom Polygon Search */}
          {customPolygon.length > 0 && (
            <Polygon
              paths={customPolygon}
              options={{
                fillColor: '#10B981',
                fillOpacity: 0.1,
                strokeColor: '#10B981',
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
          )}

          {/* Enhanced Info Window */}
          {selectedProperty && (
            <InfoWindow
              position={{ lat: selectedProperty.lat, lng: selectedProperty.lng }}
              onCloseClick={() => setSelectedProperty(null)}
            >
              <div className="p-6 max-w-md bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-blue-300">{selectedProperty.address}</h3>
                    <p className="text-sm text-white/70">{selectedProperty.city}, {selectedProperty.state}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">
                      ${selectedProperty.price.toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Target className="w-4 h-4 text-purple-300" />
                      <span className="text-sm text-purple-300">
                        {selectedProperty.investmentScore}/100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="flex items-center space-x-2">
                    <Home className="w-4 h-4 text-blue-400" />
                    <span>{selectedProperty.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>{selectedProperty.yearBuilt}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400">🛏️</span>
                    <span>{selectedProperty.bedrooms} bed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400">🚿</span>
                    <span>{selectedProperty.bathrooms} bath</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Ruler className="w-4 h-4 text-blue-400" />
                    <span>{selectedProperty.sqft.toLocaleString()} sq ft</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>{selectedProperty.commuteTime}min commute</span>
                  </div>
                </div>

                {/* Enhanced Metrics */}
                <div className="grid grid-cols-3 gap-3 text-center text-sm mb-4">
                  <div className="bg-white/10 rounded-lg p-2">
                    <div className="font-bold text-green-300">{selectedProperty.walkabilityScore}</div>
                    <div className="text-xs text-white/70">Walkability</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2">
                    <div className="font-bold text-yellow-300">{selectedProperty.schoolRating}/10</div>
                    <div className="text-xs text-white/70">Schools</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2">
                    <div className="font-bold text-blue-300">{selectedProperty.safetyScore}</div>
                    <div className="text-xs text-white/70">Safety</div>
                  </div>
                </div>

                {/* Investment Insights */}
                {selectedProperty.insights && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-400/30">
                    <h4 className="font-semibold mb-2 text-purple-300 flex items-center">
                      <Brain className="w-4 h-4 mr-2" />
                      AI Investment Analysis
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-white/70">Market Value:</span>
                        <div className="font-semibold text-green-300">
                          ${selectedProperty.insights.marketValue.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-white/70">Rent Estimate:</span>
                        <div className="font-semibold text-blue-300">
                          ${selectedProperty.insights.rentEstimate}/mo
                        </div>
                      </div>
                      <div>
                        <span className="text-white/70">Cap Rate:</span>
                        <div className="font-semibold text-yellow-300">
                          {selectedProperty.insights.capRate}%
                        </div>
                      </div>
                      <div>
                        <span className="text-white/70">Cash Flow:</span>
                        <div className={`font-semibold ${selectedProperty.insights.cashFlow >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                          ${selectedProperty.insights.cashFlow}/mo
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nearby Amenities */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-white flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Nearby Amenities
                  </h4>
                  <div className="space-y-1">
                    {selectedProperty.nearbyAmenities.slice(0, 3).map((amenity, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-white/80">{amenity.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white/60">{amenity.distance.toFixed(1)}mi</span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-white/70 ml-1">{amenity.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agent Info */}
                <div className="pt-3 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{selectedProperty.agent}</p>
                      <p className="text-sm text-white/70">{selectedProperty.agency}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button className="p-2 bg-blue-500/30 rounded-lg hover:bg-blue-500/50 transition-all">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-green-500/30 rounded-lg hover:bg-green-500/50 transition-all">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all">
                    Schedule Tour
                  </button>
                  <button 
                    onClick={() => handleFavorite(selectedProperty, true)}
                    className="p-2 bg-red-500/30 rounded-lg hover:bg-red-500/50 transition-all"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleShare(selectedProperty)}
                    className="p-2 bg-green-500/30 rounded-lg hover:bg-green-500/50 transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default EnhancedRealEstate;