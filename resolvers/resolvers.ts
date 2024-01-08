import { GraphQLError } from 'graphql';
import mongoose from 'mongoose';

import {
  LightingAsset,
  LightingAssetTimeSeriesData,
  WorkOrder,
} from '../models/index';
import MetricMetaData from '../models/MetricMetaData';

import {
  IAddLightingAssetInput,
  IAddMetricMetaData,
  IAddWorkOrderInput,
  ILightingAssetMeasurementInput,
  IUpdateLightingAssetInput,
  IUpdateMetricMetaData,
  IUpdateWorkOrderInput,
} from './iResolvers/iMutations';

import {
  ILightingAssetFilter,
  ISortAndPaginate,
  ITimeSeriesDataThresholds,
} from './iResolvers/iQueries';

const resolvers = {
  Query: {
    async lightingAsset(_: unknown, { ID }: { ID: string }) {
      // args.input can be used for sorting and pagination
      return await LightingAsset.findById(ID);
    },
    async lightingAssets(
      _: unknown,
      args: { input: ISortAndPaginate; filter: ILightingAssetFilter }
    ) {
      // Start with a basic query
      const queryJson: any = {};

      // Apply filters
      if (args.filter) {
        if (args.filter.location) {
          if (args.filter.location.floor) {
            queryJson['location.floor'] = args.filter.location.floor;
          }
          if (args.filter.location.section) {
            queryJson['location.section'] = args.filter.location.section;
          }
          if (args.filter.location.area) {
            queryJson['location.area'] = args.filter.location.area;
          }
        }
        if (args.filter.lightingType) {
          queryJson['lightingType'] = args.filter.lightingType;
        }
        if (args.filter.currentStatus) {
          queryJson['currentStatus'] = args.filter.currentStatus;
        }
        if (args.filter.predictedStatus) {
          queryJson['predictedStatus'] = args.filter.predictedStatus;
        }
      }

      let query = LightingAsset.find(queryJson);

      // Apply pagination
      if (args.input) {
        if (typeof args.input.limit === 'number') {
          query = query.limit(args.input.limit);
        }
        if (typeof args.input.offset === 'number') {
          query = query.skip(args.input.offset);
        }
      }

      // Execute and return the query
      return await query.exec();
    },

    async getLightingAssetTimeSeriesData(
      _: unknown,
      args: {
        assetId: string;
        startTime: string;
        endTime: string;
        thresholds: ITimeSeriesDataThresholds;
      }
    ) {
      // Define a type for the query with an index signature
      type QueryType = {
        metaData: { assetId: string };
        timestamp: { $gte: Date; $lte: Date };
        [key: string]: any; // Allow any string as a key with any value
      };

      const query: QueryType = {
        metaData: { assetId: args.assetId },
        timestamp: {
          $gte: new Date(args.startTime),
          $lte: new Date(args.endTime),
        },
      };

      if (args.thresholds) {
        Object.entries(args.thresholds).forEach(([key, threshold]) => {
          if (threshold && threshold.thresholdValue !== undefined) {
            const comparisonOperator =
              threshold.comparison === 'LESS'
                ? '$lt'
                : threshold.comparison === 'MORE'
                ? '$gt'
                : '$eq';
            query[key] = { [comparisonOperator]: threshold.thresholdValue };
          }
        });
      }

      return await LightingAssetTimeSeriesData.find(query);
    },

    async getAverageLightingAssetData(
      _: unknown,
      args: { assetId: string; startTime: string; endTime: string }
    ) {
      const { assetId, startTime, endTime } = args;

      // Convert startTime and endTime to Date objects
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);

      // Aggregation pipeline for debugging
      const debugPipeline = [
        {
          $match: {
            'metaData.assetId': new mongoose.Types.ObjectId(assetId),
            timestamp: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $project: {
            _id: 0,
            timestamp: 1,
            illuminance: 1,
            glare: 1,
            colorRendering: 1,
            colorTemperature: 1,
            flicker: 1,
            colorPreference: 1,
            photobiologicalSafety: 1,
            // Include other fields as needed for debugging
          },
        },
      ];

      // Execute the debugging pipeline
      const debugResult = await LightingAssetTimeSeriesData.aggregate(
        debugPipeline
      );
      console.log('Debugging Matched Documents:', debugResult);

      // Original aggregation pipeline
      const pipeline = [
        {
          $match: {
            'metaData.assetId': new mongoose.Types.ObjectId(assetId),
            timestamp: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              day: { $dayOfYear: '$timestamp' },
              year: { $year: '$timestamp' },
            },
            averageIlluminance: {
              $avg: '$illuminance.maintainedAverage.value',
            },
            averageGlare: { $avg: '$glare.UGR.value' },
            averageColorRendering: { $avg: '$colorRendering.CRI.value' },
            averageColorTemperature: { $avg: '$colorTemperature.CCT.value' },
            averageFlicker: { $avg: '$flicker.SVM.value' },
            averageColorPreference: { $avg: '$colorPreference.PVF.value' },
            averagePhotobiologicalSafety: {
              $avg: '$photobiologicalSafety.UV.value',
            },
          },
        },
        {
          $project: {
            _id: 0,
            timestamp: {
              $concat: [
                { $toString: '$_id.year' },
                '-',
                { $toString: '$_id.day' },
              ],
            },
            averageIlluminance: 1,
            averageGlare: 1,
            averageColorRendering: 1,
            averageColorTemperature: 1,
            averageFlicker: 1,
            averageColorPreference: 1,
            averagePhotobiologicalSafety: 1,
          },
        },
      ];

      // Execute the original aggregation pipeline
      const result = await LightingAssetTimeSeriesData.aggregate(pipeline);

      // Format the result to match the GraphQL type 'LightingAssetAverageData'
      return result.map(item => ({
        timestamp: item.timestamp,
        averageIlluminance: item.averageIlluminance,
        averageGlare: item.averageGlare,
        averageColorRendering: item.averageColorRendering,
        averageColorTemperature: item.averageColorTemperature,
        averageFlicker: item.averageFlicker,
        averageColorPreference: item.averageColorPreference,
        averagePhotobiologicalSafety: item.averagePhotobiologicalSafety,
      }));
    },

    async metrics() {
      return await MetricMetaData.find();
    },
    async metric(_: unknown, { metric }: { metric: string }) {
      return await MetricMetaData.findOne({ metric });
    },

    async workOrder(_: unknown, { ID }: { ID: string }) {
      return await WorkOrder.findById(ID);
    },

    async workOrders() {
      return await WorkOrder.find();
    },
  },

  Mutation: {
    async addLightingAsset(
      _: unknown,
      args: { input: IAddLightingAssetInput }
    ) {
      try {
        if (![1, 2].includes(args.input.cilLevel)) {
          throw new Error('CILLevel must be either 1 or 2.');
        }
        const newLightingAsset = new LightingAsset({
          ...args.input,
        });

        return await newLightingAsset.save();
      } catch (error) {
        console.error('Error in addLightingAsset: ', error);
        throw new GraphQLError(`Was not able to add a new lighting asset`);
      }
    },

    async updateLightingAsset(
      _: unknown,
      args: { ID: string; input: IUpdateLightingAssetInput }
    ) {
      try {
        // Prepare the update object
        const updateObj: { [key: string]: any } = {};

        // Handle top-level fields except for nested objects
        for (const [key, value] of Object.entries(args.input)) {
          if (key !== 'predictiveStatus' && key !== 'location') {
            updateObj[key] = value;
          }
        }

        // Handle nested 'predictiveStatus' fields
        if (args.input.predictiveStatus) {
          for (const [key, value] of Object.entries(
            args.input.predictiveStatus
          )) {
            updateObj[`predictiveStatus.${key}`] = value;
          }
        }

        // Handle nested 'location' fields
        if (args.input.location) {
          for (const [key, value] of Object.entries(args.input.location)) {
            updateObj[`location.${key}`] = value;
          }
        }

        const updatedLightingAsset = await LightingAsset.findByIdAndUpdate(
          args.ID,
          { $set: updateObj }, // Use $set to update fields
          { new: true }
        );

        return updatedLightingAsset;
      } catch (error) {
        console.error('Error in updateLightingAsset: ', error);
        throw new GraphQLError('Was not able to update lighting asset');
      }
    },
    async removeLightingAsset(_: unknown, { ID }: { ID: string }) {
      try {
        const result = (await LightingAsset.deleteOne({ _id: ID }))
          .deletedCount;
        return result > 0;
      } catch (error) {
        console.error('Error in removeLightingAsset: ', error);
        throw new GraphQLError('Was not able to remove lighting asset');
      }
    },

    async addLightingAssetMeasurements(
      _: unknown,
      args: { input: ILightingAssetMeasurementInput[] }
    ) {
      try {
        const newLightingAssetMeasurements = args.input.map(measurement => {
          const { assetId, timestamp, ...otherMeasurements } = measurement;

          // Define a type for the relevant keys in otherMeasurements
          type RelevantKeys = Omit<
            ILightingAssetMeasurementInput,
            'assetId' | 'timestamp'
          >;

          // Function to add healthStatus to each measurement
          const addHealthStatus = (measurementData: any) => {
            const updatedData: any = {};
            for (const key in measurementData) {
              updatedData[key] = {
                ...measurementData[key],
                healthStatus: 4, // Static value for healthStatus
              };
            }
            return updatedData;
          };

          // Iterate over otherMeasurements and add healthStatus
          for (const category in otherMeasurements) {
            if (category in otherMeasurements) {
              const categoryKey = category as keyof RelevantKeys;
              if (otherMeasurements[categoryKey]) {
                otherMeasurements[categoryKey] = addHealthStatus(
                  otherMeasurements[categoryKey]
                );
              }
            }
          }

          return {
            metaData: {
              assetId: new mongoose.Types.ObjectId(assetId),
            },
            timestamp: new Date(timestamp),
            ...otherMeasurements,
          };
        });

        const lightingAssetTimeSeriesData =
          await LightingAssetTimeSeriesData.insertMany(
            newLightingAssetMeasurements
          );
        return lightingAssetTimeSeriesData;
      } catch (error) {
        console.error('Error in addLightingAssetMeasurements resolver:', error);
        throw new GraphQLError(
          'Was not able to add new measurements: ' + error
        );
      }
    },
    async addMetric(_: unknown, args: { input: IAddMetricMetaData }) {
      // Check if the metric already exists
      try {
        const existingMetric = await MetricMetaData.findOne({
          metric: args.input.metric,
        });

        if (existingMetric) {
          // If the metric already exists, throw an error or return some kind of message
          return existingMetric;
        } else {
          // If the metric does not exist, create a new one
          const newMetric = new MetricMetaData(args.input);
          return await newMetric.save();
        }
      } catch (error) {
        throw new GraphQLError('Was not able to add a new metric');
      }
    },

    async updateMetric(
      _: unknown,
      args: { ID: string; input: IUpdateMetricMetaData }
    ) {
      try {
        // Define the type for updateObj
        const updateObj: { [key: string]: any } = {};

        // Handle top-level fields except 'scale'
        for (const [key, value] of Object.entries(args.input)) {
          if (key !== 'scale') {
            updateObj[key] = value;
          }
        }

        // Handle nested 'scale' fields
        if (args.input.scale) {
          for (const [key, value] of Object.entries(args.input.scale)) {
            updateObj[`scale.${key}`] = value; // Update nested fields using dot notation
          }
        }

        const updatedMetric = await MetricMetaData.findByIdAndUpdate(
          args.ID,
          { $set: updateObj }, // Use $set to update fields
          { new: true }
        );

        if (!updatedMetric) {
          throw new Error('Metric not found');
        }

        return updatedMetric;
      } catch (e) {
        throw new Error(`Error updating metric`);
      }
    },

    async removeMetric(_: unknown, { ID }: { ID: string }) {
      try {
        const result = (await MetricMetaData.deleteOne({ _id: ID }))
          .deletedCount;
        return result > 0;
      } catch (error) {
        console.error('Error in removeMetric: ', error);
        throw new GraphQLError('Was not able to remove metric');
      }
    },

    async addWorkOrder(_: unknown, args: { input: IAddWorkOrderInput }) {
      try {
        // Check if the corresponding LightingAsset exists
        const lightingAsset = await LightingAsset.findById(
          args.input.lightingAssetID
        );
        if (!lightingAsset) {
          throw new Error('LightingAsset not found');
        }

        // Create and save the new WorkOrder
        const newWorkOrder = new WorkOrder({
          ...args.input,
        });
        const savedWorkOrder = await newWorkOrder.save();
        // Update the corresponding LightingAsset
        await LightingAsset.findByIdAndUpdate(savedWorkOrder.lightingAssetID, {
          $addToSet: { workOrders: savedWorkOrder._id },
        });

        return savedWorkOrder;
      } catch (error) {
        throw new GraphQLError('Was not able to add a new work order' + error);
      }
    },
    async updateWorkOrder(
      _: unknown,
      args: { ID: string; input: IUpdateWorkOrderInput }
    ) {
      try {
        // Validation for dateOfMaintenance
        if (args.input.dateOfMaintenance) {
          const maintenanceDate = new Date(args.input.dateOfMaintenance);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (maintenanceDate < today) {
            throw new Error('Maintenance date cannot be in the past');
          }
        }

        // Define the type for updateObj
        const updateObj: { [key: string]: unknown } = {};

        // Handle top-level fields except 'location'
        for (const [key, value] of Object.entries(args.input)) {
          if (key !== 'location') {
            updateObj[key] = value;
          }
        }

        // Handle nested 'location' fields
        if (args.input.location) {
          for (const [key, value] of Object.entries(args.input.location)) {
            updateObj[`location.${key}`] = value; // Update nested fields using dot notation
          }
        }

        const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(
          args.ID,
          { $set: updateObj }, // Use $set to update fields
          { new: true }
        );

        if (!updatedWorkOrder) {
          throw new GraphQLError('WorkOrder not found');
        }

        // Existing logic for handling lightingAssetID updates
        // ...

        return updatedWorkOrder;
      } catch (error) {
        throw new GraphQLError('Was not able to update work order');
      }
    },
    async removeWorkOrder(_: unknown, { ID }: { ID: string }) {
      try {
        const result = (await WorkOrder.deleteOne({ _id: ID })).deletedCount;
        return result > 0;
      } catch (error) {
        throw new GraphQLError('Was not able to remove work order');
      }
    },
  },
};
export default resolvers;
