import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post } from "@nestjs/common";
import { CreatePatientDto } from "./dto/CreatePatient.dto";
import { PatientsService } from "./patients.service";
import { Patient } from "./schemas/patient.schema";

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
}