import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';

@Module({
  imports: [ConfigModule],
  controllers: [ExpensesController],
  providers: [
    ExpensesService,
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const supabaseUrl = configService.get<string>('SUPABASE_URL');
        const supabaseKey = configService.get<string>('SUPABASE_KEY');
        
        console.log('🔍 Supabase URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
        console.log('🔍 Supabase Key:', supabaseKey ? '✅ Found' : '❌ Missing');
        
        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Supabase credentials missing in .env file');
        }
        
        return createClient(supabaseUrl, supabaseKey);
      },
      inject: [ConfigService],
    },
  ],
})
export class ExpensesModule {}