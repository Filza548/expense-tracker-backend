import { Injectable, ForbiddenException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService implements OnModuleInit {
  private supabase: SupabaseClient;

  async onModuleInit() {
    // ✅ Module init hone ke baad environment variables available honge
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    
    console.log('🔍 ExpensesService - SUPABASE_URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
    console.log('🔍 ExpensesService - SUPABASE_KEY:', supabaseKey ? '✅ Found' : '❌ Missing');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials are missing in .env file');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async create(userId: string, dto: CreateExpenseDto) {
    const { data, error } = await this.supabase
      .from('expenses')
      .insert({
        user_id: userId,
        ...dto,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll(userId: string, startDate?: string, endDate?: string, categoryId?: string) {
    let query = this.supabase
      .from('expenses')
      .select(`
        *,
        categories:category_id (*)
      `)
      .eq('user_id', userId)
      .order('expense_date', { ascending: false });

    if (startDate) query = query.gte('expense_date', startDate);
    if (endDate) query = query.lte('expense_date', endDate);
    if (categoryId) query = query.eq('category_id', categoryId);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findOne(userId: string, id: string) {
    const { data, error } = await this.supabase
      .from('expenses')
      .select(`
        *,
        categories:category_id (*)
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) throw new NotFoundException('Expense not found');
    return data;
  }

  async update(userId: string, id: string, dto: UpdateExpenseDto) {
    await this.findOne(userId, id);

    const { data, error } = await this.supabase
      .from('expenses')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    const { error } = await this.supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Expense deleted successfully' };
  }

  async getSummary(userId: string) {
    const { data, error } = await this.supabase
      .from('expenses')
      .select('amount, category_id')
      .eq('user_id', userId);

    if (error) throw error;

    const total = data.reduce((sum, exp) => sum + exp.amount, 0);
    const byCategory = data.reduce((acc, exp) => {
      acc[exp.category_id] = (acc[exp.category_id] || 0) + exp.amount;
      return acc;
    }, {});

    return {
      total,
      count: data.length,
      average: data.length > 0 ? total / data.length : 0,
      byCategory,
    };
  }
}