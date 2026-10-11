
import api from "./api";

export type CustomerStatus = "lead" | "active" | "inactive";

export interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: CustomerStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerData {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: CustomerStatus;
  notes?: string;
}

interface CustomerListResponse {
  success: boolean;
  customers: Customer[];
}

interface CustomerResponse {
  success: boolean;
  message: string;
  customer: Customer;
}

function getAuthHeaders() {
  const token = sessionStorage.getItem("clientflow_token");

  return {
    Authorization: `Bearer ${token ?? ""}`,
  };
}

export async function getCustomers(): Promise<Customer[]> {
  const response = await api.get<CustomerListResponse>(
    "/customers",
    { headers: getAuthHeaders() }
  );

  return response.data.customers;
}

export async function createCustomer(
  data: CreateCustomerData
): Promise<Customer> {
  const response = await api.post<CustomerResponse>(
    "/customers",
    data,
    { headers: getAuthHeaders() }
  );

  return response.data.customer;
}
