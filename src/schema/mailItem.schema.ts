import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { SortPlanVersion } from './sortPlanVersion.schema';

export enum EMailItemStatus {
  PANDING,
  PROCESSED,
  REPORTED,
}

export enum EResponseCode {
  UNKNOWN,
  SORTED,
  BAD_BARCODE,
  OUT_OF_SORT_SCHEME,
  ITEM_SIZE_OUT_OF_LIMITS,
}

export enum EAssociationResult {
  NORMAL,
  OUT_OF_SORT_SCHEME,
  MULTIPLE_VALID_BARCODES,
  BARCODE_READ_FAIL,
}

@Schema()
export class MailItem {
  @Prop({ required: true })
  scanDateTime: Date;

  @Prop({ required: true, maxlength: 10 })
  destination: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SortPlanVersion',
  })
  sortPlanVersion: SortPlanVersion;

  @Prop({ required: true, maxlength: 10 })
  sortCode: string;

  @Prop({ required: true, default: EResponseCode.UNKNOWN, enum: EResponseCode })
  responseCode: string;

  @Prop({ required: true, maxlength: 500 })
  responseReason: string;

  @Prop({ required: true, maxlength: 50 })
  barcodeData: string;

  @Prop({
    required: true,
    default: EMailItemStatus.PANDING,
    enum: EMailItemStatus,
  })
  status: string;

  @Prop({
    required: true,
    default: EAssociationResult.NORMAL,
    enum: EAssociationResult,
  })
  associationResult: string;
}

export type MailItemDocument = HydratedDocument<MailItem>;

export const MailItemSchema = SchemaFactory.createForClass(MailItem);
