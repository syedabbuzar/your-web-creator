import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

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
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

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

  // Ctrl+Shift+A shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        if (isAdmin) {
          // Already admin, toggle off
          localStorage.removeItem("adminToken");
          localStorage.removeItem("scholar_admin_token");
          setIsAdmin(false);
          toast.info("Admin mode deactivated");
        } else {
          // Show login dialog
          setShowLoginDialog(true);
          setLoginForm({ email: "", password: "" });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAdmin]);

  const toggleAdmin = () => {
    if (isAdmin) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("scholar_admin_token");
      setIsAdmin(false);
      toast.info("Admin mode deactivated");
    } else {
      setShowLoginDialog(true);
      setLoginForm({ email: "", password: "" });
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      toast.error("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/auth/admin-login", {
        email: loginForm.email.trim(),
        password: loginForm.password.trim(),
      });
      if (data.token) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("scholar_admin_token", data.token);
        setIsAdmin(true);
        setShowLoginDialog(false);
        toast.success("Admin access granted!");
      } else {
        toast.error("Invalid response from server");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid admin credentials");
    }
    setLoading(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, toggleAdmin }}>
      {children}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>🔐 Admin Login</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login as Admin"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AdminContext.Provider>
  );
};
