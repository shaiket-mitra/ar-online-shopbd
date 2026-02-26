// import { FaUserCog } from 'react-icons/fa'
// import MenuItem from './MenuItem'

// const AdminMenu = () => {
//   return (
//     <>
//       <MenuItem icon={FaUserCog} label='Manage Users' address='/dashboard/admin/manage-users' />
//     </>
//   )
// }

// export default AdminMenu


"use client";

import { FaUserCog, FaChartLine, FaCog, FaStore } from 'react-icons/fa';
import MenuItem from './MenuItem';
import { motion } from 'framer-motion';

interface AdminMenuProps {
  onItemClick?: () => void; // Callback to close mobile sidebar
}

const AdminMenu = ({ onItemClick }: AdminMenuProps) => {
  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <MenuItem
          icon={FaUserCog}
          label="User Management"
          address="/dashboard/admin/manage-users"
          onClick={onItemClick}
        />
      </motion.div>
    </>
  );
};

export default AdminMenu;