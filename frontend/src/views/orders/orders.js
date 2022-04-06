import React, { useEffect, useState } from 'react'
import {
    CTable,
    CTableHead,
    CTableHeaderCell,
    CTableBody,
    CTableRow,
    CTableDataCell,
    CContainer,
    CRow,
    CCol,
    CDropdown,
    CDropdownToggle,
    CAvatar,
    CNav,
    CCard,
    CButton,
    CSpinner,
    CCardText,
    CCardBody,
} from '@coreui/react'
import Pagination from "rc-pagination";

import CIcon from '@coreui/icons-react'
import { cilXCircle, cilPlus, cilPencil } from '@coreui/icons'
import axios from 'axios'
import { getOrder } from '../../api/api'
import cloneDeep from "lodash/cloneDeep";
import "rc-pagination/assets/index.css";
import moment from 'moment';

const Orders = (props) => {

    const [producData, setProductData] = useState([]);
    const [value, setValue] = React.useState("");
    const countPerPage = 7;
    const [currentPage, setCurrentPage] = React.useState(1);
    const [collection, setCollection] = React.useState(null);
    const [search, setSearch] = React.useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [addModal, setAddModal] = useState(false);

    const fetchData = async () => {
        const response = await axios.get(getOrder);
        if (response) {
            console.log(response.data.orders)
            setProductData(response.data.orders);
            setCollection(
                cloneDeep(response.data.orders.slice(0, countPerPage))
            )
        } else {
            console.log("Verbindungsfehler", "Leider konnten die Daten nicht abgefragt werden. Bitte versuchen Sie es später erneut. (ID: 002)");
        }
    }
    const updatePage = p => {
        setIsLoading(true)
        setCurrentPage(p);
        const to = countPerPage * p;
        const from = to - countPerPage;
        setCollection(cloneDeep(producData.slice(from, to)));
        setIsLoading(false)

    };
    const closeAddModal = (i) => {
        setAddModal(i)
    }

    const deleteProduct = async (productId) => {
        setIsLoading(true)
        let userToken = localStorage.getItem('token')
        axios
            .delete(getOrder + "/" + productId)
            .then((res) => {
                window.location.reload()
            })
            .catch((error) => {
                console.log(error)
            })
        setIsLoading(false)

    }


    useEffect(() => {
        setIsLoading(true)
        fetchData();
        if (!value) {
            updatePage(1);
        } else {
            setCollection(search)
        }
        setIsLoading(false)
    }, [value])

    if (isLoading) {
        return (
            <CContainer >
                <div style={{ textAlign: 'center' }}>
                    <CSpinner color="primary" />
                </div>
            </CContainer>
        )
    }

    return (
        <>
               <CContainer>
                <CRow>
                    <CCol xs={11}>
                    </CCol>
                    {/* <CCol xs={1}>
                        <CNav position="sticky" className="mb-4 justify-content-end">
                            <CDropdown
                                variant="nav-item"
                                direction="dropstart"
                            >
                                <CDropdownToggle placement="bottom-end" className="py-0" caret={false} >
                                    <CAvatar size="lg" color="primary" textColor="white"
                                        onClick={() => setAddModal(!addModal)}
                                    >
                                        <CIcon icon={cilPlus} size="sm" />
                                    </ CAvatar>
                                </CDropdownToggle>
                            </CDropdown>
                        </CNav>
                    </CCol> */}
                </CRow>
            </CContainer>
            <CCard>
<CCardBody>
                <CTable  hover>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col">#</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                             <CTableHeaderCell scope="col">products </CTableHeaderCell>
                            {/*<CTableHeaderCell scope="col">quantity</CTableHeaderCell>
                            <CTableHeaderCell scope="col">prise</CTableHeaderCell>*/}
                            <CTableHeaderCell scope="col">State</CTableHeaderCell> 
                            {/* <CTableHeaderCell scope="col">Aktion</CTableHeaderCell>  */}
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {collection ? collection.map((order, index) => {
                            return (
                                <>
                                    <CTableRow key={index} >
                                        <CTableHeaderCell scope="row">{order.orderId}</CTableHeaderCell>
                                        <CTableDataCell>{moment(order.date).format('DD.MM.YYYY hh:mm A')}</CTableDataCell>
                                        <CTableDataCell>{order.products.map(product=><CCardText key={product.productId}>{product.productId} ({product.quantity})</CCardText>)}</CTableDataCell>
                                        <CTableHeaderCell scope="row">{order.state== undefined? null :order.state ?
                                                    <>The order is fully packed.</>
                                                    :
                                                    <>The order failed.</>}</CTableHeaderCell>

                                         {/*<CTableDataCell>{product.quantity}</CTableDataCell>
                                        <CTableDataCell>{product.prise}</CTableDataCell> */}
                                         {/* <CTableDataCell style={{ width: '20%' }}>
                                            <CButton  color="Link" style={{  color: '#e8630a',marginRight: 10 }} onClick={(event) => {
                                                deleteProduct(order.orderId)
                                            }}>
                                                 <CIcon icon={cilXCircle} size="xl" />
                                            </CButton>
                                           
                                        </CTableDataCell>  */}
                                    </CTableRow>

                                </>
                            )
                        }) : null}

                    </CTableBody>
                </CTable>
                <div style={{ textAlign: 'center' }}>
                    <Pagination
                        pageSize={countPerPage}
                        onChange={updatePage}
                        current={currentPage}
                        total={producData.length}
                        style={{ marginBottom: 50 }}
                    />
                </div>
                </CCardBody>
            </CCard>
        </>
    )
}

export default Orders;