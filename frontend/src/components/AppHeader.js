import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CDropdownItem,
  CImage
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu, cilHome, cilLockLocked } from '@coreui/icons'
import logo from '../assets/images/logo4.png'

import { useLocation } from 'react-router-dom'
import { AppHeaderDropdown } from '.'
const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const location = useLocation()
  const currentLocation = location.pathname

  return (
    <CHeader position="sticky" className={currentLocation !== ('/test')&&"mb-4"}>
      <CContainer style={{ height:"2.5em" }} fluid>
        <CHeaderNav  className="d-none d-md-flex ">
          <CNavItem >
            <CNavLink to="/home" component={NavLink} activeClassName="active"  >
              <CImage src={logo} href="/"  style={{ width: "9em", height:"2.5em" }}/>
            </CNavLink>
          </CNavItem>

          </CHeaderNav>
          <CHeaderNav className=" d-md-flex me-auto">

          <CNavLink style={{color:'#368f8b'}} className="mx-auto d-md-none" to="/home" component={NavLink}>
          <CIcon  icon={cilHome} height={48} alt="Logo" />
        </CNavLink>
        </CHeaderNav>

          <CHeaderNav className="d-none d-md-flex me-auto">

          {currentLocation !== ('/home') &&
            <>
              {/* <CNavItem>
                <CNavLink to="/dashboard" component={NavLink}>
                  Dashboard
                </CNavLink>
              </CNavItem> */}
              <CNavItem>
                <CNavLink to="/test" component={NavLink} >
                  Check Order
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink to="/results" component={NavLink} >
                  Results
                </CNavLink>
              </CNavItem>  <CNavItem>
                <CNavLink to="/orders" component={NavLink}>
                  Orders
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink to="/products" component={NavLink} >
                  Products
                </CNavLink>
              </CNavItem>
              {/* <CNavItem>
                <CNavLink to="/settings" component={NavLink} >
                  Settings
                </CNavLink>
              </CNavItem> */}
            </>

          }


        </CHeaderNav>
        {/* <CHeaderNav>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav> */}
        <CHeaderNav className="ms-3">
            <AppHeaderDropdown />
              {/* <CIcon icon={cilLockLocked} className="me-2" /> Logout */}
        </CHeaderNav>
      </CContainer>
      

    </CHeader>
  )
}

export default AppHeader
