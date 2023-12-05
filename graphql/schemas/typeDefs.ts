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
    predictedStatus: PredictedStatusType
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
    power: Power
    illuminance: Illuminance
    glare: Glare
    colorRendering: ColorRendering
    colorTemperature: ColorTemperature
    flicker: Flicker
    colorPreference: ColorPreference
    photobiologicalSafety: PhotobiologicalSafety
  }

  #Power
  type Power {
    WATT: WATT
  }

  type WATT {
    value: Float
    healthStatus: Int # Number from 1-5, indicating the health status of Watt
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

  #MetricMetaData
  type Metric {
    metric: String!
    unit: String!
    scale: Scale
    information: String
    tooltipSummary: String
  }

  type Scale {
    tooHigh: String
    perfect: String
    good: String
    mid: String
    tooLow: String
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
    executionStartDate: String
    executedDate: String
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
    power: Power
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
    power: ThresholdInput
    illuminance: ThresholdInput
    glare: ThresholdInput
    colorRendering: ThresholdInput
    colorTemperature: ThresholdInput
    flicker: ThresholdInput
    colorPreference: ThresholdInput
    photobiologicalSafety: ThresholdInput
  }

  # Input types and enums for MetricMetaData

  input MetricMetaDataInput {
    metric: String!
    unit: String!
    scale: ScaleInput
    information: String
    tooltipSummary: String
  }

  input ScaleInput {
    tooHigh: String
    perfect: String
    good: String
    mid: String
    tooLow: String
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
    metrics: [Metric]
    metric(metric: String!): Metric
    workOrder(id: ID!): WorkOrder
    workOrders: [WorkOrder]
  }

  type Mutations {
    addLightingAsset(input: AddLightingAssetInput): LightingAsset
    updateLightingAsset(id: ID!, input: UpdateLightingAssetInput): LightingAsset
    removeLightingAsset(id: ID!): Boolean
    addWorkOrder(input: AddWorkOrderInput!): WorkOrder
    removeWorkOrder(id: ID!): Boolean
    updateWorkOrder(id: ID!, input: UpdateWorkOrderInput!): WorkOrder
    addLightingAssetMeasurements(
      inputs: [LightingAssetMeasurementInput!]!
    ): [LightingAssetTimeSeriesData]
    addMetric(input: MetricMetaDataInput): Metric
    updateMetric(input: MetricMetaDataInput): Metric
    removeMetric(metric: String!): Metric
  }
`;

export default typeDefs;
