import React, { useState } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilLockLocked,
  cilSettings,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { logOut } from '../../api/api'

import avatar8 from './../../assets/images/avatars/default.jpg'
import axios from 'axios'
import UpdateProfile from '../updateProfile'

const AppHeaderDropdown = () => {
  const [addModal, setAddModal] = useState(false);
  const closeAddModal = (i) => {
    setAddModal(i)
  }
  const handleLogout = async () => {
    await axios.get(logOut)
    localStorage.removeItem('token')
    window.location.reload(true)
  }
  return (
    <CDropdown variant="nav-item">
      <UpdateProfile visible={addModal} setVisible={closeAddModal} />
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        <CDropdownItem style ={{cursor: 'pointer'}} onClick={() =>setAddModal(true)}>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader> 
        <CDropdownItem href="/#/settings">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem style ={{cursor: 'pointer'}} onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Lock Account
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
