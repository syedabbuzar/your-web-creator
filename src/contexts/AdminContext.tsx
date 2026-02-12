import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminContextType {
  isAdmin: boolean;
  toggleAdmin: () => void;
}

const AdminContext = createContext<AdminContextType>({ isAdmin: false, toggleAdmin: () => {} });

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem("scholar_admin") === "true");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        setIsAdmin((prev) => {
          const next = !prev;
          localStorage.setItem("scholar_admin", String(next));
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, toggleAdmin: () => setIsAdmin((p) => { const n = !p; localStorage.setItem("scholar_admin", String(n)); return n; }) }}>
      {children}
    </AdminContext.Provider>
  );
};
