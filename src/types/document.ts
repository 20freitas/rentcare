export type DocumentType = 'Contrato' | 'Recibo' | 'Manutenção' | 'Outro';

export interface Document {
  id: string;
  propertyId: string;
  fileName: string;
  type: DocumentType;
  uploadDate: string;
  tenantName?: string;
  notes?: string;
  expirationDate?: string;
  fileUrl: string;
}
