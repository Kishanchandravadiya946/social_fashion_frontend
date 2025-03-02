import { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa"; 

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "info") => {
    const newNotification = { id: Date.now(), message, type };
    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== newNotification.id)
      );
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <NotificationList notifications={notifications} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};

const NotificationList = ({ notifications }) => {
  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 w-full max-w-md flex flex-col items-center space-y-3 z-50">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: -20, scale: 0.95 }} 
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`w-80 flex items-center space-x-3 px-4 py-3 rounded-lg border-l-4 shadow-lg text-gray-900 font-medium bg-white backdrop-blur-md ${
              notification.type === "success"
                ? "border-green-500"
                : notification.type === "error"
                ? "border-red-500"
                : "border-blue-500"
            }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 10,
                delay: 0.2,
              }}
            >
              {notification.type === "success" && (
                <FaCheckCircle size={24} className="text-green-500" />
              )}
              {notification.type === "error" && (
                <FaTimesCircle size={24} className="text-red-500" />
              )}
              {notification.type === "info" && (
                <FaInfoCircle size={24} className="text-blue-500" />
              )}
            </motion.div>

            <span>{notification.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
