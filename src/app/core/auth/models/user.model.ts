export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
  refreshToken: string;
  isPasswordChange: boolean;
  user: {
    email: string;
    name: string;
    image: string;
  };
}
