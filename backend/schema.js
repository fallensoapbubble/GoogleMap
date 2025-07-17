const typeDefs = `#graphql

  scalar Date
  scalar JSON  

  # ----------------- Location ------------------

  type GeoPoint {
    geoFormat: String         # Formerly "type"
    coordinates: [Float]
  }

  type LocationDetails {
    streetAddress: String
    cityName: String
    stateName: String
    postalCode: String
    geoCoordinates: GeoPoint
  }

  # ----------------- Core Property ------------------

  type ListedProperty {
    _id: ID
    locationDetails: LocationDetails    # Instead of address
    propertyCategory: String            # Instead of "type" (e.g. condo, house)
    bedroomCount: Int
    bathroomCount: Int
    builtYear: Int
    areaSqFt: Int
    lotSizeInSqFt: Int

    ownerAgent: AgentProfile
    geoZone: GeoZone
    propertyTransactions: [PropertyTransaction]
  }

  type AgentProfile {
    _id: ID
    fullName: String
    phoneNumber: String
    emailAddress: String
    agencyName: String
    managedProperties: [ListedProperty]
  }

  type PropertyTransaction {
    _id: ID
    relatedProperty: ListedProperty
    saleDate: Date
    salePrice: Float
    buyer: AgentProfile
    seller: AgentProfile
    transactionType: String
  }

  type GeoZone {
    _id: ID
    zoneName: String
    boundaryPolygon: JSON        
    averagePrice: Float
    totalTransactions: Int
    propertiesInZone: [ListedProperty]
  }

  # ----------------- Computed Insights ------------------

  type EstateValue {
    propertyId: ID
    estimatedValue: Float
    basedOnZoneAverage: Float
    areaSqFt: Int
  }

  type TaxInfo {
    propertyId: ID
    lastSoldFor: Float
    taxRate: Float
    estimatedTax: Float
    handledBy: String
  }

  type PropertyInsight {
    propertyDetails: ListedProperty
    marketValue: EstateValue
    taxEstimate: TaxInfo
  }

  type AgentInsight {
    name: String,
    phone: String,
    email: String,
    agency: String,
    
  }

  # ----------------- Input Types ------------------

  input LocationDetailsInput {
    streetAddress: String!
    cityName: String
    stateName: String
    postalCode: String
    coordinates: [Float]
  }

  input PropertyInput {
    locationDetails: LocationDetailsInput!
    propertyCategory: String!
    bedroomCount: Int!
    bathroomCount: Float!
    builtYear: Int!
    areaSqFt: Int!
    lotSizeInSqFt: Int
    ownerAgentId: ID
    geoZoneId: ID
  }

  input AddPropertyFormInput {
    address: String!
    propertyType: String!
    bedrooms: String!
    bathrooms: String!
    squareFeet: String!
    yearBuilt: String!
    purchasePrice: String!
    description: String
    amenities: [String]
    # Optional agent info
    agentName: String
    agentPhone: String
    agentEmail: String
    agentAgency: String
    # Optional neighborhood info
    neighborhoodName: String
  }

  input AgentInput {
    fullName: String!
    phoneNumber: String
    emailAddress: String
    agencyName: String
  }

  input TransactionInput {
    propertyId: ID!
    saleDate: Date!
    salePrice: Float!
    buyerId: ID
    sellerId: ID
    transactionType: String!
  }

  input NeighborhoodInput {
    zoneName: String!
    boundaryPolygon: JSON
    averagePrice: Float
    totalTransactions: Int
  }

  # ----------------- Queries ------------------

  type Query {
    listedProperties: [ListedProperty]
    listedProperty(id: ID!): ListedProperty

    agentProfiles: [AgentProfile]
    agentInsightz: [AgentInsight] 
    agentProfile(id: ID!): AgentProfile

    geoZones: [GeoZone]
    geoZone(id: ID!): GeoZone

    propertyTransactions: [PropertyTransaction]
    propertyTransaction(id: ID!): PropertyTransaction

    estateValue(propertyId: ID!): EstateValue
    taxInfo(propertyId: ID!): TaxInfo
    propertyInsight(propertyId: ID!): PropertyInsight
  }

  # ----------------- Mutations ------------------

  type Mutation {
    addProperty(input: PropertyInput!): ListedProperty
    addAgent(input: AgentInput!): AgentProfile
    addTransaction(input: TransactionInput!): PropertyTransaction
    addNeighborhood(input: NeighborhoodInput!): GeoZone
    addPropertyFromForm(input: AddPropertyFormInput!): ListedProperty
  }
`;

export default typeDefs;
