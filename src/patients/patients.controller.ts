import { Body, Controller, InternalServerErrorException, Post } from "@nestjs/common";
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
}