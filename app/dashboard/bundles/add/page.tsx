"use client"
import Layout from "../../../components/Layout";
import { useState } from 'react';
import { Formik, Field, FieldArray, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { Input, InputNumber, DatePicker, Select, Radio, Button, Upload, Row, Col } from 'antd';
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import supabase from "../../../../utils/supabase";
import { useToast } from "../../../components/Toast";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Schema di validazione con Yup
const BundleSchema = Yup.object().shape({
    titolo: Yup.string().required('Il titolo è obbligatorio'),
    descrizione: Yup.string().required('La descrizione è obbligatoria'),
    piattaforma: Yup.string().required('Seleziona una piattaforma'),
    scontiFollowers: Yup.array().of(
        Yup.object().shape({
            quantitaSconto: Yup.number().min(1, 'Inserisci una quantità valida').required('Richiesto'),
            numeroFollowers: Yup.number().min(1, 'Numero di follower non valido').required('Richiesto'),
        })
    ),
    richiesta: Yup.string().required('Questo campo è obbligatorio'),
    dataPubblicazione: Yup.date().required('La data di pubblicazione è obbligatoria'),
    dataInizio: Yup.date().required('La data di inizio è obbligatoria'),
    dataScadenza: Yup.date().required('La data di scadenza è obbligatoria'),
    stato: Yup.string().oneOf(['bozza', 'live'], 'Seleziona uno stato valido'),
    lineeGuida: Yup.string(),
});

function Bundles() {
    const toast = useToast();

    return (
        <Layout pageTitle={"Bundles"}>
            <Link href="/dashboard/bundles" passHref className="mb-8">
                <Button type="link" icon={<FaChevronLeft />}>
                    Torna alla Lista Bundle
                </Button>
            </Link>
            <Formik
                initialValues={{
                    immagine_copertina: '',
                    titolo: '',
                    descrizione: '',
                    piattaforma: '',
                    scontiFollowers: [{ quantitaSconto: '', numeroFollowers: '', extraTestuale: '' }],
                    richiesta: '',
                    dataPubblicazione: moment(),
                    dataInizio: null,
                    dataScadenza: null,
                    stato: '',
                    lineeGuida: '',
                }}
                validationSchema={BundleSchema}
                onSubmit={async(formData, {resetForm}) => {
                    console.log(formData);

                    try {
                        const { data: bundles, error: bundleError } : any = await supabase
                          .from('bundles')
                          .insert([
                            {
                              titolo: formData.titolo,
                              descrizione: formData.descrizione,
                              piattaforma: formData.piattaforma,
                              immagine_copertina: formData.immagine_copertina, 
                              richiesta: formData.richiesta,
                              data_pubblicazione: formData.dataPubblicazione,
                              data_inizio: formData.dataInizio,
                              data_scadenza: formData.dataScadenza,
                              stato: formData.stato === "bozza" ? 0 : formData.stato === "live" ? 1 : 2,
                              linee_guida: formData.lineeGuida,
                            },
                          ])
                          .select();
                        
                        const bundle = bundles[0];

                        if (bundleError) {
                          throw new Error(bundleError.message);
                        }
                    
                        const discountRanges = formData.scontiFollowers.map((range) => ({
                          bundle_id: bundle.id, // Collega il bundle
                          quantita_sconto: range.quantitaSconto,
                          numero_followers: range.numeroFollowers,
                        }));
                    
                        const { error: rangeError } = await supabase.from('discount_ranges').insert(discountRanges);
                    
                        if (rangeError) {
                          throw new Error(rangeError.message);
                        }
                    
                        toast.showSuccess("Bundle creato con successo");
                        resetForm();
                        return { success: true, bundleId: bundle.id };
                      } catch (error) {
                        toast.showError(`Errore durante la creazione del bundle: ${error.message}`);
                        console.error('Errore durante la creazione del bundle:', error.message);
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
                                <label>Titolo:</label>
                                <Field name="titolo">
                                    {({ field }) => <Input {...field} placeholder="Titolo" />}
                                </Field>
                                <ErrorMessage name="titolo" component="div" className="error-message" />
                            </Col>

                            <Col span={24}>
                                <label>URL Immagine:</label>
                                <Field name="immagine_copertina">
                                    {({ field }) => <Input {...field} placeholder="Immagine copertina" />}
                                </Field>
                                <ErrorMessage name="immagine_copertina" component="div" className="error-message" />
                                {/* <Upload
                                    name="coverImage"
                                    accept="image/*"
                                    listType="picture"
                                    showUploadList={false}
                                    onChange={(info) => handleImageUpload(info, setFieldValue)}
                                >
                                    <Button icon={<UploadOutlined />}>Carica immagine</Button>
                                </Upload> */}
                                {/* {coverImage && <img src={coverImage} alt="Copertina" style={{ width: '200px', marginTop: '10px' }} />} */}
                            </Col>

                            <Col span={24}>
                                <label>Descrizione:</label>
                                <Field name="descrizione">
                                    {({ field }) => <TextArea {...field} rows={4} placeholder="Descrizione" />}
                                </Field>
                                <ErrorMessage name="descrizione" component="div" className="error-message" />
                            </Col>

                            <Col span={24}>
                                <label>Piattaforma pubblicità:</label>
                                <Field name="piattaforma">
                                    {({ field }) => (
                                        <Select className="w-full" {...field} placeholder="Seleziona piattaforma" onChange={(value) => setFieldValue('piattaforma', value)}>
                                            <Option value="tiktok">TikTok</Option>
                                            <Option value="instagram">Instagram</Option>
                                        </Select>
                                    )}
                                </Field>
                                <ErrorMessage name="piattaforma" component="div" className="error-message" />
                            </Col>

                            {/* Sezione Quantità Sconto e Numero Followers dinamici */}
                            <Col span={24}>
                                <FieldArray name="scontiFollowers">
                                    {({ remove, push }) => (
                                        <>
                                            {values.scontiFollowers.map((_, index) => {
                                                return (
                                                    <Row key={index} gutter={[16, 16]} align="middle">
                                                        <Col span={6}>
                                                            <label>Percentuale sconto:</label>
                                                            <Field name={`scontiFollowers[${index}].quantitaSconto`}>
                                                                {({ field }) => {
                                                                    return(
                                                                        <Input {...field} type="number" placeholder="Percentuale sconto" min={0} max={100} style={{ width: '100%' }} />
                                                                    )
                                                                }}
                                                            </Field>
                                                            <ErrorMessage name={`scontiFollowers[${index}].quantitaSconto`} component="div" className="error-message" />
                                                        </Col>
                                                        <Col span={6}>
                                                            <label>Numero followers:</label>
                                                            <Field name={`scontiFollowers[${index}].numeroFollowers`}>
                                                                {({ field }) => <Input {...field} type="number" placeholder="Numero followers" min={0} style={{ width: '100%' }} />}
                                                            </Field>
                                                            <ErrorMessage name={`scontiFollowers[${index}].numeroFollowers`} component="div" className="error-message" />
                                                        </Col>
                                                        <Col span={12}>
                                                            <label>Extra testuale:</label>
                                                            <Field name={`scontiFollowers[${index}].extraTestuale`}>
                                                                {({ field }) => <TextArea {...field} rows={2} placeholder="Extra testuale" />}
                                                            </Field>
                                                        </Col>
                                                        <Col span={24}>
                                                            <Button
                                                                icon={<MinusCircleOutlined />}
                                                                onClick={() => remove(index)}
                                                            >
                                                                Rimuovi
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                )
                                            })}
                                            <Button
                                                type="dashed"
                                                icon={<PlusOutlined />}
                                                onClick={() => push({ quantitaSconto: '', numeroFollowers: '' })}
                                                style={{ width: '100%', marginTop: '10px' }}
                                            >
                                                Aggiungi range sconto/follower
                                            </Button>
                                        </>
                                    )}
                                </FieldArray>
                            </Col>


                            <Col span={24}>
                                <label>Cosa richiede:</label>
                                <Field name="richiesta">
                                    {({ field }) => <TextArea {...field} rows={2} placeholder="Cosa richiede" />}
                                </Field>
                                <ErrorMessage name="richiesta" component="div" className="error-message" />
                            </Col>

                            <Col span={24}>
                                <label>Data pubblicazione:</label>
                                <Field name="dataPubblicazione">
                                    {({ field }) => (
                                        <DatePicker
                                            {...field}
                                            onChange={(date) => setFieldValue('dataPubblicazione', date)}
                                            format="YYYY-MM-DD"
                                            placeholder="Seleziona data di pubblicazione"
                                            style={{ width: '100%' }}
                                            disabled
                                        />
                                    )}
                                </Field>
                                <ErrorMessage name="dataPubblicazione" component="div" className="error-message" />
                            </Col>

                            <Col span={24}>
                                <label>Periodo (Data inizio - Data scadenza):</label>
                                <Field name="periodo">
                                    {() => (
                                        <RangePicker
                                            onChange={(dates) => {
                                                setFieldValue('dataInizio', dates ? dates[0] : null);
                                                setFieldValue('dataScadenza', dates ? dates[1] : null);
                                            }}
                                            format="YYYY-MM-DD"
                                            placeholder={['Data inizio', 'Data scadenza']}
                                            style={{ width: '100%' }}
                                        />
                                    )}
                                </Field>
                                <ErrorMessage name="dataInizio" component="div" className="error-message" />
                                <ErrorMessage name="dataScadenza" component="div" className="error-message" />
                            </Col>

                            <Col span={24}>
                                <label>Stato:</label>
                                <Field name="stato">
                                    {({ field }) => (
                                        <Radio.Group {...field} onChange={(e) => setFieldValue('stato', e.target.value)}>
                                            <Radio value="bozza">Bozza</Radio>
                                            <Radio value="live">Live</Radio>
                                        </Radio.Group>
                                    )}
                                </Field>
                                <ErrorMessage name="stato" component="div" className="error-message" />
                            </Col>

                            <Col span={24}>
                                <label>Linee guida contenuto:</label>
                                <Field name="lineeGuida">
                                    {({ field }) => <TextArea {...field} rows={4} placeholder="Linee guida (come fare foto/video)" />}
                                </Field>
                            </Col>

                            <Col span={24}>
                                <Button type="primary" htmlType="submit" style={{ marginTop: '20px', width: '100%' }}>
                                    Crea Bundle
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
export default Bundles;