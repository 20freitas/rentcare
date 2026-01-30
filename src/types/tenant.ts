export interface Tenant {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  nif?: string;
  property_id?: string;
  rent_amount?: number;
  payment_day?: number;
  notes?: string;
  // Joined fields
  properties?: {
    title: string;
    address: string;
  };
}

export interface RentPayment {
  id: string;
  created_at: string;
  user_id: string;
  tenant_id: string;
  property_id?: string;
  amount: number;
  status: 'paid' | 'late' | 'pending';
  due_date: string;
  payment_date?: string;
  notes?: string;
}
