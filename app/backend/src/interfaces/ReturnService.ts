export interface ReturnService {
  code: number;
  error?: {
    message: string;
  };
}

export interface ReturnUser extends ReturnService {
  data?: { token: string };
}
