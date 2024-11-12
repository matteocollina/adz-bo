"use client"
import Layout from "../../../components/Layout";
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { Input, Button, Row, Col } from 'antd';
import supabase from "../../../../utils/supabase";
import { useToast } from "../../../components/Toast";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";

const CompanySchema = Yup.object().shape({
    name: Yup.string().required('Il nome è obbligatorio'),
    piva: Yup.string().optional()
});

function Companys() {
    const toast = useToast();

    return (
        <Layout pageTitle={"Azienda"}>
            <Link href="/dashboard/companies" passHref className="mb-8">
                <Button type="link" icon={<FaChevronLeft />}>
                    Torna alla Lista Aziende
                </Button>
            </Link>
            <Formik
                initialValues={{
                    name: '',
                    piva: ''
                }}
                validationSchema={CompanySchema}
                onSubmit={async(formData,{resetForm}) => {
                    try {
                        const { data: companies, error: companiesError } : any = await supabase
                          .from('companies')
                          .insert([
                            {
                              ...formData
                            },
                          ])
                          .single();
                        
                        if (companiesError) {
                          throw new Error(companiesError.message);
                        }

                        toast.showSuccess("Azienda creata con successo");
                        resetForm();
                        return { success: true };
                      } catch (error) {
                        toast.showError(`Errore durante la creazione della companies: ${error.message}`);
                        console.error('Errore durante la creazione della companies:', error.message);
                        return { success: false, error: error.message };
                      }
                }}
            >
                {({ setFieldValue, values, errors }) => {
                    console.log({ errors })
                    return (
                        <Form>
                        <Row gutter={[16, 16]}>

                            <Col span={24}>
                                <label>Nome:</label>
                                <Field name="name">
                                    {({ field }) => <Input {...field} placeholder="Nome" />}
                                </Field>
                                <ErrorMessage name="name" component="div" className="error-message" />
                            </Col>

                            <Col span={24}>
                                <label>Partita IVA:</label>
                                <Field name="piva">
                                    {({ field }) => <Input {...field} placeholder="Partita IVA" />}
                                </Field>
                                <ErrorMessage name="piva" component="div" className="error-message" />
                            </Col>

                            <Col span={24}>
                                <Button type="primary" htmlType="submit" style={{ marginTop: '20px', width: '100%' }}>
                                    Crea Azienda
                                </Button>
                            </Col>
                        </Row>
                        </Form>
                    )
                }}
            </Formik>
        </Layout>
    )
}
export default Companys;