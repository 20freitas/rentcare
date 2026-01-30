"use client";

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types/property';
import { Document, DocumentType } from '@/types/document';
import { Plus, Search, Eye, Download, Trash2, FileText, Home, Calendar, FolderOpen } from 'lucide-react';
import styles from './Documents.module.css';

const DOCUMENT_TYPES: { label: string; value: DocumentType }[] = [
    { label: 'Contrato', value: 'Contrato' },
    { label: 'Recibo', value: 'Recibo' },
    { label: 'Manutenção', value: 'Manutenção' },
    { label: 'Outro', value: 'Outro' },
];

// Map DB row (snake_case) to Property
const mapProperty = (dbRow: Record<string, unknown>): Property => ({
    id: dbRow.id as string,
    title: (dbRow.title as string) || undefined,
    address: dbRow.address as string,
    rentAmount: dbRow.rent_amount as number,
    paymentDay: dbRow.payment_day as number,
    tenantName: (dbRow.tenant_name as string) || undefined,
    status: (dbRow.status as Property['status']) || 'pending',
    image_url: (dbRow.image_url as string) || undefined,
});

// Map DB row (snake_case) to Document
const mapDocument = (row: Record<string, unknown>): Document => ({
    id: row.id as string,
    propertyId: (row.property_id ?? row.propertyId) as string,
    fileName: (row.file_name ?? row.fileName) as string,
    type: (row.type as DocumentType),
    uploadDate: (row.upload_date ?? row.uploadDate) as string,
    tenantName: (row.tenant_name ?? row.tenantName) as string | undefined,
    notes: (row.notes) as string | undefined,
    expirationDate: (row.expiration_date ?? row.expirationDate) as string | undefined,
    fileUrl: (row.file_url ?? row.fileUrl) as string,
});

export default function DocumentsPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedPropertyFilter, setSelectedPropertyFilter] = useState<string>(''); // '' = Todos
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [docToDelete, setDocToDelete] = useState<string | null>(null);
    const [form, setForm] = useState({
        propertyId: '',
        type: 'Contrato' as DocumentType,
        file: null as File | null,
        tenantName: '',
        notes: '',
        expirationDate: '',
    });

    // Inquilinos únicos a partir dos imóveis (dados reais)
    const tenantOptions = useMemo(() => {
        const names = new Set<string>();
        properties.forEach((p) => {
            if (p.tenantName?.trim()) names.add(p.tenantName.trim());
        });
        return Array.from(names).sort();
    }, [properties]);

    // Carregar imóveis reais
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

    // Carregar documentos: "Todos" = todos os docs dos imóveis do user; senão filtrar por imóvel
    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            let query = supabase
                .from('documents')
                .select('*')
                .order('upload_date', { ascending: false });

            if (selectedPropertyFilter) {
                query = query.eq('property_id', selectedPropertyFilter);
            } else {
                // Todos: filtrar por property_id IN (ids dos imóveis do user)
                const ids = properties.map((p) => p.id);
                if (ids.length > 0) query = query.in('property_id', ids);
            }

            const { data, error } = await query;
            if (error) {
                setDocuments([]);
                setLoading(false);
                return;
            }
            setDocuments((data || []).map(mapDocument));
            setLoading(false);
        };

        if (properties.length === 0 && !selectedPropertyFilter) {
            setDocuments([]);
            setLoading(false);
            return;
        }
        fetchDocuments();
    }, [selectedPropertyFilter, properties.map((p) => p.id).join(',')]);

    const filteredDocs = useMemo(() => {
        if (!search.trim()) return documents;
        const term = search.toLowerCase();
        return documents.filter(
            (doc) =>
                doc.fileName.toLowerCase().includes(term) ||
                (doc.tenantName && doc.tenantName.toLowerCase().includes(term)) ||
                (doc.notes && doc.notes.toLowerCase().includes(term))
        );
    }, [documents, search]);

    const documentStats = useMemo(() => {
        const total = documents.length;
        const now = new Date();
        const thisMonth = documents.filter((d) => {
            const dDate = new Date(d.uploadDate);
            return dDate.getMonth() === now.getMonth() && dDate.getFullYear() === now.getFullYear();
        }).length;
        const byProperty = documents.reduce<Record<string, number>>((acc, d) => {
            acc[d.propertyId] = (acc[d.propertyId] || 0) + 1;
            return acc;
        }, {});
        const topPropertyId = Object.entries(byProperty).sort((a, b) => b[1] - a[1])[0]?.[0];
        const byType = documents.reduce<Record<string, number>>((acc, d) => {
            acc[d.type] = (acc[d.type] || 0) + 1;
            return acc;
        }, {});
        return { total, thisMonth, topPropertyId, byType };
    }, [documents]);

    const getPropertyLabel = (propertyId: string) => {
        const p = properties.find((x) => x.id === propertyId);
        return p ? (p.title || p.address) : propertyId;
    };

    const handleAddDocument = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.file || !form.propertyId) return;
        setUploading(true);
        const fileName = `${Date.now()}_${form.file.name}`;
        const { error: uploadError } = await supabase.storage.from('documents').upload(fileName, form.file);
        if (uploadError) {
            console.error('Upload error:', uploadError);
            alert(`Erro ao fazer upload: ${uploadError.message}. Crie o bucket "documents" no Supabase (Storage) e execute supabase_documents_bucket.sql para as políticas.`);
            setUploading(false);
            return;
        }
        const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName);
        const { error: insertError } = await supabase.from('documents').insert({
            property_id: form.propertyId,
            file_name: form.file.name,
            type: form.type,
            upload_date: new Date().toISOString(),
            tenant_name: form.tenantName || null,
            notes: form.notes || null,
            expiration_date: form.type === 'Contrato' && form.expirationDate ? form.expirationDate : null,
            file_url: urlData?.publicUrl,
        });
        setUploading(false);
        if (insertError) {
            alert('Erro ao salvar documento!');
            return;
        }
        setShowModal(false);
        setForm({ propertyId: (selectedPropertyFilter || properties[0]?.id) ?? '', type: 'Contrato', file: null, tenantName: '', notes: '', expirationDate: '' });
        // Recarregar lista
        let query = supabase.from('documents').select('*').order('upload_date', { ascending: false });
        if (selectedPropertyFilter) query = query.eq('property_id', selectedPropertyFilter);
        else if (properties.length) query = query.in('property_id', properties.map((p) => p.id));
        const { data: newData } = await query;
        setDocuments((newData || []).map(mapDocument));
    };

    const handleDeleteDocument = async () => {
        if (!docToDelete) return;
        const doc = documents.find((d) => d.id === docToDelete);
        setDocuments((prev) => prev.filter((d) => d.id !== docToDelete));
        setDocToDelete(null);
        const { error } = await supabase.from('documents').delete().eq('id', docToDelete);
        if (error) {
            alert('Erro ao eliminar documento.');
            if (doc) setDocuments((prev) => [...prev, doc]);
        }
    };

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Documentos</h1>
                <button
                    type="button"
                    onClick={() => {
                        setForm((f) => ({
                            ...f,
                            propertyId: selectedPropertyFilter || properties[0]?.id || f.propertyId,
                        }));
                        setShowModal(true);
                    }}
                    className={styles.addButton}
                >
                    <Plus size={20} />
                    Adicionar Documento
                </button>
            </div>

            <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.statCardBlue}`}>
                    <div className={styles.statIconBlue}>
                        <FileText size={24} />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Total de documentos</p>
                        <p className={styles.statValue}>{documentStats.total}</p>
                    </div>
                </div>
                <div className={`${styles.statCard} ${styles.statCardGreen}`}>
                    <div className={styles.statIconGreen}>
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Este mês</p>
                        <p className={styles.statValue}>{documentStats.thisMonth}</p>
                    </div>
                </div>
                {documentStats.topPropertyId && (
                    <div className={`${styles.statCard} ${styles.statCardPurple}`}>
                        <div className={styles.statIconPurple}>
                            <Home size={24} />
                        </div>
                        <div>
                            <p className={styles.statLabel}>Imóvel com mais documentos</p>
                            <p className={styles.statValue} style={{ fontSize: '1rem' }} title={getPropertyLabel(documentStats.topPropertyId)}>
                                {getPropertyLabel(documentStats.topPropertyId).length > 18
                                    ? getPropertyLabel(documentStats.topPropertyId).slice(0, 18) + '…'
                                    : getPropertyLabel(documentStats.topPropertyId)}
                            </p>
                        </div>
                    </div>
                )}
                {Object.keys(documentStats.byType).length > 0 && (
                    <div className={`${styles.statCard} ${styles.statCardBlue}`}>
                        <div className={styles.statIconBlue}>
                            <FolderOpen size={24} />
                        </div>
                        <div>
                            <p className={styles.statLabel}>Por tipo</p>
                            <p className={styles.statValue} style={{ fontSize: '0.9rem' }}>
                                {Object.entries(documentStats.byType)
                                    .map(([t, n]) => `${t}: ${n}`)
                                    .join(', ')}
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
                        placeholder="Pesquisar por nome, inquilino ou notas..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            <div className={styles.docListCard}>
                {loading ? (
                    <p className={styles.emptyState}>A carregar documentos...</p>
                ) : filteredDocs.length === 0 ? (
                    <p className={styles.emptyState}>
                        {selectedPropertyFilter
                            ? 'Nenhum documento encontrado para este imóvel.'
                            : 'Nenhum documento encontrado. Adicione um documento para começar.'}
                    </p>
                ) : (
                    filteredDocs.map((doc) => (
                        <div key={doc.id} className={styles.docRow}>
                            <div className={styles.docInfo}>
                                <div className={styles.docName}>{doc.fileName}</div>
                                <div className={styles.docMeta}>
                                    <span>{doc.type}</span>
                                    <span>{new Date(doc.uploadDate).toLocaleDateString('pt-PT')}</span>
                                    {doc.expirationDate && (
                                        <span title="Fim do Contrato" style={{ color: '#d97706', fontWeight: 500 }}>
                                            Expira: {new Date(doc.expirationDate).toLocaleDateString('pt-PT')}
                                        </span>
                                    )}
                                    {!selectedPropertyFilter && (
                                        <span title="Imóvel">{getPropertyLabel(doc.propertyId)}</span>
                                    )}
                                    {doc.tenantName && <span>Inquilino: {doc.tenantName}</span>}
                                </div>
                            </div>
                            <div className={styles.docActions}>
                                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" title="Abrir">
                                    <Eye size={18} />
                                </a>
                                <a href={doc.fileUrl} download title="Download">
                                    <Download size={18} />
                                </a>
                                <button
                                    type="button"
                                    className={styles.deleteBtn}
                                    onClick={() => setDocToDelete(doc.id)}
                                    title="Eliminar"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Adicionar Documento */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>Adicionar Documento</h2>
                        <form onSubmit={handleAddDocument}>
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
                                <label>Tipo de documento</label>
                                <select
                                    value={form.type}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, type: e.target.value as DocumentType }))
                                    }
                                    className={styles.formSelect}
                                    required
                                >
                                    {DOCUMENT_TYPES.map((t) => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Campo de Data de Fim do Contrato - Visível apenas para Contratos */}
                            {form.type === 'Contrato' && (
                                <div className={styles.formGroup}>
                                    <label>Data de Fim do Contrato</label>
                                    <input
                                        type="date"
                                        value={form.expirationDate}
                                        onChange={(e) => setForm((f) => ({ ...f, expirationDate: e.target.value }))}
                                        className={styles.formInput}
                                        style={{ borderColor: '#3b82f6' }}
                                    />
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                                        Define uma data para receberes notificações futuras.
                                    </p>
                                </div>
                            )}

                            <div className={styles.formGroup}>
                                <label>Ficheiro</label>
                                <input
                                    type="file"
                                    accept="application/pdf,image/*"
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, file: e.target.files?.[0] || null }))
                                    }
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Inquilino (opcional)</label>
                                <select
                                    value={tenantOptions.includes(form.tenantName) ? form.tenantName : ''}
                                    onChange={(e) => setForm((f) => ({ ...f, tenantName: e.target.value }))}
                                    className={styles.formSelect}
                                >
                                    <option value="">— Selecionar da lista —</option>
                                    {tenantOptions.map((name) => (
                                        <option key={name} value={name}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={tenantOptions.includes(form.tenantName) ? '' : form.tenantName}
                                    onChange={(e) => setForm((f) => ({ ...f, tenantName: e.target.value }))}
                                    className={styles.formInput}
                                    placeholder="Ou escrever nome do inquilino"
                                    style={{ marginTop: '0.5rem' }}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Notas (opcional)</label>
                                <input
                                    type="text"
                                    value={form.notes}
                                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                                    className={styles.formInput}
                                    placeholder="Notas ou descrição"
                                />
                            </div>
                            <button type="submit" disabled={uploading} className={styles.submitBtn}>
                                {uploading ? 'A carregar...' : 'Guardar'}
                            </button>
                            <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal confirmar eliminar */}
            {docToDelete && (
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
                            Eliminar documento?
                        </h3>
                        <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                            Tem a certeza que deseja eliminar este documento? Esta ação não pode ser desfeita.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={() => setDocToDelete(null)}
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
                                onClick={handleDeleteDocument}
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
