import axiosInstance from "./axios";

const TOKEN_KEY = "scholar_quiz_token";
const USER_KEY = "scholar_quiz_user_data";
const ADMIN_TOKEN_KEY = "scholar_admin_token";

// ============ TOKEN HELPERS ============
export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const getAdminToken = (): string | null => localStorage.getItem(ADMIN_TOKEN_KEY);
export const setAdminToken = (token: string) => localStorage.setItem(ADMIN_TOKEN_KEY, token);
export const clearAdminToken = () => localStorage.removeItem(ADMIN_TOKEN_KEY);

export const getSavedUser = () => {
  try {
    const d = localStorage.getItem(USER_KEY);
    return d ? JSON.parse(d) : null;
  } catch { return null; }
};
export const setSavedUser = (user: any) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const clearSavedUser = () => localStorage.removeItem(USER_KEY);

const authHeaders = (token?: string | null) => ({
  headers: { Authorization: `Bearer ${token || getToken()}` },
});

const adminHeaders = () => ({
  headers: { Authorization: `Bearer ${getAdminToken()}` },
});

// ============ UTILITY: Extract class number from any input ============
const extractClassNumber = (classValue: any): number | null => {
  if (typeof classValue === 'number') return classValue;
  if (typeof classValue === 'string') {
    const match = classValue.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  }
  if (classValue && typeof classValue === 'object') {
    if ('value' in classValue && typeof classValue.value === 'number') return classValue.value;
    if ('label' in classValue && typeof classValue.label === 'string') {
      const match = classValue.label.match(/\d+/);
      return match ? parseInt(match[0], 10) : null;
    }
  }
  return null;
};

// ============ AUTH API ============
export const apiRegister = async (data: { name: string; email: string; password: string; class: any }) => {
  try {
    // Convert class to number
    const classNumber = extractClassNumber(data.class);
    if (classNumber === null) {
      console.error("Invalid class value received:", data.class);
      throw new Error("Invalid class value. Please select a valid class (1-10).");
    }

    const payload = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      class: classNumber,
      role: "student",   // ✅ Yeh backend ke liye mandatory hai
    };

    console.log("Sending registration payload:", payload); // Debug log

    const res = await axiosInstance.post("/auth/register", payload);
    return res.data;
  } catch (error: any) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};

export const apiLogin = async (email: string, password: string) => {
  try {
    const res = await axiosInstance.post("/auth/login", { email, password });
    if (res.data.token) {
      setToken(res.data.token);
      setSavedUser(res.data.user || res.data);
    }
    return res.data;
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

export const apiChangeClass = async (email: string, password: string, newClass: any) => {
  try {
    const classNumber = extractClassNumber(newClass);
    if (classNumber === null) {
      throw new Error("Invalid class value");
    }
    const res = await axiosInstance.post("/auth/change-class", { email, password, newClass: classNumber });
    return res.data;
  } catch (error: any) {
    console.error("Change class error:", error.response?.data || error.message);
    throw error;
  }
};

export const apiAdminLogin = async (email: string, password: string) => {
  try {
    const res = await axiosInstance.post("/auth/admin-login", { email, password });
    if (res.data.token) {
      setAdminToken(res.data.token);
    }
    return res.data;
  } catch (error: any) {
    console.error("Admin login error:", error.response?.data || error.message);
    throw error;
  }
};

// ============ QUESTIONS API ============
export const apiGetQuestions = async (classNum?: number) => {
  const params = classNum ? { class: classNum } : {};
  const res = await axiosInstance.get("/questions", { ...authHeaders(), params });
  return res.data;
};

export const apiAddQuestion = async (data: any) => {
  const res = await axiosInstance.post("/questions", data, adminHeaders());
  return res.data;
};

export const apiUpdateQuestion = async (id: string, data: any) => {
  const res = await axiosInstance.put(`/questions/${id}`, data, adminHeaders());
  return res.data;
};

export const apiDeleteQuestion = async (id: string) => {
  const res = await axiosInstance.delete(`/questions/${id}`, adminHeaders());
  return res.data;
};

export const apiGetQuestionCounts = async () => {
  const res = await axiosInstance.get("/questions/counts", adminHeaders());
  return res.data;
};

// ============ QUIZ API ============
export const apiSubmitQuiz = async (answers: { questionId: string; selectedOptionId: string }[]) => {
  const res = await axiosInstance.post("/quiz/submit", { answers }, authHeaders());
  return res.data;
};

export const apiGetResult = async () => {
  const res = await axiosInstance.get("/quiz/result", authHeaders());
  return res.data;
};

// ============ ADMIN API ============
export const apiGetStudents = async () => {
  const res = await axiosInstance.get("/admin/students", adminHeaders());
  return res.data;
};

export const apiGetStudentById = async (id: string) => {
  const res = await axiosInstance.get(`/admin/students/${id}`, adminHeaders());
  return res.data;
};

export const apiGetStats = async () => {
  const res = await axiosInstance.get("/admin/stats", adminHeaders());
  return res.data;
};

// ============ LOGOUT ============
export const logoutStudent = () => {
  clearToken();
  clearSavedUser();
};

export const logoutAdmin = () => {
  clearAdminToken();
};