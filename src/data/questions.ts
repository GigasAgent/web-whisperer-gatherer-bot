
export interface Question {
  id: string;
  key: string;
  label: string;
  prompt?: string; // Optional e.g. for "(e.g., contact form...)"
  type: 'text' | 'textarea';
  isArray?: boolean; // Indicates if the answer should be an array of strings
}

export const questions: Question[] = [
  { id: 'q1', key: 'project_name', label: 'What is the name of your project?', type: 'text' },
  { id: 'q2', key: 'goal', label: 'What is the main goal of your website?', type: 'textarea' },
  { id: 'q3', key: 'features', label: 'What kind of functionality should the site include?', prompt: '(e.g., contact form, product catalog, blog - comma-separated)', type: 'textarea', isArray: true },
  { id: 'q4', key: 'target_audience', label: 'Who is your target audience?', type: 'textarea' },
  { id: 'q5', key: 'branding_materials', label: 'Do you already have any branding materials (logo, colors, fonts, etc.)?', prompt: '(List items or type "None" - comma-separated)', type: 'text', isArray: true },
  { id: 'q6', key: 'design_references', label: 'Are there any websites you admire stylistically or functionally?', prompt: '(List URLs - comma-separated)', type: 'textarea', isArray: true },
  { id: 'q7', key: 'content_types', label: 'What kind of content will you provide?', prompt: '(e.g., text, images, videos - comma-separated)', type: 'textarea', isArray: true },
  { id: 'q8', key: 'timeline', label: 'What is your desired launch date or timeline?', type: 'text' },
  { id: 'q9', key: 'budget', label: 'Do you have a fixed budget or estimated range?', type: 'text' },
];

