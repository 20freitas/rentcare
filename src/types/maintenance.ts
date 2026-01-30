export type MaintenanceProblemType =
    | 'Canalização'
    | 'Eletricidade'
    | 'Eletrodoméstico'
    | 'Estrutura'
    | 'Outro';

export type MaintenanceStatus = 'Por resolver' | 'Em andamento' | 'Resolvido';

export interface MaintenanceOccurrence {
    id: string;
    propertyId: string;
    problemType: MaintenanceProblemType;
    description: string;
    problemDate: string;
    cost: number | null;
    status: MaintenanceStatus;
    createdAt: string;
    attachmentUrls?: string[];
}
