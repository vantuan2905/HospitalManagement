import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PatientsService } from "src/patients/patients.service";
import { LoginDto } from "./dto/login.dto";

@Controller('auth')
export class AuthController{
    constructor(
        private authService: AuthService      
      ) {}
    @Get()
    test(){
        return "abc"
    }
    @Post('patient-login')
    async loginPatient(@Body() dto: LoginDto) {
        console.log(dto)
        try {
        return await this.authService.loginPatient(dto);
        } catch (error) {
        if (error instanceof BadRequestException) {
            throw error;
        }
        console.error('Error during patient login:', error);
        throw new InternalServerErrorException('Failed to login patient');
        }
    }
}