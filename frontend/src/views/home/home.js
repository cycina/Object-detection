import React from 'react'

import {
  CButton,
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardText,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCart, cilNoteAdd, cilChart, cilGroup, cilDescription, cilFolderOpen } from '@coreui/icons';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <CRow >
        {/* <CCol md={4}>
          <Link to="/dashboard">
            <CButton color="primary" variant="ghost" style={{ width: '100%' }}>
              <CCard>
                <CCardBody>
                  <div style={{ margin: 60 }}>
                    <CIcon icon={cilChart} size="8xl" />
                    <CCardText >
                       Dashboard
                    </CCardText>
                  </div>
                </CCardBody>
              </CCard>
            </CButton>
          </Link>
        </CCol> */}
        <CCol xs={12} md={6} xl={4}>
          <Link to="/test">
            <CButton color="primary" variant="ghost" style={{ width: '100%' }}>
              <CCard>
                <CCardBody>
                  <div style={{ margin: 60 }}>
                    <CIcon icon={cilNoteAdd} size="8xl" />
                    <CCardText>
                    Check Order
                    </CCardText>
                  </div>
                </CCardBody>
              </CCard>
            </CButton>
          </Link>
        </CCol>
        <CCol xs={12} md={6} xl={4}>
          <Link to="/results">
            <CButton color="primary" variant="ghost" style={{ width: '100%' }}>
              <CCard>
                <CCardBody>
                  <div style={{ margin: 60 }}>
                    <CIcon icon={cilDescription} size="8xl" />
                    <CCardText>
                       Results
                    </CCardText>
                  </div>
                </CCardBody>
              </CCard>
            </CButton>
          </Link>
        </CCol>
        <CCol xs={12} md={6} xl={4}>
          <Link to="/products">
            <CButton color="primary" variant="ghost" style={{ width: '100%' }} >
              <CCard>
                <CCardBody>
                  <div style={{ margin: 60 }}>
                    <CIcon icon={cilFolderOpen} size="8xl" />
                    <CCardText>
                      Products
                    </CCardText>
                  </div>
                </CCardBody>
              </CCard>
            </CButton>
          </Link>
        </CCol>
        <CCol xs={12} md={6} xl={4}>
          <Link to="/orders">
            <CButton color="primary" variant="ghost" style={{ width: '100%' }} >
              <CCard>
                <CCardBody>
                  <div style={{ margin: 60 }}>
                    <CIcon icon={cilCart} size="8xl" />
                    <CCardText>
                      Orders
                    </CCardText>
                  </div>
                </CCardBody>
              </CCard>
            </CButton>
          </Link>
        </CCol>
        <CCol xs={12} md={6} xl={4}>
          <Link to="/settings">
            <CButton color="primary" variant="ghost" style={{ width: '100%' }}>
              <CCard>
                <CCardBody>
                  <div style={{ margin: 60 }}>
                    <CIcon icon={cilGroup} size="8xl" />
                    <CCardText>
                      Settings
                    </CCardText>
                  </div>
                </CCardBody>
              </CCard>
            </CButton>
          </Link>
        </CCol> 
      </CRow>
    </>
  )
}

export default Home
