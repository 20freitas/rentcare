export type PropertyStatus = 'paid' | 'late' | 'pending';

export interface Property {
    id: string;
    address: string;
    tenantName?: string;
    rentAmount: number;
    paymentDay: number;
    status: PropertyStatus;
    image_url?: string;
    title?: string;
}
