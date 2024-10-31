export interface User {
  user_id: number;
  names: string;
  last_names: string;
  email: string;
  document_number: string;
  username: string;
  password: string;
  born_date: string;
  UserType_id: number;
  userTypes: UserType;
  document_id: number;
  documents: Document;
  date: Date;
  modified: Date;
  modifiedBy: string;
  isDeleted: boolean;
}

export interface UserType {
  UserType_id: number;
  UserType_name: string;
  isDeleted: boolean;
}

export interface Document {
  document_id: number;
  document_name: string;
  isDeleted: boolean;
}

export interface successLogin {
  message: string,
  userId: number,
}