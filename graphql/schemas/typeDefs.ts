import { gql } from 'apollo-server-lambda';
const typeDefs = gql`
  #LightingAsset

  type LightingAsset {
    _id: ID!
    uid: String!
    currentStatus: CurrentStatus!
    predictiveStatus: PredictiveStatusType!
    type: LightingType!
    location: Location!
    workOrders: [WorkOrder]
    cilLevel: Int!
  }

  #Predicted type
  type PredictedStatusType {
    status: PredictiveStatus!
    predictedTime: String!
  }
  enum PredictiveStatus {
    OKAY
    WARNING
  }

  enum CurrentStatus {
    GOOD
    WARNING
    BROKEN
  }

  enum LightingType {
    LED
    OTHER
  }
  enum cilLevel {
    
  }

  input SortAndPaginate {
    limit: Int!
    offset: Int!
    searchText: String
  }

  input LightingAssetFilter {
    location: Location
    lightingType: LightingType
    currentStatus: CurrentStatus
    predictedStatus: PredictiveStatus
  }

  #Location
  type Location {
    floor: Int!
    section: String!
    area: String!
  }

  #LightingAssetTimeSeriesData
  type LightingAssetTimeSeriesData {
    timestamp: String!
    assetId: ID!
    illuminance: Illuminance
    glare: Glare
    colorRendering: ColorRendering
    colorTemperature: ColorTemperature
    flicker: Flicker
    colorPreference: ColorPreference
    photobiologicalSafety: PhotobiologicalSafety
  }

  type Illuminance {
    maintainedAverage: Float
    uniformityRatio: Float
    healthStatus: Int
  }

  type Glare {
    UGR: Float
    healthStatus: Int
  }

  type ColorRendering {
    CRI: Float
    healthStatus: Int
  }

  type ColorTemperature {
    CCT: Float
    Duv: Float
    healthStatus: Int
  }

  type Flicker {
    SVM: Float
    healthStatus: Int
  }

  type ColorPreference {
    PVF: Float
    healthStatus: Int
  }

  type PhotobiologicalSafety {
    UV: Float
    healthStatus: Int
  }

  type LightingAssetAverageData {
    timestamp: String!
    averageIlluminance: Float
    averageGlare: Float
    averageColorRendering: Float
    averageColorTemperature: Float
    averageFlicker: Float
    averageColorPreference: Float
    averagePhotobiologicalSafety: Float
  }

  #WorkOrder
  type WorkOrder {
    _id: ID!
    workOrderID: String!
    lightingAssetID: ID!
    workOrderStatus: WorkOrderStatus!
    description: String!
    comment: String
    location: Location!
    dateOfMaintenance: String!
  }

  enum WorkOrderStatus {
    SCHEDULED
    COMPLETED
    NOTCOMPLETED
  }

  # Define Query and/or Mutation types

  # Input types and enums for LightingAsset

  input AddLightingAssetInput {
    uid: String!
    currentStatus: CurrentStatus!
    predictiveStatus: PredictiveStatusType
    type: LightingType!
    location: Location!
  }

  input UpdateLightingAssetInput {
    uid: String!
    currentStatus: CurrentStatus
    predictiveStatus: PredictiveStatusType
    location: Location
  }

  # Input types and enums for LightingAssetTimeSeriesData

  input LightingAssetMeasurementInput {
    assetId: ID!
    timestamp: String!
    illuminance: Illuminance
    glare: Glare
    colorRendering: ColorRendering
    colorTemperature: ColorTemperature
    flicker: Flicker
    colorPreference: ColorPreference
    photobiologicalSafety: PhotobiologicalSafety
  }
  enum ComparisonType {
    LESS
    MORE
    EQUAL
  }

  input ThresholdInput {
    thresholdValue: Float!
    comparison: ComparisonType!
  }

  input TimeSeriesDataThresholds {
    illuminance: ThresholdInput
    glare: ThresholdInput
    colorRendering: ThresholdInput
    colorTemperature: ThresholdInput
    flicker: ThresholdInput
    colorPreference: ThresholdInput
    photobiologicalSafety: ThresholdInput
  }

  # Input types and enums for WorkOrder

  input AddWorkOrderInput {
    workOrderID: String!
    lightingAssetID: ID!
    workOrderStatus: WorkOrderStatus!
    description: String!
    comment: String
    location: Location!
    dateOfMaintenance: String!
  }

  input UpdateWorkOrderInput {
    workOrderID: String!
    lightingAssetID: ID!
    workOrderStatus: WorkOrderStatus
    description: String
    comment: String
    location: Location
    dateOfMaintenance: String
  }

  type Query {
    lightingAsset(id: ID!): LightingAsset
    lightingAssets(
      input: SortAndPaginate
      filter: LightingAssetFilter
    ): [LightingAsset]
    getLightingAssetTimeSeriesData(
      assetId: ID!
      startTime: String!
      endTime: String!
      thresholds: TimeSeriesDataThresholds
    ): [LightingAssetTimeSeriesData]
    getAverageLightingAssetData(
      assetId: ID!
      startTime: String!
      endTime: String!
    ): LightingAssetAverageData
    workOrder(id: ID!): WorkOrder
    workOrders: [WorkOrder]
  }

  type Mutations {
    addLightingAsset(input: AddLightingAssetInput): LightingAsset
    updateLightingAsset(id: ID!, newStatus: CurrentStatus!): LightingAsset
    removeLightingAsset(id: ID!): Boolean
    addWorkOrder(input: AddWorkOrderInput!): WorkOrder
    removeWorkOrder(id: ID!): Boolean
    updateWorkOrder(id: ID!, input: UpdateWorkOrderInput!): WorkOrder
    addLightingAssetMeasurements(
      inputs: [LightingAssetMeasurementInput!]!
    ): [LightingAssetTimeSeriesData]
  }
`;

export default typeDefs;
