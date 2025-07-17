import mongoose from "mongoose";

const CoordinatesSchema = {
  type: { type: String },
  coordinates: [Number],
};

const AddressSchema = {
  street: String,
  city: String,
  state: String,
  zip: String,
  loc: CoordinatesSchema,
};

const PropertySchema = new mongoose.Schema({
  address: AddressSchema,
  type: String,
  bedrooms: Number,
  bathrooms: Number,
  yearBuilt: Number,
  sqft: Number,
  lotSize: Number,
  ownerAgentId: mongoose.Schema.Types.ObjectId,
  neighborhoodId: mongoose.Schema.Types.ObjectId,
});

const TransactionSchema = new mongoose.Schema({
  propertyId: mongoose.Schema.Types.ObjectId,
  saleDate: Date,
  salePrice: Number,
  buyerId: mongoose.Schema.Types.ObjectId,
  sellerId: mongoose.Schema.Types.ObjectId,
  type: String,
});

const AgentSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  agency: String,
});

const NeighborhoodSchema = new mongoose.Schema({
  name: String,
  polygon: mongoose.Schema.Types.Mixed,
  avgSalePrice: Number,
  transactionCount: Number,
});

export const Property = mongoose.model("Property", PropertySchema);
export const Transaction = mongoose.model("Transaction", TransactionSchema);
export const Agent = mongoose.model("Agent", AgentSchema);
export const Neighborhood = mongoose.model("Neighborhood", NeighborhoodSchema);
