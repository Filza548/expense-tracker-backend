import { IsNumber, IsString, IsDateString, IsUUID, Min, Max } from 'class-validator';

export class CreateExpenseDto {
  @IsUUID()
  category_id: string;

  @IsNumber()
  @Min(0.01)
  @Max(999999)
  amount: number;

  @IsString()
  description: string;

  @IsDateString()
  expense_date: Date;
}