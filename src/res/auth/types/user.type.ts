export interface User {
  myInfo: {
    id: number;
    email: string;
    username: string;
    gender: string;
    birth_date: string;
    birth_time: string;
    iat: number;
    exp: number;
    token: string;
    calendar_type: string;
  };
}

export interface UserResponse {
  userId: number;
  email: string;
  username: string;
  gender: string;
  birth_date: string;
  birth_time: string;
  iat: number;
  exp: number;
  token: string;
  calendar_type: string;
}
