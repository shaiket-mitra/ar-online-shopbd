// import { BsFillHouseAddFill } from "react-icons/bs";
// import { MdHomeWork, MdOutlineManageHistory } from "react-icons/md";
// import MenuItem from "./MenuItem";
// import { BsGraphUp } from "react-icons/bs";

// const SellerMenu = () => {
//   return (
//     <>
//       <MenuItem
//         icon={BsGraphUp}
//         label="Statistics"
//         address="/dashboard/statistics"
//       />
//       <MenuItem
//         icon={BsFillHouseAddFill}
//         label="Add cake"
//         address="/dashboard/seller/add-cake"
//       />
//       <MenuItem
//         icon={MdHomeWork}
//         label="My Inventory"
//         address="/dashboard/seller/my-inventory"
//       />
//       <MenuItem
//         icon={MdOutlineManageHistory}
//         label="Manage Orders"
//         address="/dashboard/seller/manage-orders"
//       />
//     </>
//   );
// };

// export default SellerMenu;



"use client";

import { BsFillHouseAddFill, BsGraphUp } from "react-icons/bs";
import { MdHomeWork, MdOutlineManageHistory } from "react-icons/md";
import MenuItem from "./MenuItem";
import { motion } from "framer-motion";

interface SellerMenuProps {
  onItemClick?: () => void; // Callback to close mobile sidebar
}

const SellerMenu = ({ onItemClick }: SellerMenuProps) => {
  return (
    <div className="space-y-1">
      {/* Statistics */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <MenuItem
          icon={BsGraphUp}
          label="Sales Dashboard"
          address="/dashboard/statistics"
          onClick={onItemClick}
        />
      </motion.div>

      {/* Add Product */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <MenuItem
          icon={BsFillHouseAddFill}
          label="Add New Product"
          address="/dashboard/seller/add-cake"
          onClick={onItemClick}
        />
      </motion.div>

      {/* Inventory */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <MenuItem
          icon={MdHomeWork}
          label="Product Inventory"
          address="/dashboard/seller/my-inventory"
          onClick={onItemClick}
        />
      </motion.div>

      {/* Order Management */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <MenuItem
          icon={MdOutlineManageHistory}
          label="Order Management"
          address="/dashboard/seller/manage-orders"
          onClick={onItemClick}
        />
      </motion.div>
    </div>
  );
};

export default SellerMenu;