import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Patient, PatientDocument } from "src/patients/schemas/patient.schema";
import { role } from "src/users/enums/role";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt'
@Injectable()
export class AuthService{
    constructor(@InjectModel(Patient.name) private patientModel: Model<PatientDocument>,private jwtService: JwtService){}
    async loginPatient(
        dto: LoginDto,
      ): Promise<{ access_token: string; userId: string }> {
        const patient = await this.patientModel.findOne({ email: dto.email });
    
        if (!patient) {
          throw new UnauthorizedException('No patient found with this email.');
        }
    
        const isPasswordMatching = await bcrypt.compare(
          dto.password,
          patient.password,
        );
        if (!isPasswordMatching) {
          throw new UnauthorizedException('Incorrect password.');
        }
    
        const payload = {
          email: patient.email,
          role: role.PATIENT,
        };
        const token = this.jwtService.sign(payload);
    
        return {
          access_token: token,
          userId: patient._id.toString(),
        };
      }
}