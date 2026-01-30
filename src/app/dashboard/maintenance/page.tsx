'use client';

import { useEffect, useState, useMemo } from 'react';
import { Plus, Search, Calendar, Banknote, Paperclip, Trash2, Edit2, AlertTriangle, Loader2, CheckCircle, Home } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types/property';
import {
    MaintenanceOccurrence,
    MaintenanceProblemType,
    MaintenanceStatus,
} from '@/types/maintenance';
import styles from './Maintenance.module.css';

const PROBLEM_TYPES: { label: string; value: MaintenanceProblemType }[] = [
    { label: 'Canalização', value: 'Canalização' },
    { label: 'Eletricidade', value: 'Eletricidade' },
    { label: 'Eletrodoméstico', value: 'Eletrodoméstico' },
    { label: 'Estrutura', value: 'Estrutura' },
    { label: 'Outro', value: 'Outro' },
];

const STATUS_OPTIONS: { label: string; value: MaintenanceStatus }[] = [
    { label: 'Por resolver', value: 'Por resolver' },
    { label: 'Em andamento', value: 'Em andamento' },
    { label: 'Resolvido', value: 'Resolvido' },
];

const mapProperty = (dbRow: Record<string, unknown>): Property => ({
    id: dbRow.id as string,
    title: (dbRow.title as string) || undefined,
    address: dbRow.address as string,
    rentAmount: (dbRow.rent_amount as number) ?? 0,
    paymentDay: (dbRow.payment_day as number) ?? 1,
    tenantName: (dbRow.tenant_name as string) || undefined,
    status: ((dbRow.status as string) as Property['status']) || 'pending',
    image_url: (dbRow.image_url as string) || undefined,
});

const mapOccurrence = (row: Record<string, unknown>): MaintenanceOccurrence => ({
    id: row.id as string,
    propertyId: (row.property_id ?? row.propertyId) as string,
    problemType: (row.problem_type ?? row.problemType) as MaintenanceProblemType,
    description: (row.description as string) || '',
    problemDate: (row.problem_date ?? row.problemDate) as string,
    cost: row.cost != null ? Number(row.cost) : null,
    status: (row.status as MaintenanceStatus) || 'Por resolver',
    createdAt: (row.created_at ?? row.createdAt) as string,
    attachmentUrls: (row.attachment_urls ?? row.attachmentUrls) as string[] | undefined,
});

function getStatusClass(status: MaintenanceStatus): string {
    switch (status) {
        case 'Por resolver':
            return styles.statusPorResolver;
        case 'Em andamento':
            return styles.statusEmAndamento;
        case 'Resolvido':
            return styles.statusResolvido;
        default:
            return styles.statusPorResolver;
    }
}

export default function MaintenancePage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [occurrences, setOccurrences] = useState<MaintenanceOccurrence[]>([]);
    const [selectedPropertyFilter, setSelectedPropertyFilter] = useState<string>('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [occurrenceToDelete, setOccurrenceToDelete] = useState<string | null>(null);
    const [editingOccurrence, setEditingOccurrence] = useState<MaintenanceOccurrence | null>(null);
    const [form, setForm] = useState({
        propertyId: '',
        problemType: 'Canalização' as MaintenanceProblemType,
        description: '',
        problemDate: new Date().toISOString().slice(0, 10),
        cost: '' as string | number,
        status: 'Por resolver' as MaintenanceStatus,
        files: [] as File[],
    });

    useEffect(() => {
        const fetchProperties = async () => {
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                setProperties([]);
                return;
            }
            setProperties((data || []).map(mapProperty));
            if (data?.length && !form.propertyId) setForm((f) => ({ ...f, propertyId: data[0].id }));
        };
        fetchProperties();
    }, []);

    useEffect(() => {
        const fetchOccurrences = async () => {
            setLoading(true);
            let query = supabase
                .from('maintenance_occurrences')
                .select('*')
                .order('problem_date', { ascending: false });

            if (selectedPropertyFilter) {
                query = query.eq('property_id', selectedPropertyFilter);
            } else if (properties.length > 0) {
                query = query.in('property_id', properties.map((p) => p.id));
            }

            const { data, error } = await query;
            if (error) {
                setOccurrences([]);
                setLoading(false);
                return;
            }
            setOccurrences((data || []).map(mapOccurrence));
            setLoading(false);
        };

        if (properties.length === 0 && !selectedPropertyFilter) {
            setOccurrences([]);
            setLoading(false);
            return;
        }
        fetchOccurrences();
    }, [selectedPropertyFilter, properties.map((p) => p.id).join(',')]);

    const getPropertyLabel = (propertyId: string) => {
        const p = properties.find((x) => x.id === propertyId);
        return p ? (p.title || p.address) : propertyId;
    };

    const filteredOccurrences = useMemo(() => {
        if (!search.trim()) return occurrences;
        const term = search.toLowerCase().trim();
        return occurrences.filter((occ) => {
            const propertyLabel = getPropertyLabel(occ.propertyId).toLowerCase();
            return (
                occ.description.toLowerCase().includes(term) ||
                occ.problemType.toLowerCase().includes(term) ||
                occ.status.toLowerCase().includes(term) ||
                propertyLabel.includes(term)
            );
        });
    }, [occurrences, search, properties]);

    const totalCostForFilter = useMemo(() => {
        return filteredOccurrences.reduce((sum, o) => sum + (o.cost ?? 0), 0);
    }, [filteredOccurrences]);

    const maintenanceStats = useMemo(() => {
        const total = occurrences.length;
        const porResolver = occurrences.filter((o) => o.status === 'Por resolver').length;
        const emAndamento = occurrences.filter((o) => o.status === 'Em andamento').length;
        const resolvido = occurrences.filter((o) => o.status === 'Resolvido').length;
        const totalGasto = occurrences.reduce((sum, o) => sum + (o.cost ?? 0), 0);
        const byProperty = occurrences.reduce<Record<string, number>>((acc, o) => {
            acc[o.propertyId] = (acc[o.propertyId] || 0) + 1;
            return acc;
        }, {});
        const topPropertyId = Object.entries(byProperty).sort((a, b) => b[1] - a[1])[0]?.[0];
        return { total, porResolver, emAndamento, resolvido, totalGasto, topPropertyId };
    }, [occurrences]);

    const openNewModal = () => {
        setEditingOccurrence(null);
        setForm({
            propertyId: selectedPropertyFilter || properties[0]?.id || '',
            problemType: 'Canalização',
            description: '',
            problemDate: new Date().toISOString().slice(0, 10),
            cost: '',
            status: 'Por resolver',
            files: [],
        });
        setShowModal(true);
    };

    const openEditModal = (occ: MaintenanceOccurrence) => {
        setEditingOccurrence(occ);
        setForm({
            propertyId: occ.propertyId,
            problemType: occ.problemType,
            description: occ.description,
            problemDate: occ.problemDate.slice(0, 10),
            cost: occ.cost ?? '',
            status: occ.status,
            files: [],
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.propertyId || !form.description.trim() || !form.problemDate) return;
        setSaving(true);

        const attachmentUrls: string[] = [];
        if (form.files.length > 0) {
            for (const file of form.files) {
                const fileName = `maintenance/${Date.now()}_${file.name}`;
                const { error: uploadError } = await supabase.storage
                    .from('documents')
                    .upload(fileName, file);
                if (!uploadError) {
                    const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName);
                    attachmentUrls.push(urlData?.publicUrl ?? '');
                }
            }
        }

        if (editingOccurrence) {
            const existingUrls = editingOccurrence.attachmentUrls || [];
            const allUrls = attachmentUrls.length ? [...existingUrls, ...attachmentUrls] : existingUrls;
            const updatePayload: Record<string, unknown> = {
                property_id: form.propertyId,
                problem_type: form.problemType,
                description: form.description.trim(),
                problem_date: form.problemDate,
                cost: form.cost === '' ? null : Number(form.cost),
                status: form.status,
            };
            if (allUrls.length) updatePayload.attachment_urls = allUrls;
            const { error } = await supabase
                .from('maintenance_occurrences')
                .update(updatePayload)
                .eq('id', editingOccurrence.id);
            setSaving(false);
            if (error) {
                alert('Erro ao guardar alterações.');
                return;
            }
        } else {
            const { error } = await supabase.from('maintenance_occurrences').insert({
                property_id: form.propertyId,
                problem_type: form.problemType,
                description: form.description.trim(),
                problem_date: form.problemDate,
                cost: form.cost === '' ? null : Number(form.cost),
                status: form.status,
                attachment_urls: attachmentUrls.length ? attachmentUrls : [],
            });
            setSaving(false);
            if (error) {
                alert('Erro ao criar ocorrência.');
                return;
            }
        }

        setShowModal(false);
        setEditingOccurrence(null);
        let query = supabase
            .from('maintenance_occurrences')
            .select('*')
            .order('problem_date', { ascending: false });
        if (selectedPropertyFilter) query = query.eq('property_id', selectedPropertyFilter);
        else if (properties.length) query = query.in('property_id', properties.map((p) => p.id));
        const { data } = await query;
        setOccurrences((data || []).map(mapOccurrence));
    };

    const handleDelete = async () => {
        if (!occurrenceToDelete) return;
        setOccurrences((prev) => prev.filter((o) => o.id !== occurrenceToDelete));
        setOccurrenceToDelete(null);
        const { error } = await supabase
            .from('maintenance_occurrences')
            .delete()
            .eq('id', occurrenceToDelete);
        if (error) {
            alert('Erro ao eliminar ocorrência.');
            const { data } = await supabase.from('maintenance_occurrences').select('*');
            setOccurrences((data || []).map(mapOccurrence));
        }
    };

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Manutenção</h1>
                <button type="button" onClick={openNewModal} className={styles.addButton}>
                    <Plus size={20} />
                    Nova Ocorrência
                </button>
            </div>

            <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.statCardBlue}`}>
                    <div className={styles.statIconBlue}>
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Total de ocorrências</p>
                        <p className={styles.statValue}>{maintenanceStats.total}</p>
                    </div>
                </div>
                <div className={`${styles.statCard} ${styles.statCardRed}`}>
                    <div className={styles.statIconRed}>
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Por resolver</p>
                        <p className={styles.statValue}>{maintenanceStats.porResolver}</p>
                    </div>
                </div>
                <div className={`${styles.statCard} ${styles.statCardYellow}`}>
                    <div className={styles.statIconYellow}>
                        <Loader2 size={24} />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Em andamento</p>
                        <p className={styles.statValue}>{maintenanceStats.emAndamento}</p>
                    </div>
                </div>
                <div className={`${styles.statCard} ${styles.statCardGreen}`}>
                    <div className={styles.statIconGreen}>
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Resolvidas</p>
                        <p className={styles.statValue}>{maintenanceStats.resolvido}</p>
                    </div>
                </div>
                <div className={`${styles.statCard} ${styles.statCardBlue}`}>
                    <div className={styles.statIconBlue}>
                        <Banknote size={24} />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Total gasto</p>
                        <p className={styles.statValue}>{maintenanceStats.totalGasto.toFixed(2)}€</p>
                    </div>
                </div>
                {maintenanceStats.topPropertyId && (
                    <div className={`${styles.statCard} ${styles.statCardPurple}`}>
                        <div className={styles.statIconPurple}>
                            <Home size={24} />
                        </div>
                        <div>
                            <p className={styles.statLabel}>Casa com mais ocorrências</p>
                            <p className={styles.statValue} style={{ fontSize: '1rem' }} title={getPropertyLabel(maintenanceStats.topPropertyId)}>
                                {getPropertyLabel(maintenanceStats.topPropertyId).length > 20
                                    ? getPropertyLabel(maintenanceStats.topPropertyId).slice(0, 20) + '…'
                                    : getPropertyLabel(maintenanceStats.topPropertyId)}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.filterSection}>
                <select
                    value={selectedPropertyFilter}
                    onChange={(e) => setSelectedPropertyFilter(e.target.value)}
                    className={styles.propertySelect}
                >
                    <option value="">Todos os imóveis</option>
                    {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.title || p.address}
                        </option>
                    ))}
                </select>
                <div className={styles.searchContainer}>
                    <Search size={20} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Pesquisar por descrição, imóvel, tipo ou estado..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                {selectedPropertyFilter && (
                    <div className={styles.costSummary}>
                        Total gasto neste imóvel: <strong>{totalCostForFilter.toFixed(2)}€</strong>
                    </div>
                )}
            </div>

            <div className={styles.cardList}>
                {loading ? (
                    <p className={styles.emptyState}>A carregar ocorrências...</p>
                ) : filteredOccurrences.length === 0 ? (
                    <p className={styles.emptyState}>
                        {selectedPropertyFilter
                            ? 'Nenhuma ocorrência neste imóvel.'
                            : 'Nenhuma ocorrência. Clique em "Nova Ocorrência" para registar.'}
                    </p>
                ) : (
                    filteredOccurrences.map((occ) => (
                        <div key={occ.id} className={styles.card} style={{ borderLeftColor: occ.status === 'Por resolver' ? '#ef4444' : occ.status === 'Em andamento' ? '#eab308' : '#22c55e' }}>
                            <div className={styles.cardInfo}>
                                <div className={styles.cardProperty}>
                                    {getPropertyLabel(occ.propertyId)}
                                </div>
                                <div className={styles.cardTitle}>{occ.description}</div>
                                <div className={styles.cardMeta}>
                                    <span>{occ.problemType}</span>
                                    <span>
                                        <Calendar size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                        {new Date(occ.problemDate).toLocaleDateString('pt-PT')}
                                    </span>
                                    {occ.cost != null && occ.cost > 0 && (
                                        <span>
                                            <Banknote size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                            {occ.cost.toFixed(2)}€
                                        </span>
                                    )}
                                </div>
                                {occ.attachmentUrls && occ.attachmentUrls.length > 0 && (
                                    <div className={styles.attachments}>
                                        <Paperclip size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                        {occ.attachmentUrls.map((url, i) => (
                                            <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                                                Anexo {i + 1}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className={styles.cardActions}>
                                <span className={`${styles.statusBadge} ${getStatusClass(occ.status)}`}>
                                    {occ.status}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => openEditModal(occ)}
                                    title="Editar"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                                >
                                    <Edit2 size={18} color="#64748b" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOccurrenceToDelete(occ.id)}
                                    title="Eliminar"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#ef4444' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>
                            {editingOccurrence ? 'Editar Ocorrência' : 'Nova Ocorrência'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>Imóvel</label>
                                <select
                                    value={form.propertyId}
                                    onChange={(e) => setForm((f) => ({ ...f, propertyId: e.target.value }))}
                                    className={styles.formSelect}
                                    required
                                >
                                    {properties.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.title || p.address}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Tipo de problema</label>
                                <select
                                    value={form.problemType}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, problemType: e.target.value as MaintenanceProblemType }))
                                    }
                                    className={styles.formSelect}
                                    required
                                >
                                    {PROBLEM_TYPES.map((t) => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Descrição</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                    className={styles.formTextarea}
                                    placeholder="Ex: Fuga de água na cozinha"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Data do problema</label>
                                <input
                                    type="date"
                                    value={form.problemDate}
                                    onChange={(e) => setForm((f) => ({ ...f, problemDate: e.target.value }))}
                                    className={styles.formInput}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Custo (opcional)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.cost}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, cost: e.target.value === '' ? '' : e.target.value }))
                                    }
                                    className={styles.formInput}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Estado</label>
                                <select
                                    value={form.status}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, status: e.target.value as MaintenanceStatus }))
                                    }
                                    className={styles.formSelect}
                                    required
                                >
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Anexar documentos / fotos (opcional)</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="application/pdf,image/*"
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            files: Array.from(e.target.files || []),
                                        }))
                                    }
                                    className={styles.formInput}
                                />
                            </div>
                            <button type="submit" disabled={saving} className={styles.submitBtn}>
                                {saving ? 'A guardar...' : editingOccurrence ? 'Guardar alterações' : 'Criar ocorrência'}
                            </button>
                            <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {occurrenceToDelete && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1100,
                        backdropFilter: 'blur(2px)',
                    }}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            width: '90%',
                            maxWidth: '400px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                            Eliminar ocorrência?
                        </h3>
                        <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                            Esta ação não pode ser desfeita.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={() => setOccurrenceToDelete(null)}
                                style={{
                                    padding: '0.6rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    background: 'white',
                                    color: '#475569',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                style={{
                                    padding: '0.6rem 1rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: '#ef4444',
                                    color: 'white',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
