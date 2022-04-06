import { CFormLabel, CFormInput, CSpinner, CButton, CImage, CRow, CCol, CContainer, CModal, CModalBody, CModalTitle, CModalHeader, CModalFooter } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import img from '../../assets/images/test4.png'


const Test = (props) => {
  const [orderId, setOrderId] = useState(null);
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const text = "You can check whether an order's products are complete. Simply upload a photo of the order and include the order number in the description box."

  const handleUploadImage = (e) => {
    setIsLoading(true)
    e.preventDefault();
    e.stopPropagation();
    const data = {
      "file": image,
      "orderId": orderId,

    };
    axios.post('http://localhost:5000/detect', data)
      .then(response => {
        const result = response.data
        props.history.push({
          pathname: `/result`,
          state: { result }
        })
      })
  }
  useEffect(() => {

  }, [isLoading])

  return (
    < CContainer>
      <CRow >
        <CCol
          md={6}
          xl={6}
          xs={12}
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            display: 'flex',
          }}>
          <CRow>
            <p style={{ padding: '32px 4px', fontSize: '3vh' }}> {text}</p>

            <div className="d-grid gap-2" style={{ marginTop: 20 }} >
              <CButton style={{ color: '#fff' }} color="primary" onClick={() => setShowModal(true)}>
                Start
              </CButton>
            </div>
          </CRow>
        </CCol>
        <CCol xs={6}> <CImage className='d-none d-md-flex me-auto' src={img} width={window.innerWidth / 2 - 22} height={window.innerHeight - 100}></CImage></CCol>
      </CRow>
      <CModal visible={showModal} onClose={() => setShowModal(false)} >
        <CModalHeader onClose={() => props.setVisible(false)}>
          <CModalTitle>Check Order</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel htmlFor="formFile" style={styles.input} > Choose the order image</CFormLabel>
            <CFormInput
              type="file"
              id="formFile"
              style={{ display: 'none' }}
              // accept="application/pdf"
              onChange={(event) => {
                let file = null
                var buffer = null
                const reader = new window.FileReader()
                reader.readAsArrayBuffer(event.target.files[0])
                reader.onloadend = () => {
                  buffer = Buffer(reader.result).toString('base64')
                  setImage(buffer)
                }
              }}
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="id"> OrderId:</CFormLabel>
            <CFormInput type="text" id="id" placeholder="order id" onChange={(e) => setOrderId(e.target.value)} />
          </div>

        </CModalBody>
        <CModalFooter>

          {isLoading ? 
          <>
          Please wait a few seconds
          <CSpinner color="primary" size="sm" />
          </>
           :
            <>
              <CButton color="secondary" style={{ color: '#fff' }} onClick={() => setShowModal(false)}>
                Close
              </CButton>
              <CButton type="submit" color="primary" style={{ color: '#fff' }} onClick={handleUploadImage}>Check Order</CButton>
            </>
          }
        </CModalFooter>
      </CModal>

    </CContainer>
  )
}

export default Test;

const styles = {
  input: {
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    cursor: 'pointer',
    display: 'inline-block',
    height: 40,
    marginBottom: '1rem',
    outline: 'none',
    padding: '1rem 50px',
    position: 'relative',
    transition: 'all 0.3s',
    verticalAlign: 'middle',
    horizontalAlign: 'middle',
    width: '100%',
    backgroundColor: '#368f8b',
    transition: 'none',
    boxShadow: '0 6px darken(#f79159, 10%)',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex'
  }
}
