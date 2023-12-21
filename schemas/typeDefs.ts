const typeDefs = `#graphql
  #LightingAsset
  type LightingAsset {
    _id: ID!
    uid: String!
    currentStatus: CurrentStatus!
    predictiveStatus: PredictedStatusType!
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

  input PredictedStatusTypeInput {
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
    location: LocationInput
    lightingType: LightingType
    currentStatus: CurrentStatus
    predictedStatus: PredictedStatusTypeInput
  }

  #Location
  type Location {
    floor: Int!
    section: String!
    area: String!
  }

  input LocationInput {
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

  input PowerInput {
    WATT: WATTInput
  }

  type WATT {
    value: Float
    healthStatus: Int # Number from 1-5, indicating the health status of Watt
  }

  input WATTInput {
    value: Float
    healthStatus: Int
  }

  #Illuminance
  type Illuminance {
    maintainedAverage: MaintainedAverage
    uniformityRatio: UniformityRatio
  }

  input IlluminanceInput {
    maintainedAverage: MaintainedAverageInput
    uniformityRatio: UniformityRatioInput
  }

  type MaintainedAverage {
    value: Float
    healthStatus: Int # Number from 1-5, indicating the health status of maintainedAverage
  }

  input MaintainedAverageInput {
    value: Float
    healthStatus: Int
  }

  type UniformityRatio {
    value: Float
    healthStatus: Int # Number from 1-5, indicating the health status of uniformityRatio
  }

  input UniformityRatioInput {
    value: Float
    healthStatus: Int
  }

  #Glare
  type Glare {
    UGR: UGR
  }
  input GlareInput {
    UGR: UGRInput
  }

  type UGR {
    value: Float
    healthStatus: Int # Number from 1-5, indicating the health status of UGR
  }

  input UGRInput {
    value: Float
    healthStatus: Int
  }

  # ColorRendering
  type ColorRendering {
    CRI: CRI
  }

  input ColorRenderingInput {
    CRI: CRIInput
  }

  type CRI {
    value: Float
    healthStatus: Int # Number from 1-5, indicating the health status of CRI
  }

  input CRIInput {
    value: Float
    healthStatus: Int
  }

  #ColorTemperature
  type ColorTemperature {
    CCT: CCT
    Duv: Duv
  }

  input ColorTemperatureInput {
    CCT: CCTInput
    Duv: DuvInput
  }

  type CCT {
    value: Float
    healthStatus: Int # Number from 1-5, indicating the health status of CCT
  }

  input CCTInput {
    value: Float
    healthStatus: Int
  }

  type Duv {
    value: Float
    healthStatus: Int # Number from 1-5, indicating the health status of Duv
  }

  input DuvInput {
    value: Float
    healthStatus: Int
  }

  #Flicker
  type Flicker {
    SVM: SVM
  }

  input FlickerInput {
    SVM: SVMInput
  }

  type SVM {
    value: Float
    healthStatus: Int # Number from 1-5, indicating the health status of SVM
  }

  input SVMInput {
    value: Float
    healthStatus: Int
  }

  #ColorPreference
  type ColorPreference {
    PVF: PVF
  }

  input ColorPreferenceInput {
    PVF: PVFInput
  }

  type PVF {
    value: Float
    healthStatus: Int # Number from 1-5, indicating the health status of PVF
  }

  input PVFInput {
    value: Float
  }

  #PhotobiologicalSafety
  type PhotobiologicalSafety {
    UV: PhotobiologicalSafetyUV
  }

  input PhotobiologicalSafetyInput {
    UV: PhotobiologicalSafetyUVInput
  }

  type PhotobiologicalSafetyUV {
    value: Float
    healthStatus: Int # Number from 1-5, indicating the health status of UV
  }

  input PhotobiologicalSafetyUVInput {
    value: Float
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

  #MetricMetaData
  type Metric {
    metric: String!
    unit: String
    scale: Scale!
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
    workOrderType: WorkOrderType!
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
    predictiveStatus: PredictedStatusTypeInput
    type: LightingType!
    location: LocationInput!
  }

  input UpdateLightingAssetInput {
    uid: String!
    currentStatus: CurrentStatus
    predictiveStatus: PredictedStatusTypeInput
    location: LocationInput
  }

  # Input types and enums for LightingAssetTimeSeriesData

  input LightingAssetMeasurementInput {
    assetId: ID!
    timestamp: String!
    power: PowerInput
    illuminance: IlluminanceInput
    glare: GlareInput
    colorRendering: ColorRenderingInput
    colorTemperature: ColorTemperatureInput
    flicker: FlickerInput
    colorPreference: ColorPreferenceInput
    photobiologicalSafety: PhotobiologicalSafetyInput
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
    unit: String
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
    workOrderType: WorkOrderType!
    workOrderStatus: WorkOrderStatus!
    description: String!
    comment: String
    location: LocationInput!
    dateOfMaintenance: String!
    excecutionStartDate: String
    excecutedDate: String
  }

  input UpdateWorkOrderInput {
    workOrderID: String!
    lightingAssetID: ID!
    workOrderType: WorkOrderType
    workOrderStatus: WorkOrderStatus
    description: String
    comment: String
    location: LocationInput
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

  type Mutation {
    addLightingAsset(input: AddLightingAssetInput): LightingAsset
    updateLightingAsset(id: ID!, input: UpdateLightingAssetInput): LightingAsset
    removeLightingAsset(id: ID!): Boolean
    addLightingAssetMeasurements(
      inputs: [LightingAssetMeasurementInput!]!
    ): [LightingAssetTimeSeriesData]
    addMetric(input: MetricMetaDataInput): Metric
    updateMetric(id: ID!, input: MetricMetaDataInput): Metric
    removeMetric(id: ID!): Metric
    addWorkOrder(input: AddWorkOrderInput!): WorkOrder
    removeWorkOrder(id: ID!): Boolean
    updateWorkOrder(id: ID!, input: UpdateWorkOrderInput!): WorkOrder
  }
`;

export default typeDefs;
