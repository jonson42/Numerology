export interface VietQrPaymentInfo {
  orderCode: string;
  amount: number;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  transferContent: string;
  qrImageUrl: string;
}

export interface OrderDetailResponse {
  orderCode: string;
  packageName: string;
  amount: number;
  status: string;
  vietQrInfo: VietQrPaymentInfo;
}

export interface OrderStatusCheckResponse {
  orderCode: string;
  isPaid: boolean;
  status: string;
  isVip: boolean;
}
