import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Disconnection {
  @Prop({ default: false })
  reconnected: boolean;
}

export type DisconnectionDocument = HydratedDocument<Disconnection>;

export const DisconnectionSchema = SchemaFactory.createForClass(Disconnection);
