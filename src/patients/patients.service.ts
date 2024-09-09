import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
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

    async findAll():Promise<Patient[]>{
        try{
            return await this.patientModel.find();
        }catch(error){
            console.error('An unexpected error occurred while retrieving patients:',error,);
              throw new InternalServerErrorException('Failed to retrieve patients');
        }
    }

    async findById(id:string):Promise<Patient>{
        try{
            const patient=await this.patientModel.findById(id)
            if(!patient) throw new NotFoundException(`Patient with ID ${id} not found`);
            return patient
        }catch(error){
            console.error(
                'An unexpected error occurred while retrieving patient:',
                error,
              );
              throw new InternalServerErrorException('Failed to retrieve patient');
        }
    }

    async remove(id:string):Promise<Patient>{
        try {
            const deletedPatient=await this.patientModel.findByIdAndDelete(id)
            if(!deletedPatient) throw new NotFoundException(`Patient with ID ${id} not found`)
                return deletedPatient
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
              }
              console.error(
                'An unexpected error occurred while deleting patient:',
                error,
              );
              throw new InternalServerErrorException('Failed to delete patient');
        }
    }
}