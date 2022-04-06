import React, { useState, useEffect } from 'react'
import {
    CModal,
    CModalBody,
    CModalTitle,
    CModalHeader,
    CFormLabel,
    CModalFooter,
    CButton,
    CFormInput,
    CFormTextarea
} from '@coreui/react'
import { getUser } from '../api/api'
import axios from 'axios'

const UpdateProfile = (props) => {
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [firstname, setFirstname] = useState(null);
    const [lastname, setLastname] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const saveUser = async () => {
        let userToken = localStorage.getItem('token')
        const user = JSON.parse(localStorage.getItem('user'))
        setIsLoading(true)
        const data = {
            "username": name,
            "email": email,
            "firstname": firstname,
            "lastname":lastname
        };
        await axios.put(getUser+"/"+user[0].userId, data, {
            headers: { Authorization: 'Bearer ' + userToken },
        }).then((res) => {
            props.setVisible(false)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            window.location.reload()
        }).catch((error) => {
            console.log(error)
        })
        setIsLoading(false)
    }
    useEffect(() => {
        setIsLoading(true)
        const user = JSON.parse(localStorage.getItem('user'))
        setName(user[0].username)
        setEmail(user[0].email)
        setLastname(user[0].lastname)
        setFirstname(user[0].firstname)
        setIsLoading(false)
    }, [])


    return (
        <CModal visible={props.visible} onClose={() => props.setVisible(false)} >
            <CModalHeader onClose={() => props.setVisible(false)}>
                <CModalTitle>Update Profile</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div className="mb-3">
                    <CFormLabel htmlFor="name"> Usename</CFormLabel>
                    <CFormInput type="text" id="name" placeholder="username" value={name? name:""} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <CFormLabel htmlFor="name"> Firstname</CFormLabel>
                    <CFormInput type="text" id="name" placeholder="firstname" value={firstname? firstname:""} onChange={(e) => setFirstname(e.target.value)} />
                </div>
                <div className="mb-3">
                    <CFormLabel htmlFor="name"> Lastname</CFormLabel>
                    <CFormInput type="text" id="name" placeholder="lastname" value={lastname? lastname:""} onChange={(e) => setLastname(e.target.value)} />
                </div>
                <div className="mb-3">
                    <CFormLabel htmlFor="email"> Email</CFormLabel>
                    <CFormInput type="text" id="email" placeholder="email" value={email? email:""} onChange={(e) => setEmail(e.target.value)} />
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary"  style={{color:'#fff'}} onClick={() => props.setVisible(false)}>
                    Close
                </CButton>
                <CButton type="submit" color="primary" style={{color:'#fff'}} onClick={saveUser} >Save</CButton>
            </CModalFooter>
        </CModal>
    )
}

export default UpdateProfile;
