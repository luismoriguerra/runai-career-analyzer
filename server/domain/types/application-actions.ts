export type ActionName = 
  | 'bullet_points'
  | 'get_skills'
  | 'get_company_info'
  | 'get_learning_resources'
  | 'get_interview_questions'
  | 'get_demo_apps'
  | 'optimize_tokens'
  | 'common_interview_questions';

export interface ActionAnalysis {
  action_name: ActionName;
  action_result: string;
  prompt_text: string;
  ai_messages: string;
}

export interface ActionResponse {
  id: string;
  application_id: string;
  action_name: ActionName;
  action_result: string;
  prompt_text: string;
  ai_messages: string;
  created_at: string;
} 