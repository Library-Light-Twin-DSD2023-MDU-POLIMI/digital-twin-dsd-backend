import { gql } from "apollo-server-lambda";
const typeDefs = gql`
  #LightingAsset

  type LightingAsset {
    _id: ID!
    uid: String!
    currentStatus: CurrentStatus!
    predictiveStatus: PredictiveStatus!
    type: LightingType!
    location: Location!
    workOrders: [WorkOrder]
  }

  enum CurrentStatus {
    GOOD
    WARNING
    BROKEN
  }

  enum PredictiveStatus {
    OKAY
    WARNING
  }

  enum LightingType {
    LED
    OTHER
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
  }

  type Glare {
    UGR: Float
  }

  type ColorRendering {
    CRI: Float
  }

  type ColorTemperature {
    CCT: Float
    Duv: Float
  }

  type Flicker {
    SVM: Float
  }

  type ColorPreference {
    PVF: Float
  }

  type PhotobiologicalSafety {
    UV: Float
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
    predictiveStatus: PredictiveStatus
    type: LightingType!
    location: Location!
  }

  input UpdateLightingAssetInput {
    uid: String!
    currentStatus: CurrentStatus
    predictiveStatus: PredictiveStatus
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
