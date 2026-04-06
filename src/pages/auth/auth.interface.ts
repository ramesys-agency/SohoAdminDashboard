export interface AuthResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      fullName?: string;
      name?: string;
      role: string;
      phone?: string;
      gender?: string;
      age?: number;
      region?: string;
      avatar?: string;
      createdAt?: string;
      updatedAt?: string;
    };
  };
  message: string;
}
