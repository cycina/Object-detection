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
import { getProduct } from '../../api/api'
import axios from 'axios'

const AddProduct = (props) => {
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [quantity, setQuantity]= useState(null);
    const [prise, setPrise]= useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [validated, setValidated] = useState(false)

    const saveProduct = async (event) => {

        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }
        let userToken = localStorage.getItem('token')
        setIsLoading(true)
        const data = {
            "productId": name,
            "name": name,
            "description": description,
            "quantity": quantity,
            "prise": prise,
            "image": image,  
        };
        await axios.post(getProduct, data, {
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
    // if (isLoading) {
    //     return (
    //         <CModal visible={props.visible} onClose={() => props.setVisible(false)} >
    //             <CModalHeader onClose={() => props.setVisible(false)}>
    //                 <CModalTitle>Add Product</CModalTitle>
    //             </CModalHeader>
    //             <CModalBody>
    //                 <div style={{ textAlign: 'center' }}>
    //                     <CSpinner color="primary" />
    //                 </div>
    //             </CModalBody>
    //             <CModalFooter>
    //                 <CButton color="secondary" onClick={() => props.setVisible(false)}>
    //                     Abbrechen
    //                 </CButton>
    //             </CModalFooter>
    //         </CModal>
    //     )
    // }

    return (     
        <CModal visible={props.visible} onClose={() => props.setVisible(false)} >
             <CForm
        className="row g-3 needs-validation"
        noValidate
        validated={validated}
        onSubmit={saveProduct}
      >
            <CModalHeader onClose={() => props.setVisible(false)}>
                <CModalTitle>Add Product</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <div className="mb-3">
                    <CFormLabel htmlFor="name"> name</CFormLabel>
                    <CFormInput type="text" id="name" placeholder="name" onChange={(e) => setName(e.target.value)} required/>
                    <CFormFeedback invalid>this field is required.</CFormFeedback>

                      </div>
                <div className="mb-3">
                    <CFormLabel htmlFor="description"> description</CFormLabel>
                    <CFormTextarea type="text" id="description" rows="5" placeholder="description" onChange={(e) => setDescription(e.target.value)} required/>
                    <CFormFeedback invalid>this field is required.</CFormFeedback>

                </div>
                <div className="mb-3">
                    <CFormLabel htmlFor="prise"> prise</CFormLabel>
                    <CFormInput type="text" id="prise"   pattern="[+-]?\d+(?:[.,]\d+)?"  placeholder="prise" onChange={(e) => setPrise(e.target.value)} required/>
                    <CFormFeedback invalid>Please enter only numbers.</CFormFeedback>

                </div>
                <div className="mb-3">
                    <CFormLabel htmlFor="quantity"> quantity</CFormLabel>
                    <CFormInput type="text" id="quantity" pattern="[+-]?\d+(?:[.,]\d+)?" placeholder="quantity" onChange={(e) => setQuantity(e.target.value)} required/>
                    <CFormFeedback invalid>Please enter only numbers.</CFormFeedback>

                </div>
                <div className="mb-3">
                    <CFormLabel htmlFor="formFile" > image</CFormLabel>
                    <CFormInput
                        type="file"
                        id="formFile"
                        // accept="application/pdf"
                        onChange={(event) => {
                            let file = null
                            var buffer = null
                            const reader = new window.FileReader()
                            reader.readAsArrayBuffer(event.target.files[0])
                            reader.onloadend = () => {
                                buffer = Buffer(reader.result).toString('base64')
                                setImage(`data:${event.target.files[0].type};base64,${buffer}`)
                                // const f = {
                                //     filename: event.target.files[0].name,
                                //     path: event.target.files[0].webkitRelativePath,
                                //     buffer: buffer,
                                //     mimeType: event.target.files[0].type
                                // }
                                // files.push(f)
                            }
                        }} 
                        required
                        />
                        <CFormFeedback invalid>This field is required.</CFormFeedback>

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

export default AddProduct;
