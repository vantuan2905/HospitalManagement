import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { CreatePatientDto } from "./dto/CreatePatient.dto";
import { PatientsService } from "./patients.service";
import { Patient } from "./schemas/patient.schema";
import { UpdatePatientDetailDto } from "./dto/UpdatePatientDetail.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ChangePasswordDto } from "./dto/ChangePassword.dto";

@Controller('patients')
export class PatientsController{
    constructor(private readonly patientsService:PatientsService){}
    @Post()
    async create(@Body() createPatientDto:CreatePatientDto):  Promise<Patient>{
        try {
            return await this.patientsService.create(createPatientDto);
          } catch (error) {
            console.error('An unexpected error occurred:', error);
            throw new InternalServerErrorException('Failed to create patient');
          }
    }

    @Get()
    async findAll():Promise<Patient[]>{
        try {
          return await this.patientsService.findAll()
        } catch (error) {
          console.error('An unexpected error occurred:', error);
          throw new InternalServerErrorException('Failed to retrieve patients');
        }
    }

    @Get(":id")
    async findById(@Param("id") id:string):Promise<Patient>{
      try {
          const patient=await this.patientsService.findById(id)
    

          if (!patient) {
            throw new NotFoundException(`Patient with ID ${id} not found`);
          }

          return patient;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        console.error('An unexpected error occurred:', error);
        throw new InternalServerErrorException('Failed to retrieve patient');
      }
    }

    @Delete(":id")
    async remove(@Param("id") id:string):Promise<Patient>{
      try {
        const patient = await this.patientsService.remove(id);
        if (!patient) {
          throw new NotFoundException(`Patient with ID ${id} not found`);
        }
        return patient;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        console.error('An unexpected error occurred:', error);
        throw new InternalServerErrorException('Failed to delete patient');
      }
    }

    @Patch(":id")
    @UseGuards(JwtAuthGuard)
    async update(@Param("id") id:string,@Body() updateDto:UpdatePatientDetailDto,@Req() req:any){
        try {
          const patient=this.patientsService.findById(id)
          if (!patient) {
            throw new NotFoundException(`Patient with ID ${id} not found`);
          }
          console.log(req.user)
          return await this.patientsService.updateDetail(id, updateDto);
        } catch (error) {
          if (
            error instanceof BadRequestException ||
            error instanceof NotFoundException
          ) {
            throw error;
          }
          console.error('An unexpected error occurred:', error);
          throw new InternalServerErrorException(
            'Failed to update patient details',
          );
        }
    }
    @Patch(":id/changePassword")
    @UseGuards(JwtAuthGuard)
    async changePassword(@Param("id") id:string,@Body() changePasswordDto:ChangePasswordDto,@Req() req:any): Promise<Patient>{
        try {
          const patient = await this.patientsService.findById(id);
          console.log(id)
          if (!patient) {
            throw new NotFoundException(`Patient with ID ${id} not found`);
          }
      console.log(patient)
          if (patient.email !== req.user.email) {
            throw new BadRequestException(
              "You are not authorized to change this patient's password",
            );
          }
    
          return await this.patientsService.changePassword(id, changePasswordDto);
        } catch (error) {
          if (
            error instanceof BadRequestException ||
            error instanceof NotFoundException
          ) {
            throw error;
          }
          console.error('An unexpected error occurred:', error);
          throw new InternalServerErrorException('Failed to change password');
        }
    }
}