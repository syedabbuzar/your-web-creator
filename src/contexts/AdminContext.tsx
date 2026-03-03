import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminContextType {
  isAdmin: boolean;
  toggleAdmin: () => void;
}

const AdminContext = createContext<AdminContextType>({ isAdmin: false, toggleAdmin: () => {} });

export const useAdmin = () => useContext(AdminContext);

const getAdminToken = () =>
  localStorage.getItem("adminToken") || localStorage.getItem("scholar_admin_token");

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => Boolean(getAdminToken()));

  useEffect(() => {
    const syncAdminState = () => setIsAdmin(Boolean(getAdminToken()));

    syncAdminState();
    window.addEventListener("storage", syncAdminState);
    window.addEventListener("focus", syncAdminState);

    return () => {
      window.removeEventListener("storage", syncAdminState);
      window.removeEventListener("focus", syncAdminState);
    };
  }, []);

  const toggleAdmin = () => {
    if (isAdmin) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("scholar_admin_token");
      setIsAdmin(false);
      return;
    }

    setIsAdmin(Boolean(getAdminToken()));
  };

  return (
    <AdminContext.Provider value={{ isAdmin, toggleAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};
