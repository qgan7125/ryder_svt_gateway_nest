import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { SortPlanVersion } from './sortPlanVersion.schema';

@Schema()
export class SortInstruction {
  @Prop({ required: true, maxlength: 50 })
  sortCode: string;

  @Prop({ required: true, maxlength: 10 })
  destination: string;

  @Prop({ required: true, maxlength: 50 })
  scanTimeStamp: Date;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SortPlanVersion',
  })
  sortPlanVersion: SortPlanVersion;
}

export type SortInstructionDocument = HydratedDocument<SortInstruction>;

export const SortInstructionSchema =
  SchemaFactory.createForClass(SortInstruction);
