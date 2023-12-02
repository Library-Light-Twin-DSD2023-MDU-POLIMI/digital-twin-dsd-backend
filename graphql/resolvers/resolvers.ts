import { GraphQLError } from 'graphql';
import mongoose from 'mongoose';

import {
  LightingAsset,
  LightingAssetTimeSeriesData,
  WorkOrder,
} from '../models/index';

import {
  IAddLightingAssetInput,
  IAddWorkOrderInput,
  ILightingAssetMeasurementInput,
  IUpdateLightingAssetInput,
  IUpdateWorkOrderInput,
} from './iResolvers/iMutations';

import {
  ILightingAssetFilter,
  ISortAndPaginate,
  ITimeSeriesDataThresholds,
} from './iResolvers/iQueries';

const resolvers = {
  Query: {
    //LightingAsset: {
      async lightingAsset(_: unknown, { ID }: { ID: string }) {
        // Implement logic to fetch a lighting asset based on provided args
        // args.input can be used for sorting and pagination
        return await LightingAsset.findById(ID);
      },
      async lightingAssets(
        _: any,
        args: { input: ISortAndPaginate; filter: ILightingAssetFilter }
      ) {
        // Start with a basic query
        let query = args.input.searchText
          ? LightingAsset.find({ 'location.area': args.input.searchText })
          : LightingAsset.find();

        // Apply filters

        //Location is not finished
        if (args.filter) {
          if (args.filter.floor) {
            query = query.where('location.floor').equals(args.filter.floor);
          }
          if (args.filter.section) {
            query = query.where('location.section').equals(args.filter.section);
          }
          if (args.filter.lightingType) {
            query = query.where('type').equals(args.filter.lightingType);
          }
          if (args.filter.currentStatus) {
            query = query
              .where('currentStatus')
              .equals(args.filter.currentStatus);
          }
          if (args.filter.predictedStatus) {
            query = query
              .where('predictiveStatus')
              .equals(args.filter.predictedStatus);
          }
        }

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
    //},

    //LightingAssetTimeSeriesData: {
      async getLightingAssetTimeSeriesData(
        _: any,
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

        // Aggregation pipeline
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
              averageIlluminance: { $avg: '$illuminance.maintainedAverage' },
              averageGlare: { $avg: '$glare.UGR' },
              averageColorRendering: { $avg: '$colorRendering.CRI' },
              averageColorTemperature: { $avg: '$colorTemperature.CCT' },
              averageFlicker: { $avg: '$flicker.SVM' },
              averageColorPreference: { $avg: '$colorPreference.PVF' },
              averagePhotobiologicalSafety: {
                $avg: '$photobiologicalSafety.UV',
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

        // Execute the aggregation pipeline
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
    //},

    //WorkOrder: {
      async workOrder(_: unknown, { ID }: { ID: string }) {
        return await WorkOrder.findById(ID);
      },

      async workOrders(_: unknown) {
        return await WorkOrder.find();
      },
    //},
  },

  Mutations: {
    //LightingAsset: {
      //LightingAsset

      async addLightingAsset(
        _: unknown,
        args: { input: IAddLightingAssetInput }
      ) {
        try {
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
          const updatedLightingAsset = await LightingAsset.findByIdAndUpdate(
            args.ID,
            args.input,
            {
              new: true,
            }
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
    //},

    //When testing make sure the the date is in the correct format
    //LightingAssetTimeSeriesData: {
      async addLightingAssetMeasurements(
        _: unknown,
        args: { input: ILightingAssetMeasurementInput[] }
      ) {
        try {
          const newLightingAssetMeasurements = args.input.map(measurement => {
            const { assetId, timestamp, ...otherMeasurements } = measurement;
            return {
              metaData: {
                assetId: new mongoose.Types.ObjectId(assetId),
              },
              timpstamp: new Date(timestamp),
              ...otherMeasurements,
            };
          });

          const lightingAssetTimeSeriesData =
            await LightingAssetTimeSeriesData.insertMany(
              newLightingAssetMeasurements
            );
          return lightingAssetTimeSeriesData;
        } catch (error) {
          throw new GraphQLError(
            'Was not able to add new lighting asset measurements'
          );
        }
      },
    //},
   // WorkOrder: {
      async addWorkOrder(_: unknown, args: { input: IAddWorkOrderInput }) {
        try {
          // Create and save the new WorkOrder
          const newWorkOrder = new WorkOrder(args.input);
          const savedWorkOrder = await newWorkOrder.save();

          // If the WorkOrder has a lightingAssetID, update the corresponding LightingAsset
          if (savedWorkOrder.lightingAssetID) {
            await LightingAsset.findByIdAndUpdate(
              savedWorkOrder.lightingAssetID,
              { $addToSet: { workOrders: savedWorkOrder._id } }
            );
          }

          return savedWorkOrder;
        } catch (error) {
          throw new GraphQLError('Was not able to add a new work order');
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

          const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(
            args.ID,
            args.input,
            { new: true }
          );

          const updatedLightingAsset = await LightingAsset.findByIdAndUpdate(
            args.input.lightingAssetID
          );
          if (!updatedWorkOrder) {
            throw new GraphQLError('WorkOrder not found');
          }

          if (args.input.lightingAssetID) {
            // Remove WorkOrder ID from the old LightingAsset
            await LightingAsset.updateOne(
              { workOrders: args.ID },
              { $pull: { workOrders: args.ID } }
            );

            // Add WorkOrder ID to the new LightingAsset
            await LightingAsset.findByIdAndUpdate(args.input.lightingAssetID, {
              $addToSet: { workOrders: args.ID },
            });
          }
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
    //},
  },
};
export default resolvers;
