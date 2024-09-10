import { forwardRef, Module } from "@nestjs/common";
import { PatientsController } from "./patients.controller";
import { PatientsService } from "./patients.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Patient, PatientSchema } from "./schemas/patient.schema";
import { AuthModule } from "src/auth/auth.module";

@Module(
    {
        imports:[MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),forwardRef(() => AuthModule)],
        controllers:[PatientsController],
        providers:[PatientsService],
        exports:[PatientsService,MongooseModule]
    }
)
export class PatientModule{}