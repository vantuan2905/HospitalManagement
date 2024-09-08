import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Patient, PatientDocument } from "./schemas/patient.schema";
import { Model } from "mongoose";
import { CreatePatientDto } from "./dto/CreatePatient.dto";
import * as bcrypt from 'bcrypt'
@Injectable()
export class PatientsService{
    constructor(@InjectModel(Patient.name) private patientModel:Model<PatientDocument>){}

    async create(createPatientDto: CreatePatientDto): Promise<Patient>{
        try {
            const saltRounds = 10;
            
            const hashedPassword = await bcrypt.hash(
              createPatientDto.password,
              saltRounds,
            );
      
            createPatientDto.password = hashedPassword;
      
            const patient = new this.patientModel(createPatientDto);
            return await patient.save();
        } catch (error) {
            console.error(
                'An unexpected error occurred during patient creation:',
                error,
              );
              throw new InternalServerErrorException('Failed to create patient');
        }
    }


}