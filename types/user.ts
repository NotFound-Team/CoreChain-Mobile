
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: {
    _id: string;
    name: string;
  };
  permissions?: {
    _id: string;
    name: string;
    apiPath: string;
    module: string;
  }[];
}

export interface PublicUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: {
    _id: string;
    name: string;
  };
  workingHours: number;
  employeeId: string;
  position: {
    _id: string;
    title: string;
  };
  department: {
    _id: string;
    name: string;
  };
  fcmToken?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  createdBy: {
    _id: string;
    email: string;
  };
  updatedBy: {
    _id: string;
    email: string;
  };
  deletedBy?: {
    _id: string;
    email: string;
  };
  txHash?: string;
  dayOff?: number;
  timestamp?: string;
  isActive?: boolean;
}

export interface AdjustmentDto {
  amount: number;
  reason: string;
  createdAt: string;
}

export interface PrivateUser {
  netSalary?: number;
  personalIdentificationNumber?: string;
  dateOfBirth?: string;
  personalPhoneNumber?: string;
  male?: boolean;
  nationality?: string;
  permanentAddress?: string;
  biometricData?: string;
  employeeContractCode?: string;
  salary?: number;
  allowances?: number;
  adjustments?: AdjustmentDto[];
  loansSupported?: number;
  healthCheckRecordCode?: string[];
  medicalHistory?: string;
  healthInsuranceCode?: string;
  lifeInsuranceCode?: string;
  socialInsuranceNumber?: string;
  personalTaxIdentificationNumber?: string;
  backAccountNumber?: string;
}

export interface CompleteUser extends PublicUser, PrivateUser {}
