import React, { useEffect, useState } from 'react'
import {
    CCard,
    CCardBody,
    CCollapse,
    CButton,
    CImage,
    CCardText,
    CRow
} from '@coreui/react';
const ResultOverview = (props) => {
    const [visible, setVisible] = useState(false)
    const [result, setResult] = useState(null)

    useEffect(() => {
        if (props.location.state) {
            setResult(props.location.state.result)
        } else {
            props.history.push({
                pathname: '/test'
            })
        }

    }, [])

    return (
        <CCard>
            <CCardBody> {result &&
                <>
                    <CImage align="center" className="zoom" orientation="top" src={`data:image/png;base64,${result.image}`} width={500} height={500} />

                    <div className="d-grid gap-2">

                        <CButton style={{ color: '#fff', marginTop: 30 }} onClick={() => setVisible(!visible)}>Evaluate</CButton>
                    </div>
                    <CCollapse visible={visible} >
                        <CCard className="mt-3 bg-light">
                            <CCardBody>
                                {result.state === true ?
                                    <>
                                        <CRow>
                                            <CCardText>
                                                The order is fully packed.
                                            </CCardText>
                                            {result.valid.map(value =>
                                                <CCardText key={value.product}>({value.quantity}) {value.product}</CCardText>)}
                                        </CRow>
                                    </> : <>
                                        <div style={{ marginBottom: 20 }}>
                                            {(result.notvalid.length > 0 || result.insuficient.length) ?
                                                <>
                                                    <CCardText> the order is missing the following items : </CCardText>
                                                    {result.notvalid.length > 0 ? result.notvalid.map(value =>
                                                        <CCardText key={value.product}>({value.quantity}) {value.product}</CCardText>
                                                    ) : null}
                                                    {result.insuficient.length > 0 ? result.insuficient.map(value =>
                                                        <CCardText key={value.product}>({value.order_quantity - value.quantity}) {value.product}</CCardText>
                                                    ) : null}
                                                </> : null
                                            }
                                        </div>
                                        <div>
                                            {(result.notinorder.length > 0 || result.more.length > 0) ?
                                                <>
                                                    <CCardText>
                                                        the following items are not in this order. Please check the order list again:
                                                    </CCardText>
                                                    {result.notinorder.length > 0 ? result.notinorder.map(value =>
                                                        <CCardText key={value.product}>({value.quantity}) {value.product}</CCardText>
                                                    ) : null}
                                                    {result.more.length > 0 ? result.more.map(value =>
                                                        <CCardText key={value.product}>({value.quantity - value.order_quantity}) {value.product}</CCardText>
                                                    ) : null}

                                                </> :
                                                null
                                            }
                                        </div>

                                    </>}
                            </CCardBody>
                        </CCard>
                    </CCollapse></>
            }

            </CCardBody>
        </CCard>
    )
}

export default ResultOverview;

