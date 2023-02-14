import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class SortPlanVersion {
  @Prop({ required: true, maxlength: 50 })
  machineId: string;

  @Prop({ required: true, maxlength: 5 })
  facilityCode: string;

  @Prop({ required: true, type: mongoose.Schema.Types.Date })
  receiveTimeStamp: Date;

  @Prop({ required: true, maxlength: 10 })
  sortPlanVersion: string;
}

export type SortPlanVersionDocument = HydratedDocument<SortPlanVersion>;

export const SortPlanVersionSchema =
  SchemaFactory.createForClass(SortPlanVersion);
