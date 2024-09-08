import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { role } from "src/users/enums/role";
import { EmergencyContact } from "./EmergencyContact.schema";
import { Document } from "mongoose";

@Schema()
export class Patient extends Document{
    @Prop({required:true})
    name:string

    @Prop({required:true,unique:true})
    email:string
    
    @Prop({required:true})
    password:string

    @Prop({type:String,enum:role,default:role.PATIENT})
    role:role

    @Prop({required:true,unique:true})
    phoneNumber:string

    @Prop({required:false})
    dateOfBirth?: Date;

    @Prop({ required: true })
    gender?: string;

    @Prop({ required: true })
    address?: string;

    @Prop({ type: [EmergencyContact], required: false })
    emergencyContact?: EmergencyContact[];

    @Prop({ type: [String], required: false })
    medicalHistory?: string[];

    @Prop({ type: [String], required: false })
    allergies?: string[];

    @Prop({ type: [String], required: false })
    chronicConditions?: string[];
}

export const PatientSchema=SchemaFactory.createForClass(Patient)
export type PatientDocument=Patient & Document