import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Filter, List, X, Loader, Home, MapPin, Calendar, Ruler, Phone, Mail, Building } from 'lucide-react';

// GraphQL queries
let GRAPHQL_ENDPOINT =  'http://localhost:4000'; 
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

// GraphQL client function
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

// Transform GraphQL data to match frontend expectations
const transformPropertyData = (properties) => {
  return properties.map(property => ({
    id: property._id,
    lat: property.locationDetails?.geoCoordinates?.coordinates?.[1] || 34.052235,
    lng: property.locationDetails?.geoCoordinates?.coordinates?.[0] || -118.243683,
    price: property.geoZone?.averagePrice || 0,
    type: property.propertyCategory || 'unknown',
    bedrooms: property.bedroomCount || 0,
    bathrooms: property.bathroomCount || 0,
    yearBuilt: property.builtYear || 0,
    sqft: property.areaSqFt || 0,
    address: property.locationDetails?.streetAddress || 'Address not available',
    city: property.locationDetails?.cityName || '',
    state: property.locationDetails?.stateName || '',
    zone: property.geoZone?.zoneName || 'Unknown Zone',
    agent: property.ownerAgent?.fullName || 'No Agent',
    agentPhone: property.ownerAgent?.phoneNumber || '',
    agentEmail: property.ownerAgent?.emailAddress || '',
    agency: property.ownerAgent?.agencyName || '',
  }));
};

// Filter properties based on criteria
const filterProperties = (properties, filters) => {
  return properties.filter(property => {
    const priceMatch = property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1];
    const typeMatch = filters.propertyType ? property.type === filters.propertyType : true;
    const bedroomsMatch = filters.bedrooms ? property.bedrooms >= parseInt(filters.bedrooms) : true;
    const bathroomsMatch = filters.bathrooms ? property.bathrooms >= parseInt(filters.bathrooms) : true;
    const yearBuiltMatch = filters.yearBuilt ? property.yearBuilt >= parseInt(filters.yearBuilt) : true;
    const zoneMatch = filters.zone ? property.zone === filters.zone : true;
    const agentMatch = filters.agent ? property.agent === filters.agent : true;

    return priceMatch && typeMatch && bedroomsMatch && bathroomsMatch && yearBuiltMatch && zoneMatch && agentMatch;
  });
};

// --- Component: FilterPanel ---
const FilterPanel = ({ filters, onFiltersChange, zones, agents }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFiltersChange(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceRangeChange = (e, index) => {
    const newPriceRange = [...filters.priceRange];
    newPriceRange[index] = parseInt(e.target.value) || 0;
    onFiltersChange(prev => ({ ...prev, priceRange: newPriceRange }));
  };

  const resetFilters = () => {
    onFiltersChange({
      priceRange: [0, 5000000],
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      yearBuilt: '',
      zone: '',
      agent: ''
    });
  };

  return (
    <div className="backdrop-blur-xl bg-white/20 p-6 rounded-2xl shadow-2xl border border-white/30 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white drop-shadow-lg">Filter Properties</h2>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-300 hover:text-blue-100 transition-colors duration-300 drop-shadow-sm"
        >
          Reset All
        </button>
      </div>
      
      <div className="space-y-5">
        {/* Price Range */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-white/90 drop-shadow-sm">Price Range</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/70 mb-1 drop-shadow-sm">Min</label>
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange(e, 0)}
                className="w-full p-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs text-white/70 mb-1 drop-shadow-sm">Max</label>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange(e, 1)}
                className="w-full p-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
                placeholder="5000000"
              />
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <label htmlFor="propertyType" className="block text-sm font-medium text-white/90 drop-shadow-sm">Property Type</label>
          <select
            id="propertyType"
            name="propertyType"
            value={filters.propertyType}
            onChange={handleChange}
            className="w-full p-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl text-white focus:bg-white/20 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
          >
            <option value="" className="bg-gray-800 text-white">All Types</option>
            <option value="house" className="bg-gray-800 text-white">House</option>
            <option value="condo" className="bg-gray-800 text-white">Condo</option>
            <option value="townhouse" className="bg-gray-800 text-white">Townhouse</option>
            <option value="apartment" className="bg-gray-800 text-white">Apartment</option>
            <option value="commercial" className="bg-gray-800 text-white">Commercial</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <label htmlFor="bedrooms" className="block text-sm font-medium text-white/90 drop-shadow-sm">Min Bedrooms</label>
          <select
            id="bedrooms"
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleChange}
            className="w-full p-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl text-white focus:bg-white/20 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
          >
            <option value="" className="bg-gray-800 text-white">Any</option>
            <option value="1" className="bg-gray-800 text-white">1+</option>
            <option value="2" className="bg-gray-800 text-white">2+</option>
            <option value="3" className="bg-gray-800 text-white">3+</option>
            <option value="4" className="bg-gray-800 text-white">4+</option>
            <option value="5" className="bg-gray-800 text-white">5+</option>
          </select>
        </div>

        {/* Bathrooms */}
        <div className="space-y-2">
          <label htmlFor="bathrooms" className="block text-sm font-medium text-white/90 drop-shadow-sm">Min Bathrooms</label>
          <select
            id="bathrooms"
            name="bathrooms"
            value={filters.bathrooms}
            onChange={handleChange}
            className="w-full p-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl text-white focus:bg-white/20 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
          >
            <option value="" className="bg-gray-800 text-white">Any</option>
            <option value="1" className="bg-gray-800 text-white">1+</option>
            <option value="2" className="bg-gray-800 text-white">2+</option>
            <option value="3" className="bg-gray-800 text-white">3+</option>
            <option value="4" className="bg-gray-800 text-white">4+</option>
          </select>
        </div>

        {/* Year Built */}
        <div className="space-y-2">
          <label htmlFor="yearBuilt" className="block text-sm font-medium text-white/90 drop-shadow-sm">Built After</label>
          <input
            type="number"
            id="yearBuilt"
            name="yearBuilt"
            value={filters.yearBuilt}
            onChange={handleChange}
            className="w-full p-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
            placeholder="e.g., 2000"
          />
        </div>

        {/* Zone Filter */}
        <div className="space-y-2">
          <label htmlFor="zone" className="block text-sm font-medium text-white/90 drop-shadow-sm">Zone</label>
          <select
            id="zone"
            name="zone"
            value={filters.zone}
            onChange={handleChange}
            className="w-full p-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl text-white focus:bg-white/20 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
          >
            <option value="" className="bg-gray-800 text-white">All Zones</option>
            {zones.map(zone => (
              <option key={zone._id} value={zone.zoneName} className="bg-gray-800 text-white">
                {zone.zoneName}
              </option>
            ))}
          </select>
        </div>

        {/* Agent Filter */}
        <div className="space-y-2">
          <label htmlFor="agent" className="block text-sm font-medium text-white/90 drop-shadow-sm">Agent</label>
          <select
            id="agent"
            name="agent"
            value={filters.agent}
            onChange={handleChange}
            className="w-full p-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl text-white focus:bg-white/20 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
          >
            <option value="" className="bg-gray-800 text-white">All Agents</option>
            {agents.map(agent => (
              <option key={agent._id} value={agent.fullName} className="bg-gray-800 text-white">
                {agent.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

// --- Component: PropertyList ---
const PropertyList = ({ properties, onPropertySelect }) => {
  return (
    <div className="backdrop-blur-xl bg-white/20 p-6 rounded-2xl shadow-2xl h-full overflow-y-auto border border-white/30 animate-fade-in">
      <h2 className="text-xl font-bold mb-4 text-white drop-shadow-lg">
        Properties ({properties.length})
      </h2>
      
      {properties.length === 0 ? (
        <div className="text-center py-8">
          <Home className="w-12 h-12 text-white/60 mx-auto mb-3" />
          <p className="text-white/70">No properties found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map(property => (
            <div 
              key={property.id} 
              className="backdrop-blur-sm bg-white/10 border border-white/20 p-4 rounded-xl hover:bg-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer group transform hover:scale-[1.02]"
              onClick={() => onPropertySelect(property)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-white drop-shadow-sm group-hover:text-blue-200 transition-colors">
                  {property.address}
                </h3>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-300 drop-shadow-sm">
                    ${property.price.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm text-white/80">
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
                  <MapPin className="w-4 h-4 text-blue-300" />
                  <span>{property.zone}</span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-sm text-white/70">
                  <span className="text-blue-300">Agent:</span> {property.agent}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
const Google = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showList, setShowList] = useState(false);
  const [properties, setProperties] = useState([]);
  const [zones, setZones] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 5000000],
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    yearBuilt: '',
    zone: '',
    agent: ''
  });
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Google Maps Load Script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCq3GgamCTT0JAC5UJyJ0NqTdT4AcoCKSE",
    libraries: ["places"],
  });

  const mapRef = useRef(null);
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const defaultCenter = {
    lat: 34.052235,
    lng: -118.243683,
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load properties, zones, and agents in parallel
        const [propertiesData, zonesData, agentsData] = await Promise.all([
          graphqlRequest(GET_PROPERTIES),
          graphqlRequest(GET_ZONES),
          graphqlRequest(GET_AGENTS)
        ]);

        const transformedProperties = transformPropertyData(propertiesData.listedProperties);
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

  // Get property insight when property is selected
  const handlePropertySelect = async (property) => {
    setSelectedProperty(property);
    
    try {
      const insightData = await graphqlRequest(GET_PROPERTY_INSIGHT, {
        propertyId: property.id
      });
      
      setSelectedProperty({
        ...property,
        insight: insightData.propertyInsight
      });
    } catch (err) {
      console.error('Error loading property insight:', err);
    }
  };

  // Filter properties based on current filters
  const filteredProperties = filterProperties(properties, filters);

  // Get marker color based on price
  const getMarkerColor = (price) => {
    if (price >= 2000000) return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    if (price >= 1000000) return 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png';
    if (price >= 500000) return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
  };

  if (loadError) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="backdrop-blur-xl bg-white/20 p-8 rounded-2xl shadow-2xl border border-white/30 text-center">
          <p className="text-red-300 text-lg">Error loading maps</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="backdrop-blur-xl bg-white/20 p-8 rounded-2xl shadow-2xl border border-white/30 text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-white" />
          <p className="text-white">Loading Map...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="backdrop-blur-xl bg-white/20 p-8 rounded-2xl shadow-2xl border border-white/30 text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-white" />
          <p className="text-white">Loading properties...</p>
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
            className="backdrop-blur-sm bg-blue-500/30 hover:bg-blue-500/50 border border-blue-400/50 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen relative flex bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Control Panel */}
<div className="fixed top-20 left-6 z-50 flex space-x-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/30 p-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 ${
            showFilters ? 'ring-2 ring-blue-400/50' : ''
          }`}
        >
          <Filter className="w-5 h-5 text-white drop-shadow-lg" />
        </button>
        <button
          onClick={() => setShowList(!showList)}
          className={`backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/30 p-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 ${
            showList ? 'ring-2 ring-blue-400/50' : ''
          }`}
        >
          <List className="w-5 h-5 text-white drop-shadow-lg" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute top-6 right-6 z-20 backdrop-blur-xl bg-white/20 p-6 rounded-2xl shadow-2xl border border-white/30">
        <h3 className="font-bold text-white drop-shadow-lg mb-4">Property Values</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-400 rounded-full shadow-lg"></div>
            <span className="text-sm text-white/90">$0 - $500K</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-lg"></div>
            <span className="text-sm text-white/90">$500K - $1M</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-orange-400 rounded-full shadow-lg"></div>
            <span className="text-sm text-white/90">$1M - $2M</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-400 rounded-full shadow-lg"></div>
            <span className="text-sm text-white/90">$2M+</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-white/20">
          <p className="text-xs text-white/70">
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
<div className="absolute sm:top-32 top-40 left-6 z-20 w-80 max-h-[calc(100vh-160px)] overflow-y-auto">
          <div className="relative">
            <FilterPanel 
              filters={filters} 
              onFiltersChange={setFilters}
              zones={zones}
              agents={agents}
            />
            <button
              onClick={() => setShowFilters(false)}
              className="absolute -top-2 -right-2 backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/30 rounded-full p-2 shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="Close filters"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Property List */}
      {showList && (
        <div className="absolute top-24 right-6 z-20 w-96 max-h-[calc(100vh-140px)] overflow-y-auto">
          <div className="relative">
            <PropertyList 
              properties={filteredProperties} 
              onPropertySelect={handlePropertySelect}
            />
            <button
              onClick={() => setShowList(false)}
              className="absolute -top-2 -right-2 backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/30 rounded-full p-2 shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="Close list"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Google Map */}
      <div className="w-full h-full rounded-2xl overflow-hidden">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={defaultCenter}
          zoom={12}
          onLoad={onMapLoad}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            styles: [
              {
                featureType: "all",
                elementType: "geometry",
                stylers: [{ color: "#1a1a2e" }]
              },
              {
                featureType: "all",
                elementType: "labels.text.fill",
                stylers: [{ color: "#ffffff" }]
              },
              {
                featureType: "all",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#1a1a2e" }]
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#16213e" }]
              },
              {
                featureType: "road",
                elementType: "geometry.fill",
                stylers: [{ color: "#2a2a4a" }]
              },
              {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#1a1a2e" }]
              }
            ]
          }}
        >
          {filteredProperties.map(property => (
            <Marker
              key={property.id}
              position={{ lat: property.lat, lng: property.lng }}
              onClick={() => handlePropertySelect(property)}
              icon={{
                url: getMarkerColor(property.price),
                scaledSize: new window.google.maps.Size(30, 30),
              }}
            />
          ))}

          {selectedProperty && (
            <InfoWindow
              position={{ lat: selectedProperty.lat, lng: selectedProperty.lng }}
              onCloseClick={() => setSelectedProperty(null)}
            >
              <div className="p-4 max-w-sm bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-blue-300">{selectedProperty.address}</h3>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-400">
                      ${selectedProperty.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                
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
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>{selectedProperty.zone}</span>
                  </div>
                </div>
                
                {selectedProperty.insight && (
                  <div className="mb-4 p-3 bg-white/10 rounded-lg border border-white/20">
                    <h4 className="font-semibold mb-2 text-purple-300">Market Insight</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Estimated Value:</strong> <span className="text-green-400">${selectedProperty.insight.marketValue?.estimatedValue?.toLocaleString()}</span></p>
                      {selectedProperty.insight.taxEstimate && (
                        <p><strong>Est. Tax:</strong> <span className="text-orange-400">${selectedProperty.insight.taxEstimate.estimatedTax?.toLocaleString()}</span></p>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="p-3 bg-white/10 rounded-lg border border-white/20">
                  <h4 className="font-semibold mb-2 text-green-300">Agent Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400">👤</span>
                      <span>{selectedProperty.agent}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-blue-400" />
                      <span>{selectedProperty.agency}</span>
                    </div>
                    {selectedProperty.agentPhone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-blue-400" />
                        <span>{selectedProperty.agentPhone}</span>
                      </div>
                    )}
                    {selectedProperty.agentEmail && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span className="text-xs break-all">{selectedProperty.agentEmail}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
      
      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        /* Custom scrollbar for glass panels */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Google;