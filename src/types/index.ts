export interface Todo {
    id: number;
    user_id: string;
    title: string;
    completed: boolean;
    inserted_at: string;
    updated_at: string;
  }
  
  export interface Session {
    user: {
      id: string;
      email: string;
      role?: string;
    }
  }
  
  export interface DatabaseError {
    message: string;
    details: string;
    hint: string;
    code: string;
  }