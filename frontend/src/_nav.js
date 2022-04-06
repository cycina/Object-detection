import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilGroup,
  cilCart,
  cilDescription,
  cilFolderOpen,
  cilNoteAdd,
  cilChart
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'Dashboard',
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
    
  },
  {
    component: CNavTitle,
    name: 'Detection',
  },
  {
    component: CNavItem,
    name: 'Test Order',
    to: '/test',
    icon: <CIcon icon={cilNoteAdd} customClassName="nav-icon" />,
    
  },
  {
    component: CNavItem,
    name: 'Results',
    to: '/results',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    
  },
  {
    component: CNavTitle,
    name: 'Management',
  },
  {
    component: CNavItem,
    name: 'Products',
    to: '/products',
    icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
    
  },
  {
    component: CNavItem,
    name: 'Orders',
    to: '/orders',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    
  }, {
    component: CNavItem,
    name: 'Settings',
    to: '/settings',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    
  },
  
]

export default _nav
