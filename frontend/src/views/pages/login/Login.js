import React, { useState, Suspense } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
  CImage
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import logo from '../../../assets/images/logo4.png'
import { loginUser } from '../../../api/api'
import axios from 'axios'
import { Redirect, Switch } from 'react-router-dom'
import img from '../../../assets/images/128.jpg'


const Login = (props) => {
  const [username, setUserName] = useState(null)
  const [password, setPassword] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem('token'))
  const loading = (
    <div className="pt-3 text-center">
      <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
  )

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      handleSubmit()
    }
  }

  const handleSubmit = async (e) => {
    setIsLoading(true)
    const response = await axios.post(loginUser, {
      username: username,
      password: password,
    })

    if (response.data.token) {
      localStorage.setItem('token', JSON.stringify(response.data.token))
      localStorage.setItem('user', JSON.stringify(response.data.user))

    }
    props.history.push({ pathname: '/' })
    window.location.reload()
    window.location.reload()
  }
  if (token !== null) {
    return (
      <main className="c-main">
        <CContainer fluid>
          <Suspense fallback={loading}>
            <Switch>
              <Redirect from="/" to="/" />
            </Switch>
          </Suspense>
        </CContainer>
      </main>
    )
  }
  return (
    <div className="min-vh-100 d-flex flex-row align-items-center" style={{
      backgroundImage: `url(${img})`, backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      width: '100vw',
      height: '100vh'
    }}  >
      <CContainer>

        <CRow className="justify-content-center">
          <CCol md={6}>
          </CCol>
          <CCol md={6} style={{ textAlign: 'center' }}>
            <CCardGroup>
              <CCard className="p-4 border-dark" color= 'light'>
                <CCardBody style={{ textAlign: 'center' }}>
                  <CImage
                    src={logo}
                    style={{ width: '50%', marginBottom: 50 }}
                  />

                  <CForm>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyUp={handleKeypress}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={12}>
                        {isLoading ?
                          <div style={{ textAlign: 'center' }}>
                            <CSpinner color="primary" />
                          </div> :
                          <CButton style={{ color: '#fff' }} color="primary" className="px-4" onClick={handleSubmit}>
                            Login
                          </CButton>
                        }
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>

          </CCol>

        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
