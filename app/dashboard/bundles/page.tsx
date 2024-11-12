"use client"
// components/BundlesTable.js
import { useEffect, useState } from 'react';
import { Table, message, Spin, Button, Popconfirm } from 'antd';
import Layout from '../../components/Layout';
import supabase from '../../../utils/supabase';
import Link from 'next/link';
import {  PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useToast } from '../../components/Toast';

const BundlesTable = () => {
    const [bundles, setBundles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();

    const columns = [
        {
            title: 'Titolo',
            dataIndex: 'titolo',
            key: 'titolo',
        },
        {
            title: 'Piattaforma',
            dataIndex: 'piattaforma',
            key: 'piattaforma',
        },
        {
            title: 'Stato',
            dataIndex: 'stato',
            key: 'stato',
            render: (text:any) => text==0 ? "Bozza" : "Live",
        },
        {
            title: 'Data di inizio',
            dataIndex: 'data_inizio',
            key: 'data_inizio',
            render: (text:any) => text ? moment(text,"yyyy-MM-DD").format("DD/MM/yyyy") : "",
        },
        {
            title: 'Data di scadenza',
            dataIndex: 'data_scadenza',
            key: 'data_scadenza',
            render: (text:any) => text ? moment(text,"yyyy-MM-DD").format("DD/MM/yyyy") : "",
        },
        {
            title: 'Azioni',
            key: 'actions',
            render: (_, record) => (
              <Popconfirm
                title="Sei sicuro di voler eliminare questo bundle?"
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
            .from('bundles')
            .delete()
            .eq('id', id);
    
          if (error) {
            throw error;
          }
    
          toast.showSuccess('Bundle eliminato con successo!');
          // Rimuovi il bundle dalla lista senza dover rifetchare
          setBundles(prevBundles => prevBundles.filter(bundle => bundle.id !== id));
        } catch (err) {
          console.error('Errore nell\'eliminazione del bundle:', err.message);
          toast.showError('Errore nell\'eliminazione del bundle.');
        } finally {
          setLoading(false);
        }
      };

    useEffect(() => {
        const fetchBundles = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('bundles')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    throw error;
                }

                setBundles(data);
            } catch (err) {
                console.error('Errore nel fetching dei bundles:', err.message);
                toast.showError('Errore nel caricamento dei dati.');
            } finally {
                setLoading(false);
            }
        };

        fetchBundles();
    }, []);

    if (loading) {
        return <Spin tip="Caricamento dei dati..." />;
    }

    if (error) {
        return <div>Errore: {error}</div>;
    }

    return (
        <Layout pageTitle={"Bundles"}>
            <Link href="/dashboard/bundles/add" passHref>
                <Button type="primary" icon={<PlusOutlined />}>
                    Crea Bundle
                </Button>
            </Link>
            <Table
                dataSource={bundles}
                columns={columns}
                rowKey="id" // Assicurati che ogni riga abbia un ID unico
                pagination={{ pageSize: 100 }}
                bordered
                title={() => 'Elenco dei Bundles'}
            />
        </Layout>
    );
};

export default BundlesTable;
