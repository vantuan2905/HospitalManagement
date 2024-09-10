import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PatientModule } from "src/patients/patients.module";
import { Patient } from "src/patients/schemas/patient.schema";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module(
    {
        imports:[JwtModule.register({ secret: 'cat' }),forwardRef(() => PatientModule)],
        controllers:[AuthController],
        providers:[JwtStrategy, JwtAuthGuard,AuthService],
        exports:[JwtAuthGuard,JwtModule,AuthService]
    }
)
export class AuthModule {}