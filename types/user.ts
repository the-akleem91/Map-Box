export interface BaseTimestamp {
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseTimestamp {
  id: string;
  address: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  roles: Array<{ id: string; role: string }>;
  isAdmin: boolean;
  isVerified: boolean;
  metadata?: {
    userType: UserType;
    phone: string;
    marketingAllowed: boolean;
    toolsInterestedIn: Array<string>;
    toolsUsed: Array<string>;
    isUserDetailsCompleted: boolean;
    customerId?: string; // for stripe
  };
  token?: string;
}

export type UserType =
  | "contractor"
  | "property manager"
  | "independent adjuster";
