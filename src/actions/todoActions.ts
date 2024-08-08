'use server';

import { Database } from 'types_db';
import { createServerSupabaseClient } from 'utils/supabase/server';

//generate-type 명령어를 이용한 타입생성 -> 타입들을 불러오기 (상단에 고정)

export type TodoRow = Database['public']['Tables']['todo']['Row'];
export type TodoRowInsert = Database['public']['Tables']['todo']['Insert'];
export type TodoRowUpdate = Database['public']['Tables']['todo']['Update'];

//에러 던지는 함수
function handleError(error) {
  console.error(error);
  throw new Error(error.message);
}

//todos 가져오기 action
export async function getTodos({ searchInput = '' }): Promise<TodoRow[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('todo')
    .select('*')
    .like('title', `%${searchInput}%`)
    .order('created_at', { ascending: true });
  if (error) {
    handleError(error);
  }
  return data;
}

//todo 생성 action
export async function createTodo(todo: TodoRowInsert) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('todo')
    .insert({ ...todo, created_at: new Date().toISOString() });

  if (error) {
    handleError(error);
  }
  return data;
}

//todo update action
export async function updateTodo(todo: TodoRowUpdate) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('todo')
    .update({ ...todo, updated_at: new Date().toISOString() })
    .eq('id', todo.id);

  if (error) {
    handleError(error);
  }
  return data;
}

// todo 삭제 action
export async function deleteTodo(id: number) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('todo').delete().eq('id', id);
  if (error) {
    handleError(error);
  }
  return data;
}
