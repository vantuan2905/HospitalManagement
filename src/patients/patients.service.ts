import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Patient, PatientDocument } from "./schemas/patient.schema";
import { Model } from "mongoose";
import { CreatePatientDto } from "./dto/CreatePatient.dto";
import * as bcrypt from 'bcrypt'
import {  UpdatePatientDetailDto } from "./dto/UpdatePatientDetail.dto";
import { ChangePasswordDto } from "./dto/ChangePassword.dto";
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

    async updateDetail(id:string,updatePatientDto:UpdatePatientDetailDto):Promise<Patient>{
        try {
            const updatedPatient = await this.patientModel.findByIdAndUpdate(
              id,
              updatePatientDto,
              { new: true },
            );
            if (!updatedPatient) {
              throw new NotFoundException(`Patient with ID ${id} not found`);
            }
            return updatedPatient;
          } catch (error) {
            if (error instanceof NotFoundException) {
              throw error;
            }
            console.error(
              'An unexpected error occurred while updating patient details:',
              error,
            );
            throw new InternalServerErrorException(
              'Failed to update patient details',
            );
          }
    }
    async changePassword(id:string,changePasswordDto:ChangePasswordDto):Promise<Patient>{
      try {
        console.log(changePasswordDto)
        const {oldPassword,newPassword}=changePasswordDto;
        const patient=await this.patientModel.findById(id);
        if(!patient) throw new NotFoundException(`Patient with ID ${id} not found`);
        console.log(oldPassword,newPassword)
        const isPasswordValid = await bcrypt.compare(
          oldPassword,
          patient.password,
        );
        if (!isPasswordValid) {
          throw new BadRequestException('Invalid old password');
        }
  
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        patient.password = hashedPassword;
  
        return await patient.save();
      } catch (error) {
        if (
          error instanceof NotFoundException ||
          error instanceof BadRequestException
        ) {
          throw error;
        }
        console.error(
          'An unexpected error occurred while changing patient password:',
          error,
        );
        throw new InternalServerErrorException('Failed to change password');
      }
    }
}