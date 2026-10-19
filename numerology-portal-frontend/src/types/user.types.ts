export interface UserAccountDto {
  id: string;
  username?: string;
  phoneNumber?: string;
  fullName?: string;
  role: string;
  isVip: boolean;
  vipExpireAt?: string;
}

export interface AuthResponseDto {
  token: string;
  user: UserAccountDto;
}
