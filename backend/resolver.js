import { Property, Agent, Transaction, Neighborhood } from './models.js';

const TAX_RATE = 0.015; // 1.5% property tax

const resolvers = {
  Query: {
    // ---------------- Basic Entity Queries ----------------

    listedProperties: async () => Property.find(),
    listedProperty: async (_, { id }) => Property.findById(id),

    agentProfiles: async () => Agent.find(),
    agentInsightz: async () => {const agents = await Agent.find();  // ✅ actually run the query
  console.log(agents);                // ✅ now this prints real data
  return agents;}, //--try--
    agentProfile: async (_, { id }) => Agent.findById(id),

    geoZones: async () => Neighborhood.find(),
    geoZone: async (_, { id }) => Neighborhood.findById(id),

    propertyTransactions: async () => Transaction.find(),
    propertyTransaction: async (_, { id }) => Transaction.findById(id),

    // ---------------- Computed Queries ----------------

    estateValue: async (_, { propertyId }) => {
      const property = await Property.findById(propertyId);
      const zone = await Neighborhood.findById(property.neighborhoodId);

      const value = property.sqft * (zone?.avgSalePrice || 0);
      return {
        propertyId: property._id,
        areaSqFt: property.sqft,
        estimatedValue: value,
        basedOnZoneAverage: zone?.avgSalePrice || 0,
      };
    },

    taxInfo: async (_, { propertyId }) => {
      const txn = await Transaction.findOne({ propertyId }).sort({ saleDate: -1 });
      if (!txn) return null;

      const agent = await Agent.findById(txn.sellerId || txn.buyerId);
      const tax = txn.salePrice * TAX_RATE;

      return {
        propertyId,
        lastSoldFor: txn.salePrice,
        taxRate: TAX_RATE,
        estimatedTax: tax,
        handledBy: agent?.name || 'Unknown',
      };
    },

    propertyInsight: async (_, { propertyId }) => {
      const property = await Property.findById(propertyId);
      const value = await resolvers.Query.estateValue(_, { propertyId });
      const tax = await resolvers.Query.taxInfo(_, { propertyId });

      return {
        propertyDetails: property,
        marketValue: value,
        taxEstimate: tax,
      };
    },
  },

  // ---------------- Mutations ----------------

  Mutation: {
    addProperty: async (_, { input }) => {
      const propertyData = {
        address: {
          street: input.locationDetails.streetAddress,
          city: input.locationDetails.cityName,
          state: input.locationDetails.stateName,
          zip: input.locationDetails.postalCode,
          loc: input.locationDetails.coordinates ? {
            type: 'Point',
            coordinates: input.locationDetails.coordinates
          } : null
        },
        type: input.propertyCategory,
        bedrooms: input.bedroomCount,
        bathrooms: input.bathroomCount,
        yearBuilt: input.builtYear,
        sqft: input.areaSqFt,
        lotSize: input.lotSizeInSqFt,
        ownerAgentId: input.ownerAgentId,
        neighborhoodId: input.geoZoneId
      };

      const property = new Property(propertyData);
      return await property.save();
    },

    addAgent: async (_, { input }) => {
      const agentData = {
        name: input.fullName,
        phone: input.phoneNumber,
        email: input.emailAddress,
        agency: input.agencyName
      };

      const agent = new Agent(agentData);
      return await agent.save();
    },

    addTransaction: async (_, { input }) => {
      const transactionData = {
        propertyId: input.propertyId,
        saleDate: input.saleDate,
        salePrice: input.salePrice,
        buyerId: input.buyerId,
        sellerId: input.sellerId,
        type: input.transactionType
      };

      const transaction = new Transaction(transactionData);
      return await transaction.save();
    },

    addNeighborhood: async (_, { input }) => {
      const neighborhoodData = {
        name: input.zoneName,
        polygon: input.boundaryPolygon,
        avgSalePrice: input.averagePrice,
        transactionCount: input.totalTransactions
      };

      const neighborhood = new Neighborhood(neighborhoodData);
      return await neighborhood.save();
    },

    addPropertyFromForm: async (_, { input }) => {
      let agentId = null;
      let neighborhoodId = null;

      // Create agent if agent info is provided
      if (input.agentName) {
        const agentData = {
          name: input.agentName,
          phone: input.agentPhone,
          email: input.agentEmail,
          agency: input.agentAgency
        };
        const agent = new Agent(agentData);
        const savedAgent = await agent.save();
        agentId = savedAgent._id;
      }

      // Create neighborhood if neighborhood info is provided
      if (input.neighborhoodName) {
        // Check if neighborhood already exists
        let neighborhood = await Neighborhood.findOne({ name: input.neighborhoodName });
        if (!neighborhood) {
          const neighborhoodData = {
            name: input.neighborhoodName,
            avgSalePrice: parseFloat(input.purchasePrice) || 0,
            transactionCount: 1
          };
          neighborhood = new Neighborhood(neighborhoodData);
          await neighborhood.save();
        }
        neighborhoodId = neighborhood._id;
      }

      // Parse address to extract components
      const addressParts = input.address.split(',').map(part => part.trim());
      const street = addressParts[0] || input.address;
      const city = addressParts[1] || '';
      const stateZip = addressParts[2] || '';
      const [state, zip] = stateZip.split(' ').filter(Boolean);

      // Create property
      const propertyData = {
        address: {
          street: street,
          city: city,
          state: state || '',
          zip: zip || '',
          loc: null // Could be enhanced with geocoding
        },
        type: input.propertyType,
        bedrooms: parseInt(input.bedrooms) || 0,
        bathrooms: parseFloat(input.bathrooms) || 0,
        yearBuilt: parseInt(input.yearBuilt) || 0,
        sqft: parseInt(input.squareFeet) || 0,
        lotSize: 0, // Not provided in form
        ownerAgentId: agentId,
        neighborhoodId: neighborhoodId
      };

      const property = new Property(propertyData);
      const savedProperty = await property.save();

      // Create transaction record for the purchase
      if (input.purchasePrice) {
        const transactionData = {
          propertyId: savedProperty._id,
          saleDate: new Date(),
          salePrice: parseFloat(input.purchasePrice),
          buyerId: agentId, // Assuming agent is buyer for now
          sellerId: null,
          type: 'purchase'
        };
        const transaction = new Transaction(transactionData);
        await transaction.save();
      }

      return savedProperty;
    }
  },

  // ---------------- Field-Level Resolvers ----------------

  ListedProperty: {
    locationDetails: (property) => ({
      streetAddress: property.address?.street,
      cityName: property.address?.city,
      stateName: property.address?.state,
      postalCode: property.address?.zip,
      geoCoordinates: {
        geoFormat: property.address?.loc?.type,
        coordinates: property.address?.loc?.coordinates,
      },
    }),
    propertyCategory: (property) => property.type,
    bedroomCount: (property) => property.bedrooms,
    bathroomCount: (property) => property.bathrooms,
    builtYear: (property) => property.yearBuilt,
    areaSqFt: (property) => property.sqft,
    lotSizeInSqFt: (property) => property.lotSize,

    ownerAgent: async (property) => Agent.findById(property.ownerAgentId),
    geoZone: async (property) => Neighborhood.findById(property.neighborhoodId),
    propertyTransactions: async (property) => Transaction.find({ propertyId: property._id }),
  },

  AgentProfile: {
    fullName: (agent) => agent.name,
    phoneNumber: (agent) => agent.phone,
    emailAddress: (agent) => agent.email,
    agencyName: (agent) => agent.agency,
    managedProperties: async (agent) => Property.find({ ownerAgentId: agent._id }),
  },

  PropertyTransaction: {
    relatedProperty: async (txn) => Property.findById(txn.propertyId),
    buyer: async (txn) => Agent.findById(txn.buyerId),
    seller: async (txn) => Agent.findById(txn.sellerId),
    saleDate: (txn) => txn.saleDate,
    salePrice: (txn) => txn.salePrice,
    transactionType: (txn) => txn.type,
  },

  GeoZone: {
    zoneName: (n) => n.name,
    boundaryPolygon: (n) => n.polygon,
    averagePrice: (n) => n.avgSalePrice,
    totalTransactions: (n) => n.transactionCount,
    propertiesInZone: async (n) => Property.find({ neighborhoodId: n._id }),
  },
};

export default resolvers;
