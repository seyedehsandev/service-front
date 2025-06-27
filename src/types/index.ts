// src/types/index.ts

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Car {
  id: number;
  documentId?: string;
  model: string;
  brand: string;
  plate: string;
  color: string;
  type: string;
  year: number;
  vehicleStatus: string;
  expireInsurance: string;
  technicalInspectionExpireDate: string;
}

export interface Driver {
  id: number;
  documentId?: string;
  name: string;
  lastName: string;
  licenseExpireDate: string;
  phoneNumber: string;
  personalCode: string;
}

export interface Expense {
  id: number;
  type: string;
  amount: number;
  date: string;
  carId: number | null;
  description: string;
}

export interface RepairHistory {
  id: number;
  driver: string;
  model: string;
  type: string;
  repairType: string;
  cost: number;
  date: string;
}

export interface Trip {
  id: number;
  documentId?: string;
  date: string;
  driver: Driver | null;
  vehicle: Car | null;
  origin: string;
  destination: string;
  startOdometer: number;
  endOdometer: number;
}
