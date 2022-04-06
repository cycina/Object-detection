import React, { useEffect, useState } from 'react'
import axios from 'axios'
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import {

    CRow,
    CCol,
    CButton,
    CTable,
    CTableBody,
    CTableHead,
    CTableHeaderCell,
    CDropdown,
    CDropdownToggle,
    CNav,
    CContainer,
    CAvatar,
    CTableDataCell,
    CTableRow,
    CCard,
    CCardBody
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilXCircle, cilPlus } from '@coreui/icons';
import { getUser } from 'src/api/api';
import AddUser from './addUser';

const Settings = (props) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const countPerPage = 12;
    const [addModal, setAddModal] = useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [collection, setCollection] = React.useState(null);
    const fetchData = async () => {
        const response = await axios.get(getUser);
        if (response) {
            setUsers(response.data.users);
            setCollection(
                cloneDeep(response.data.users.slice(0, countPerPage))
            )
            setData(response.data.users)
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
    const closeAddModal = (i) => {
        setAddModal(i)
    }
    const deleteUser = async (userId) => {
        setIsLoading(true)
        let userToken = localStorage.getItem('token')
        axios
            .delete(getUser + "/" + userId)
            .then((res) => {
                window.location.reload()
            })
            .catch((error) => {
                console.log(error)
            })
        setIsLoading(false)

    }
    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <AddUser visible={addModal} setVisible={closeAddModal} />
            <CCard>
                <CCardBody>
                    <CContainer>
                        <CRow>
                            <CCol xs={11}>
                                <h1>User Management</h1>
                            </CCol>
                            <CCol xs={1}>
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
                            </CCol>
                        </CRow>
                    </CContainer>

                    <CTable hover>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                <CTableHeaderCell scope="col">username</CTableHeaderCell>
                                <CTableHeaderCell scope="col">email </CTableHeaderCell>
                                <CTableHeaderCell scope="col">Role</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Aktion</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {collection ? collection.map((item, index) => {
                                return (
                                    <>
                                        <CTableRow key={index} >
                                            <CTableHeaderCell scope="row">{item.userId}</CTableHeaderCell>
                                            <CTableDataCell>{item.username}</CTableDataCell>
                                            <CTableDataCell>{item.email}</CTableDataCell>
                                            <CTableHeaderCell scope="row">{item.role}</CTableHeaderCell>
                                            <CTableDataCell style={{ width: '20%' }}>
                                                <CButton color="Link" style={{ color: '#e8630a', marginRight: 10 }} onClick={(event) => {
                                                    deleteUser(item.userId)
                                                }}>
                                                    <CIcon icon={cilXCircle} size="xl" />
                                                </CButton>

                                            </CTableDataCell>
                                        </CTableRow>
                                    </>
                                )
                            }) : null}
                        </CTableBody>
                    </CTable>
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
                </CCardBody>
            </CCard>

        </>
    )
}

export default Settings;