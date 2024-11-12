"use client"
// components/CompaniesTable.js
import { useEffect, useState } from 'react';
import { Table, message, Spin, Button, Popconfirm } from 'antd';
import Layout from '../../components/Layout';
import supabase from '../../../utils/supabase';
import Link from 'next/link';
import {  PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useToast } from '../../components/Toast';

export default function CompaniesTable() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Partita IVA',
            dataIndex: 'piva',
            key: 'piva',
        },
        {
            title: 'Azioni',
            key: 'actions',
            render: (_, record) => (
              <Popconfirm
                title="Sei sicuro di voler eliminare questa azienda?"
                onConfirm={() => handleDelete(record.id)}
                okText="Sì"
                cancelText="No"
              >
                <Button type="link" danger icon={<FaRegTrashAlt />}>
                  Elimina
                </Button>
              </Popconfirm>
            ),
          },
    ];

    const handleDelete = async (id) => {
        try {
          setLoading(true);
          const { error } = await supabase
            .from('companies')
            .delete()
            .eq('id', id);
    
          if (error) {
            throw error;
          }
    
          toast.showSuccess('Azienda eliminata con successo!');
          // Rimuovi il bundle dalla lista senza dover rifetchare
          setCompanies(prevCompanies => prevCompanies.filter(az => az.id !== id));
        } catch (err) {
          console.error('Errore nell\'eliminazione della azienda:', err.message);
          toast.showError('Errore nell\'eliminazione della azienda.');
        } finally {
          setLoading(false);
        }
      };

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('companies')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    throw error;
                }

                setCompanies(data);
            } catch (err) {
                console.error('Errore nel fetching delle companies:', err.message);
                toast.showError('Errore nel caricamento dei dati.');
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    if (loading) {
        return <Spin tip="Caricamento dei dati..." />;
    }

    if (error) {
        return <div>Errore: {error}</div>;
    }

    return (
        <Layout pageTitle={"Companies"}>
            <Link href="/dashboard/companies/add" passHref>
                <Button type="primary" icon={<PlusOutlined />}>
                    Crea Azienda
                </Button>
            </Link>
            <Table
                dataSource={companies}
                columns={columns}
                rowKey="id" // Assicurati che ogni riga abbia un ID unico
                pagination={{ pageSize: 100 }}
                bordered
                title={() => 'Elenco delle Aziende'}
            />
        </Layout>
    );
};