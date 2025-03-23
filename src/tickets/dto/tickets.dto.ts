import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTicketDto {
  @IsUUID()
  @IsNotEmpty()
  showtimeId: string;

  @IsOptional()
  @IsString()
  seatNumber?: string;
    
  @IsOptional()
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  seatNumbers?: string[];
}
