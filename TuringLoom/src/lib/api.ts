const API_BASE_URL = '/api/machine';

export interface MachineRequest {
  rules: any[];
  tapes: any[];
  currentState?: string;
  maxSteps?: number;
}

export interface MachineResponse {
  success: boolean;
  message: string;
  totalSteps?: number;
  halted: boolean;
  finalState: string;
  tapes: any[];
  executedRule?: any;
  duplicateRules?: string[];
}

export async function step(request: MachineRequest): Promise<MachineResponse> {
  const response = await fetch(`${API_BASE_URL}/step`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

export async function run(request: MachineRequest): Promise<MachineResponse> {
  const response = await fetch(`${API_BASE_URL}/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}
