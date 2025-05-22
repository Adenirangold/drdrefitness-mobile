interface UserData {
  RegNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: "male" | "female";
  address: {
    street: string;
    city: string;
    state: string;
  };
  emergencyContact: {
    fullName: string;
    phoneNumber: string;
    relationship: string;
  };

  isGroup?: boolean;
  groupRole?: string;

  currentSubscription?: {
    planType: string;
    name: string;
    gymLocation: string;
    gymBranch: string;
  };
}
