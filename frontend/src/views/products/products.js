import React, { useEffect, useState } from 'react'
import {
    CCardImage,
    CCardText,
    CCardTitle,
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
    CCardBody,
    CCardFooter
} from '@coreui/react'
import Pagination from "rc-pagination";

import CIcon from '@coreui/icons-react'
import { cilXCircle, cilPlus, cilPencil } from '@coreui/icons'
import axios from 'axios'
import { getProduct } from '../../api/api'
import cloneDeep from "lodash/cloneDeep";
import "rc-pagination/assets/index.css";
import AddProduct from './addProduct';

const Products = (props) => {
    const [producData, setProductData] = useState([]);
    const countPerPage = 10;
    const [currentPage, setCurrentPage] = React.useState(1);
    const [collection, setCollection] = React.useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [addModal, setAddModal] = useState(false);

    const fetchData = async () => {
        const response = await axios.get(getProduct);
        if (response) {
            console.log(response.data.products)
            setProductData(response.data.products);
            setCollection(
                cloneDeep(response.data.products.slice(0, countPerPage))
            )
        } else {
            console.log("Verbindungsfehler", "Leider konnten die Daten nicht abgefragt werden. Bitte versuchen Sie es später erneut.");
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
            .delete(getProduct + "/" + productId)
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
        setIsLoading(false)
    }, [])

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
            <AddProduct visible={addModal} setVisible={closeAddModal} />

            <CContainer>
                <CRow>
                    <CCol xs={11}>
                        <h1>Products</h1>
                    </CCol>
                    
                </CRow>
            </CContainer>
            <div >
                <CRow >
                    {collection ? collection.map((product, index) => {
                        return (
                            <>
                                <CCol key={product.productId}  style={{marginBottom:40}} xs={12} md={6} xl={4} >
                                    <CCard >
                                        <CCardImage orientation="top" src={product.image} style={{ height: 300 }} />
                                        <CCardBody>
                                            <CCardTitle>{product.name}</CCardTitle>
                                            <CCardText>
                                                {product.description}
                                            </CCardText>
                                            <CCardText>
                                                prise: {product.prise} $
                                            </CCardText>
                                            <CCardText>
                                                Quantity: {product.quantity} $
                                            </CCardText>
                                        </CCardBody>
                                        {/* <CCardFooter style={{justifyContent: 'space-between', display: 'flex' }}>
                                            <CButton color="Link" style={{ color: '#e8630a' }} onClick={() => deleteProduct(product.productId)}>
                                               <h4><CIcon icon={cilXCircle} size="xl" /></h4> 
                                            </CButton>
                                            <CButton color="Link" style={{ color: '#368f8b' }} >
                                               <h4><CIcon icon={cilPencil} size="xl" /></h4> 
                                            </CButton>
                                        </CCardFooter> */}
                                    </CCard>
                                </CCol>
                            </>
                        )
                    }) : null}
                    {producData.length > countPerPage &&
                        <div style={{ textAlign: 'center' }}>
                            <Pagination
                                pageSize={countPerPage}
                                onChange={updatePage}
                                current={currentPage}
                                total={producData.length}
                                style={{ marginBottom: 50 }}
                            />
                        </div>}
                </CRow>
            </div>
        </>
    )
}

export default Products;