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

  #Illuminance
  type Illuminance {
    maintainedAverage: MaintainedAverage
    uniformityRatio: UniformityRatio
  }

  type MaintainedAverage {
    value: Float
    healthStatus: Int # Number from 1-5, indicating the health status of maintainedAverage
  }

  type UniformityRatio {
    value: Float
    healthStatus: Int # Number from 1-5, indicating the health status of uniformityRatio
  }

  #Glare

  type Glare {
    UGR: UGR
  }

  type UGR {
    value: Float
    healthStatus: Int # Number from 1-5, indicating the health status of UGR
  }

  # ColorRendering
  type ColorRendering {
    CRI: CRI
  }

  type CRI {
    value: Float
    healthStatus: Int # Number from 1-5, indicating the health status of CRI
  }

  #ColorTemperature
  type ColorTemperature {
    CCT: CCT
    Duv: Duv
  }

  type CCT {
    value: Float
    healthStatus: Int # Number from 1-5, indicating the health status of CCT
  }

  type Duv {
    value: Float
    healthStatus: Int # Number from 1-5, indicating the health status of Duv
  }

  #Flicker
  type Flicker {
    SVM: SVM
  }

  type SVM {
    value: Float
    healthStatus: Int # Number from 1-5, indicating the health status of SVM
  }

  #ColorPreference
  type ColorPreference {
    PVF: PVF
  }

  type PVF {
    value: Float
    healthStatus: Int # Number from 1-5, indicating the health status of PVF
  }

  #PhotobiologicalSafety
  type PhotobiologicalSafety {
    UV: PhotobiologicalSafetyUV
  }

  type PhotobiologicalSafetyUV {
    value: Float
    healthStatus: Int # Number from 1-5, indicating the health status of UV
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
    type: WorkOrderType!
    workOrderStatus: WorkOrderStatus!
    description: String!
    comment: String
    location: Location!
    dateOfMaintenance: String!
    excecutionStartDate: String
    excecutedDate: String
  }

  enum WorkOrderType {
    CM
    PM
    PDM
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
    type: WorkOrderType!
    workOrderStatus: WorkOrderStatus!
    description: String!
    comment: String
    location: Location!
    dateOfMaintenance: String!
    excecutionStartDate: String
    excecutedDate: String
  }

  input UpdateWorkOrderInput {
    workOrderID: String
    lightingAssetID: ID
    type: WorkOrderType
    workOrderStatus: WorkOrderStatus
    description: String
    comment: String
    location: Location
    dateOfMaintenance: String
    excecutionStartDate: String
    excecutedDate: String
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
