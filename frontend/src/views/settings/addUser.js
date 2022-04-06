import React, { useState } from 'react'
import {
    CModal,
    CModalBody,
    CModalTitle,
    CModalHeader,
    CFormLabel,
    CModalFooter,
    CButton,
    CFormInput,
    CFormFeedback,
    CFormTextarea,
    CForm
} from '@coreui/react'
import { register } from '../../api/api'
import axios from 'axios'

const AddUser = (props) => {
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword]= useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [validated, setValidated] = useState(false)
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    const saveUser = async (event) => {

        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }
        let userToken = localStorage.getItem('token')
        setIsLoading(true)
        const data = {
            "username": name,
            "email": email,
            "password": password,
            "role": "admin",
        };
        await axios.post(register, data, {
            headers: { Authorization: 'Bearer ' + userToken },
        }).then((res) => {
            props.setVisible(false)
            window.location.reload()
        }).catch((error) => {
            console.log(error)
        })
        setIsLoading(false)
        setValidated(true)
    }
    return (     
        <CModal visible={props.visible} onClose={() => props.setVisible(false)} >
             <CForm
        className="row g-3 needs-validation"
        noValidate
        validated={validated}
        onSubmit={saveUser}
      >
            <CModalHeader onClose={() => props.setVisible(false)}>
                <CModalTitle>Add Admin</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <div className="mb-3">
                    <CFormLabel htmlFor="name"> username</CFormLabel>
                    <CFormInput type="text" id="name" placeholder="name" onChange={(e) => setName(e.target.value)} required/>
                    <CFormFeedback invalid>this field is required.</CFormFeedback>

                      </div>
                <div className="mb-3">
                    <CFormLabel htmlFor="email"> email</CFormLabel>
                    <CFormInput type="text" id="email"  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{1,4}$" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} required/>
                    <CFormFeedback invalid>Please enter a valid email address.</CFormFeedback>

                </div>
                <div className="mb-3">
                    <CFormLabel htmlFor="password"> password</CFormLabel>
                    <CFormInput type="password" id="password"   pattern=".{5,13}$"  placeholder="password" onChange={(e) => setPassword(e.target.value)} required/>
                    <CFormFeedback invalid>Length of password should be between range 5 to 14</CFormFeedback>

                </div>
               
            
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary"  style={{color:'#fff'}} onClick={() => props.setVisible(false)}>
                    Close
                </CButton>
                <CButton type="submit" color="primary" style={{color:'#fff'}}  >Save</CButton>
            </CModalFooter>
                    </CForm>

        </CModal>

    )
}

export default AddUser;
