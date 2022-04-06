import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getResults } from '../../api/api'
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import {
    CCardImage,
    CCardText,
    CCardTitle,
    CRow,
    CCol,
    CModal,
    CModalBody,
    CCard,
    CButton,
    CModalHeader,
    CCardBody,
    CFormSelect,
    CCardHeader,
    CCardSubtitle
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheck, cilXCircle } from '@coreui/icons';
import moment from 'moment'

const Results = () => {
    const [results, setResults] = useState([]);
    const [valid, setValid] = useState([]);
    const [notValid, setNotValid] = useState([]);
    const [data, setData] = useState([]);
    const countPerPage = 12;
    const [selectedItem, setItem] = React.useState({});
    const [visible, setVisible] = useState(false)
    const [currentPage, setCurrentPage] = React.useState(1);
    const [collection, setCollection] = React.useState(null);
    const fetchData = async () => {
        const response = await axios.get(getResults);
        if (response) {
            let validitems = []
            let notvaliditems = []
            response.data.results.map(res => {
                if (res.state) {
                    validitems.push(res)
                } else {
                    notvaliditems.push(res)
                }
            })
            setValid(validitems)
            setNotValid(notvaliditems)
            setResults(response.data.results);
            setCollection(
                cloneDeep(response.data.results.slice(0, countPerPage))
            )
            setData(response.data.results)
        } else {
            console.log("Verbindungsfehler", "Leider konnten die Daten nicht abgefragt werden. Bitte versuchen Sie es später erneut.");
        }
    }
    const updatePage = p => {
        setCurrentPage(p);
        const to = countPerPage * p;
        const from = to - countPerPage;
        setCollection(cloneDeep(data.slice(from, to)));

    };
    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <CModal size='lg' visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader>
                </CModalHeader>
                <CModalBody>
                    <CCard>
                        <CCardImage align="center" orientation="top" src={`data:image/png;base64,${selectedItem.image}`} width={500} height={500} />
                        <CCardBody>
                            {selectedItem.description && selectedItem.description.split("\n").map((des, index) =>
                                <CCardText key={index}>
                                    {des}
                                </CCardText>

                            )}
                        </CCardBody>
                    </CCard>
                </CModalBody>

            </CModal>
            <CRow  >
                <CCol xs={4} md={2} xl={2}  style={{ display: 'flex', justifyContent: 'flex-start', margin: 20 }}  >
                    <CFormSelect
                        aria-label="Default select example"
                        onChange={(e) => {
                            if (e.target.value === '1') {
                                setCollection(
                                    cloneDeep(results.slice(0, countPerPage))
                                )
                                setData(results)
                            } else if (e.target.value === '2') {
                                setCollection(
                                    cloneDeep(valid.slice(0, countPerPage))
                                )
                                setData(valid)
                            }
                            else if (e.target.value === '3') {
                                setCollection(
                                    cloneDeep(notValid.slice(0, countPerPage))
                                )
                                setData(notValid)
                            }
                        }
                        }
                        options={[
                            { label: 'All orders', value: '1' },
                            { label: 'Valid orders', value: '2' },
                            { label: 'failed orders', value: '3' }
                        ]}
                    />
                </CCol>
            </CRow>
            <div style={{ margin: 20 }} >
                <CRow >
                    {collection ? collection.map((item, index) => {
                        return (
                            <>
                                <CCol key={index} style={{ marginBottom: 40 }} xs={12} md={6} xl={3}  >
                                    <CCard   >
                                       
                                        <CCardHeader>
                                            <CCardTitle className="text-start">order id: {item.title}&nbsp;&nbsp;&nbsp;
                                        </CCardTitle>
                                        </CCardHeader>
                                        {/* <CCardImage align="center" orientation="top" src={`data:image/png;base64,${item.image}`} style={{ height: 300 }} /> */}
                                        <CCardBody >
                                        <CCardSubtitle style={{color:'grey',fontSize:15 }}>{moment(item.created_at).format("DD.MM.YY, h:mm")}</CCardSubtitle>
                                            <CCardText className="text-start">
                                                {item.state ?
                                                    < div style={{color:"green"}}> The order is fully packed.  <CIcon icon={cilCheck} style={{ color: "green" }} size="lg" /></div> 
                                                    :
                                                    <div style={{color:"red"}}>The order failed.   <CIcon icon={cilXCircle} style={{ color: "red" }} size="lg" /></div>}
                                            </CCardText>
                                            <div className="text-end">
                                                <CButton color="link" style={{ marginTop: 30 }} onClick={(event) => {
                                                    event.preventDefault()
                                                    setItem(item)
                                                    setVisible(true)
                                                }}>more details</CButton>
                                            </div>
                                        </CCardBody>


                                    </CCard>
                                </CCol>
                            </>
                        )
                    }) : null}
                    {data.length > countPerPage &&
                        <div style={{ textAlign: 'center' }}>
                            <Pagination
                                pageSize={countPerPage}
                                onChange={updatePage}
                                current={currentPage}
                                total={data.length}
                                style={{ marginBottom: 50 }}
                            />
                        </div>}
                </CRow>
            </div>
        </>
    )
}

export default Results;