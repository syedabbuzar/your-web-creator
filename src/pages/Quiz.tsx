"use client";

import { useState, useEffect, FormEvent } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen, LogOut, Settings, User, AlertCircle, CheckCircle, XCircle,
  RotateCcw, Edit, Trash, Plus, Search, Users, Award, Eye, Printer,
} from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

// ============ AXIOS INTERCEPTOR ============
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============ TYPES ============
type QuizView = "landing" | "register" | "login" | "quiz" | "result" | "admin-login" | "admin-panel" | "change-class";

interface QuizOption { id: "a" | "b" | "c"; text: string; }
interface QuizQuestion { _id: string; question: string; options: QuizOption[]; correctOptionId: "a" | "b" | "c"; class: number; createdAt: string; }
interface WrongAnswer { questionId: string; questionText: string; selectedOption: string; correctOption: string; }
interface StudentData {
  _id: string; name: string; email: string; class: number;
  quizAttempted: boolean; quizScore?: number; wrongAnswers?: WrongAnswer[];
  createdAt: string; role?: string;
}

// ============ PRINT HELPER ============
const printStudentDetails = (student: StudentData, totalQuestions: number) => {
  const pct = student.quizScore ? Math.round((student.quizScore / totalQuestions) * 100) : 0;
  const html = `<!DOCTYPE html><html><head><title>Student Report - ${student.name}</title>
<style>
body{font-family:Arial,sans-serif;padding:30px;max-width:700px;margin:0 auto}
h1{text-align:center;color:#1a365d;border-bottom:3px solid #1a365d;padding-bottom:10px}
.info{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0}
.info div{padding:8px;background:#f7fafc;border-radius:6px}
.label{font-size:12px;color:#718096;text-transform:uppercase}
.value{font-size:16px;font-weight:bold;color:#2d3748}
.score-box{text-align:center;padding:20px;background:${pct >= 70 ? '#f0fff4' : pct >= 50 ? '#fffff0' : '#fff5f5'};border-radius:10px;margin:20px 0}
.score-big{font-size:48px;font-weight:bold;color:${pct >= 70 ? '#38a169' : pct >= 50 ? '#d69e2e' : '#e53e3e'}}
table{width:100%;border-collapse:collapse;margin-top:15px}
th,td{padding:8px 12px;border:1px solid #e2e8f0;text-align:left;font-size:13px}
th{background:#edf2f7;font-weight:600}
.wrong{color:#e53e3e}.correct{color:#38a169}
.footer{text-align:center;margin-top:30px;color:#a0aec0;font-size:11px}
@media print{body{padding:15px}button{display:none!important}}
</style></head><body>
<h1>🎓 Scholar Educational Campus</h1>
<h2 style="text-align:center;color:#4a5568">Student Quiz Report</h2>
<div class="info">
<div><div class="label">Student Name</div><div class="value">${student.name}</div></div>
<div><div class="label">Email</div><div class="value">${student.email}</div></div>
<div><div class="label">Class</div><div class="value">Class ${student.class}</div></div>
<div><div class="label">Registered</div><div class="value">${new Date(student.createdAt).toLocaleDateString('en-IN')}</div></div>
</div>
<div class="score-box">
<div class="score-big">${student.quizScore || 0}/${totalQuestions}</div>
<div style="font-size:18px;margin-top:5px">${pct}% - ${pct >= 70 ? 'Excellent' : pct >= 50 ? 'Good' : 'Needs Improvement'}</div>
<div style="font-size:13px;color:#718096;margin-top:5px">Status: ${student.quizAttempted ? 'Attempted' : 'Not Attempted'}</div>
</div>
${student.wrongAnswers && student.wrongAnswers.length > 0 ? `
<h3>❌ Wrong Answers (${student.wrongAnswers.length})</h3>
<table><thead><tr><th>#</th><th>Question</th><th>Your Answer</th><th>Correct Answer</th></tr></thead>
<tbody>${student.wrongAnswers.map((w, i) => `<tr><td>${i + 1}</td><td>${w.questionText}</td><td class="wrong">${w.selectedOption}</td><td class="correct">${w.correctOption}</td></tr>`).join('')}</tbody></table>` : '<p style="text-align:center;color:#38a169;font-size:16px">✅ All answers correct!</p>'}
<div class="footer">
<p>Generated on ${new Date().toLocaleString('en-IN')}</p>
<p>Scholar Educational Campus - VERITAS (Truth)</p>
</div>
<script>window.onload=function(){window.print()}</script>
</body></html>`;
  const win = window.open('', '_blank');
  if (win) { win.document.write(html); win.document.close(); }
};

// ============ API FUNCTIONS ============
const apiRegister = (data: { name: string; email: string; password: string; class: number }) =>
  axiosInstance.post("/auth/register", {
    name: data.name,
    email: data.email,
    password: data.password,
    class: data.class,
  });
const apiLogin = (email: string, password: string) =>
  axiosInstance.post("/auth/login", { email, password });
const apiChangeClass = (email: string, password: string, newClass: number) =>
  axiosInstance.post("/auth/change-class", { email, password, newClass });
const apiAdminLogin = (email: string, password: string) =>
  axiosInstance.post("/auth/admin-login", { email, password });

const apiGetQuestions = (classNum?: number) =>
  axiosInstance.get(classNum ? `/questions?class=${classNum}` : "/questions");
const apiAddQuestion = (data: { question: string; class: number; options: any[]; correctOptionId: string }) =>
  axiosInstance.post("/questions", data);
const apiUpdateQuestion = (id: string, data: any) =>
  axiosInstance.put(`/questions/${id}`, data);
const apiDeleteQuestion = (id: string) =>
  axiosInstance.delete(`/questions/${id}`);
const apiGetQuestionCounts = () =>
  axiosInstance.get("/questions/counts");

// Updated API functions with error handling
const apiSubmitQuiz = (answers: any[]) =>
  axiosInstance.post("/quiz/submit", { answers }).catch((error) => {
    toast.error(error.response?.data?.message || "Failed to submit quiz");
    throw error;
  });

const apiGetResult = () =>
  axiosInstance.get("/quiz/result").catch((error) => {
    toast.error(error.response?.data?.message || "Failed to get result");
    throw error;
  });

const apiGetStudents = () =>
  axiosInstance.get("/admin/students").catch((error) => {
    toast.error(error.response?.data?.message || "Failed to get students");
    return { data: [] };
  });

const apiGetStats = () =>
  axiosInstance.get("/admin/stats").catch((error) => {
    toast.error(error.response?.data?.message || "Failed to get stats");
    return { data: { totalStudents: 0, attemptedQuiz: 0, notAttempted: 0 } };
  });

// ============ TOKEN MANAGEMENT ============
const getToken = () => localStorage.getItem("token");
const getAdminToken = () => localStorage.getItem("adminToken");
const getSavedUser = () => JSON.parse(localStorage.getItem("user") || "null");
const logoutStudent = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
};

// ============ MAIN COMPONENT ============
export default function QuizPage() {
  const [view, setView] = useState<QuizView>("landing");
  const [user, setUser] = useState<StudentData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Quiz State
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, "a" | "b" | "c">>({});

  // Admin State
  const [adminQs, setAdminQs] = useState<QuizQuestion[]>([]);
  const [adminFilter, setAdminFilter] = useState("all");
  const [adminSearch, setAdminSearch] = useState("");
  const [editingQ, setEditingQ] = useState<QuizQuestion | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [questionCounts, setQuestionCounts] = useState<Record<number, number>>({});

  // Student Details State
  const [studentsList, setStudentsList] = useState<StudentData[]>([]);
  const [studentClassFilter, setStudentClassFilter] = useState("all");
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [stats, setStats] = useState<{ totalStudents: number; attemptedQuiz: number; notAttempted: number }>({ totalStudents: 0, attemptedQuiz: 0, notAttempted: 0 });

  // Form State
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", class: "", newClass: "" });
  const [loading, setLoading] = useState(false);

  // Initialize on mount
  useEffect(() => {
    const token = getToken();
    const adminToken = getAdminToken();
    const savedUser = getSavedUser();

    if (adminToken) {
      setIsAdmin(true);
      setView("admin-panel");
      loadAdminData();
      loadAdminQuestions();
    } else if (token && savedUser) {
      setUser(savedUser);
      setView(savedUser.quizAttempted ? "result" : "quiz");
      loadQuestions(savedUser.class);
    } else {
      setView("landing");
    }
  }, []);

  const loadQuestions = async (classNum: number) => {
    try {
      const { data } = await apiGetQuestions(classNum);
      setQuestions(Array.isArray(data) ? data : data.questions || data.data || []);
    } catch (err: any) {
      console.error("Failed to load questions:", err);
      toast.error(err.response?.data?.message || "Failed to load questions");
    }
  };

  const loadAdminData = async () => {
    try {
      const [studentsData, statsData, countsData] = await Promise.all([
        apiGetStudents(),
        apiGetStats(),
        apiGetQuestionCounts().catch(() => ({ data: {} })),
      ]);
      setStudentsList(studentsData.data || []);
      setStats(statsData.data || { totalStudents: 0, attemptedQuiz: 0, notAttempted: 0 });
      setQuestionCounts(countsData.data?.counts || countsData.data || {});
    } catch (err) {
      console.error("Admin data load error:", err);
    }
  };

  const loadAdminQuestions = async () => {
    try {
      const { data } = await apiGetQuestions();
      setAdminQs(Array.isArray(data) ? data : data.questions || data.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load questions");
    }
  };

  // ============ AUTH HANDLERS ============
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim() || !form.confirm.trim() || !form.class.trim()) {
      toast.error("All fields are required");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Invalid email format");
      return;
    }
    if (!form.class) {
      toast.error("Please select a class");
      return;
    }

    setLoading(true);
    try {
      const selectedClass = Number(form.class);
      if (!Number.isInteger(selectedClass) || selectedClass < 1 || selectedClass > 10) {
        toast.error("Please select a valid class");
        setLoading(false);
        return;
      }

      const { data } = await apiRegister({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password.trim(),
        confirmPassword: form.confirm.trim(),
        class: selectedClass,
      });
      toast.success("Registered! Please login.");
      setView("login");
      setForm({ name: "", email: "", password: "", confirm: "", class: "", newClass: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      const { data } = await apiLogin(form.email.trim(), form.password.trim());
      const u = data.user || data;
      localStorage.setItem("user", JSON.stringify(u));
      localStorage.setItem("token", data.token);
      setUser(u);
      setForm({ ...form, password: "" });
      toast.success("Login successful");
      await loadQuestions(u.class);
      setView(u.quizAttempted ? "result" : "quiz");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  const handleChangeClass = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim() || !form.newClass.trim()) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const { data } = await apiChangeClass(form.email.trim(), form.password.trim(), parseInt(form.newClass));
      toast.success("Class updated! Login again.");
      logoutStudent();
      setUser(null);
      setView("login");
      setForm({ ...form, password: "", newClass: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update class");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logoutStudent();
    setUser(null);
    setView("landing");
    toast.info("Logged out");
  };

  const handleAdminLogin = async (e: FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const email = fd.get("email") as string;
    const pass = fd.get("password") as string;
    if (!email.trim() || !pass.trim()) {
      toast.error("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      const { data } = await apiAdminLogin(email.trim(), pass.trim());
      localStorage.setItem("adminToken", data.token);
      setIsAdmin(true);
      setView("admin-panel");
      toast.success("Admin access granted");
      (e.currentTarget as HTMLFormElement).reset();
      await loadAdminData();
      await loadAdminQuestions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid admin credentials");
    }
    setLoading(false);
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
    setView("landing");
    toast.info("Admin logged out");
  };

  // ============ QUIZ HANDLERS ============
  const startQuiz = () => {
    if (questions.length === 0) {
      toast.error("No questions for your class");
      return;
    }
    if (user?.quizAttempted) {
      setView("result");
      return;
    }
    setAnswers({});
    setCurrentIdx(0);
    setView("quiz");
  };

  const selectAnswer = (qid: string, opt: "a" | "b" | "c") =>
    setAnswers((p) => ({ ...p, [qid]: opt }));

  const nextQ = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx((p) => p + 1);
    else submitQuiz();
  };

  const prevQ = () => {
    if (currentIdx > 0) setCurrentIdx((p) => p - 1);
  };

  const submitQuiz = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const answerPayload = questions.map((q) => ({
        questionId: q._id,
        selectedOptionId: answers[q._id] || "",
      }));
      const { data } = await apiSubmitQuiz(answerPayload);
      const updatedUser = { ...user, quizAttempted: true, quizScore: data.score, wrongAnswers: data.wrongAnswers || [] };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setView("result");
      toast.success(`Submitted! Score: ${data.score}/${questions.length}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Submission failed");
    }
    setLoading(false);
  };

  // ============ ADMIN HANDLERS ============
  const handleAdminSave = async (data: { question: string; class: number; options: string[]; correctIdx: number; }) => {
    setAdminLoading(true);
    const opts = data.options.map((t, i) => ({ id: String.fromCharCode(97 + i) as "a" | "b" | "c", text: t }));
    try {
      if (editingQ) {
        await apiUpdateQuestion(editingQ._id, {
          question: data.question,
          class: data.class,
          options: opts,
          correctOptionId: opts[data.correctIdx].id
        });
        toast.success("Question updated");
      } else {
        await apiAddQuestion({
          question: data.question,
          class: data.class,
          options: opts,
          correctOptionId: opts[data.correctIdx].id
        });
        toast.success("Question added");
      }
      await loadAdminQuestions();
      const { data: counts } = await apiGetQuestionCounts().catch(() => ({ data: {} }));
      setQuestionCounts(counts?.counts || counts || {});
      setEditingQ(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Save failed");
    }
    setAdminLoading(false);
  };

  const handleAdminDelete = async (id: string) => {
    if (!confirm("Delete permanently?")) return;
    try {
      await apiDeleteQuestion(id);
      await loadAdminQuestions();
      const { data: counts } = await apiGetQuestionCounts().catch(() => ({ data: {} }));
      setQuestionCounts(counts?.counts || counts || {});
      toast.success("Deleted");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const filteredAdminQs = adminQs.filter((q) => {
    const cMatch = adminFilter === "all" || q.class === parseInt(adminFilter);
    const sMatch = q.question.toLowerCase().includes(adminSearch.toLowerCase());
    return cMatch && sMatch;
  });

  const filteredStudents = studentsList.filter((s) => {
    const cMatch = studentClassFilter === "all" || s.class === parseInt(studentClassFilter);
    const sMatch = !studentSearch || s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.email.toLowerCase().includes(studentSearch.toLowerCase());
    return cMatch && sMatch;
  });

  // ============ SUB-COMPONENTS ============
  const ClassSelect = ({ value, onChange, label, disabled, showAll }: { value: string; onChange: (value: string) => void; label?: string; disabled?: boolean; showAll?: boolean }) => (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Select class (1-10)" />
        </SelectTrigger>
        <SelectContent>
          {showAll && <SelectItem value="all">All Classes</SelectItem>}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
            <SelectItem key={c} value={String(c)}>Class {c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const QuestionCard = ({ q, selected, onSelect, showResult, num }: any) => (
    <Card className={showResult ? "border-2 border-primary/50" : ""}>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">{num}</span>
          <p className="font-medium text-lg">{q.question}</p>
        </div>
        <RadioGroup value={selected} onValueChange={(v: "a" | "b" | "c") => onSelect(q._id, v)} className="space-y-2 pl-10" disabled={showResult}>
          {q.options.map((opt: QuizOption) => {
            const isCorrect = opt.id === q.correctOptionId;
            const isSelected = selected === opt.id;
            const style = showResult ? (isCorrect ? "bg-green-50 border-green-300 dark:bg-green-950/30" : isSelected ? "bg-red-50 border-red-300 dark:bg-red-950/30" : "") : "hover:bg-secondary/50";
            return (
              <div key={opt.id} className={`flex items-center space-x-3 p-3 rounded-lg border transition ${style}`}>
                <RadioGroupItem value={opt.id} id={`${q._id}-${opt.id}`} />
                <Label htmlFor={`${q._id}-${opt.id}`} className="flex-1 cursor-pointer font-normal">
                  <span className="font-semibold mr-2 text-muted-foreground">{opt.id.toUpperCase()}.</span>{opt.text}
                </Label>
                {showResult && isCorrect && <span className="text-green-600 text-sm">✓</span>}
                {showResult && isSelected && !isCorrect && <span className="text-red-600 text-sm">✗</span>}
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );

  const ResultCard = ({ score, total, wrong, cls }: any) => {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const msg = pct >= 70 ? { t: "Great! 👏", c: "text-green-600" } : pct >= 50 ? { t: "Good! 👍", c: "text-yellow-600" } : { t: "Practice! 📚", c: "text-orange-600" };
    return (
      <div className="space-y-6">
        <Card className="text-center border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              {pct >= 70 ? <CheckCircle className="w-6 h-6 text-green-500" /> : <AlertCircle className="w-6 h-6 text-yellow-500" />}
              Class {cls} Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-6xl font-bold">{score}/{total}</div>
            <div className={`text-2xl font-semibold ${msg.c}`}>{msg.t}</div>
            <Badge variant={pct >= 70 ? "default" : "secondary"} className="text-lg py-1">{pct}%</Badge>
          </CardContent>
        </Card>
        {wrong && wrong.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-red-600"><XCircle className="w-5 h-5" /> Mistakes ({wrong.length})</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {wrong.map((w: any, i: number) => (
                <div key={i} className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                  <p className="font-medium"><span className="text-muted-foreground">Q{i + 1}:</span> {w.questionText}</p>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm pl-2 mt-2">
                    <span className="text-red-600">✗ You: {w.selectedOption}</span>
                    <span className="text-green-600">✓ Correct: {w.correctOption}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        <Card className="bg-muted/30">
          <CardContent className="pt-4 text-center">
            <p className="text-sm text-muted-foreground mb-3">⚠️ Cannot retake quiz for Class {cls}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" onClick={() => setView("landing")}>Home</Button>
              <Button variant="secondary" onClick={() => setView("change-class")}><RotateCcw className="w-4 h-4 mr-1" />Change Class</Button>
              {user && (
                <Button variant="outline" onClick={() => printStudentDetails(user, total)}>
                  <Printer className="w-4 h-4 mr-1" />Print Result
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const AdminQuestionForm = ({ initial, onSave, onCancel }: any) => {
    const [f, setF] = useState({
      question: initial?.question || "",
      class: initial?.class?.toString() || "1",
      options: initial?.options?.map((o: any) => o.text) || ["", "", ""],
      correctIdx: initial ? initial.options.findIndex((o: any) => o.id === initial.correctOptionId) : 0,
    });
    const submit = (e: FormEvent) => {
      e.preventDefault();
      if (!f.question.trim() || f.options.some((o: string) => !o.trim())) {
        toast.error("Fill all fields");
        return;
      }
      onSave({ question: f.question, class: parseInt(f.class), options: f.options, correctIdx: f.correctIdx });
    };
    return (
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label>Question *</Label>
          <Textarea value={f.question} onChange={(e: any) => setF({ ...f, question: e.target.value })} placeholder="Enter question..." rows={3} required />
        </div>
        <ClassSelect value={f.class} onChange={(v: string) => setF({ ...f, class: v })} label="Class *" />
        <div className="space-y-3">
          <Label>Options (3) *</Label>
          {f.options.map((opt: string, idx: number) => (
            <div key={idx} className="flex items-center gap-3 p-2 rounded hover:bg-secondary/30">
              <input type="radio" name="correct" checked={f.correctIdx === idx} onChange={() => setF({ ...f, correctIdx: idx })} className="w-4 h-4" />
              <Input value={opt} onChange={(e: any) => { const o = [...f.options]; o[idx] = e.target.value; setF({ ...f, options: o }); }} placeholder={`Option ${String.fromCharCode(97 + idx)}`} required />
              <span className="text-sm text-muted-foreground w-5">{String.fromCharCode(97 + idx)}</span>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">🔘 Select correct answer</p>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={adminLoading}>Cancel</Button>
          <Button type="submit" disabled={adminLoading}>{adminLoading ? "Saving..." : initial ? "Update" : "Add"}</Button>
        </div>
      </form>
    );
  };

  const StudentDetailsModal = ({ student, onClose }: { student: StudentData | null; onClose: () => void }) => {
    if (!student) return null;
    const totalQuestions = questions.length || 10;
    const percentage = student.quizScore ? Math.round((student.quizScore / totalQuestions) * 100) : 0;
    return (
      <Dialog open={!!student} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Student Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-muted-foreground">Name</Label><p className="font-medium">{student.name}</p></div>
              <div><Label className="text-muted-foreground">Email</Label><p className="font-medium">{student.email}</p></div>
              <div><Label className="text-muted-foreground">Class</Label><p className="font-medium">Class {student.class}</p></div>
              <div><Label className="text-muted-foreground">Registered</Label><p className="font-medium">{new Date(student.createdAt).toLocaleDateString()}</p></div>
            </div>
            <Card className={student.quizAttempted ? "border-green-200" : "border-border"}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {student.quizAttempted ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-yellow-500" />}
                  Quiz Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {student.quizAttempted ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Score</span>
                      <span className="text-2xl font-bold">{student.quizScore}/{totalQuestions}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span>Percentage</span><span>{percentage}%</span></div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                    {student.wrongAnswers && student.wrongAnswers.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2 flex items-center gap-1 text-red-600"><XCircle className="w-4 h-4" /> Wrong Answers ({student.wrongAnswers.length})</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {student.wrongAnswers.map((wa, idx) => (
                            <div key={idx} className="text-sm p-2 bg-destructive/5 rounded">
                              <p className="font-medium">{wa.questionText}</p>
                              <div className="grid grid-cols-2 gap-2 mt-1">
                                <span className="text-red-600">✗ {wa.selectedOption}</span>
                                <span className="text-green-600">✓ {wa.correctOption}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Student hasn't attempted the quiz yet.</p>
                )}
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => printStudentDetails(student, totalQuestions)}>
                <Printer className="w-4 h-4 mr-2" />Print Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // ============ VIEW RENDERERS ============
  const renderLanding = () => (
    <div className="text-center space-y-8 py-8">
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold">Class-wise Quiz Portal</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Practice quizzes for Class 1-10. Register, attempt, and track progress.</p>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button size="lg" onClick={() => { setForm({ name: "", email: "", password: "", confirm: "", class: "", newClass: "" }); setView("register"); }}>
          <User className="w-4 h-4 mr-2" />Register
        </Button>
        <Button size="lg" variant="outline" onClick={() => { setForm({ ...form, password: "" }); setView("login"); }}>Login</Button>
      </div>
      <Card className="max-w-md mx-auto mt-8 border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2"><Settings className="w-4 h-4" />Admin Access</CardTitle>
          <CardDescription>Manage quiz questions & students</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-3">
            <Input name="email" type="email" placeholder="Admin email" required />
            <Input name="password" type="password" placeholder="Admin password" required />
            <Button type="submit" className="w-full" variant="secondary" disabled={loading}>
              {loading ? "Logging in..." : "Admin Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderAuth = () => (
    <div className="py-8 max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {view === "register" ? "Register" : view === "change-class" ? "Change Class" : "Login"}
          </CardTitle>
          <CardDescription>
            {view === "register" ? "Create account" : view === "change-class" ? "Verify to update class" : "Access your quiz"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={view === "register" ? handleRegister : view === "change-class" ? handleChangeClass : handleLogin} className="space-y-4">
            {view === "register" && (
              <>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} placeholder="student@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value={form.password} onChange={(e: any) => setForm({ ...form, password: e.target.value })} placeholder="••••••" minLength={6} required />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" value={form.confirm} onChange={(e: any) => setForm({ ...form, confirm: e.target.value })} placeholder="••••••" required />
                </div>
                <ClassSelect value={form.class} onChange={(v: string) => setForm({ ...form, class: v })} label="Your Class" />
              </>
            )}
            {view === "login" && (
              <>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} placeholder="student@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value={form.password} onChange={(e: any) => setForm({ ...form, password: e.target.value })} placeholder="••••••" required />
                </div>
              </>
            )}
            {view === "change-class" && (
              <>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} placeholder="student@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value={form.password} onChange={(e: any) => setForm({ ...form, password: e.target.value })} placeholder="••••••" required />
                </div>
                <ClassSelect value={form.newClass} onChange={(v: string) => setForm({ ...form, newClass: v })} label="New Class" />
              </>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : view === "register" ? "Register" : view === "change-class" ? "Update" : "Login"}
            </Button>
          </form>
          <div className="mt-4 text-center space-y-2 text-sm">
            {view === "login" && (
              <>
                <p>New? <Button variant="link" className="p-0 h-auto" onClick={() => { setForm({ name: "", email: "", password: "", confirm: "", class: "", newClass: "" }); setView("register"); }}>Register</Button></p>
                <p>Wrong class? <Button variant="link" className="p-0 h-auto" onClick={() => setView("change-class")}>Change here</Button></p>
              </>
            )}
            {(view === "register" || view === "change-class") && (
              <p>Have account? <Button variant="link" className="p-0 h-auto" onClick={() => { setForm({ ...form, password: "" }); setView("login"); }}>Login</Button></p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderQuiz = () => {
    if (!user || questions.length === 0) return (
      <Card className="text-center py-12">
        <CardContent>
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-lg font-medium">No questions available</p>
          <p className="text-muted-foreground mb-4">Contact admin to add questions for Class {user?.class}</p>
          <Button onClick={() => setView("landing")}>Home</Button>
        </CardContent>
      </Card>
    );
    const q = questions[currentIdx];
    const progress = Math.round(((currentIdx + 1) / questions.length) * 100);
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Class {user.class} Quiz</h2>
            <p className="text-muted-foreground">Q{currentIdx + 1} of {questions.length}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4 mr-1" />Logout</Button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground"><span>Progress</span><span>{progress}%</span></div>
          <Progress value={progress} className="h-2" />
        </div>
        <QuestionCard q={q} selected={answers[q._id]} onSelect={selectAnswer} num={currentIdx + 1} />
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={prevQ} disabled={currentIdx === 0}>← Previous</Button>
          <Button onClick={nextQ} disabled={loading}>{currentIdx === questions.length - 1 ? (loading ? "Submitting..." : "Submit Quiz") : "Next →"}</Button>
        </div>
        <Card className="bg-yellow-50/50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800">
          <CardContent className="pt-4 text-center text-sm text-yellow-800 dark:text-yellow-300">⚠️ Cannot retake after submission</CardContent>
        </Card>
      </div>
    );
  };

  const renderResult = () => {
    if (!user) { setView("login"); return null; }
    return <ResultCard score={user.quizScore || 0} total={questions.length || 10} wrong={user.wrongAnswers || []} cls={user.class} />;
  };

  const renderAdmin = () => {
    if (!isAdmin) { setView("admin-login"); return null; }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2"><Settings className="w-6 h-6" />Admin Panel</h2>
            <p className="text-muted-foreground">Manage Class 1-10 questions and view student progress</p>
          </div>
          <Button variant="outline" onClick={handleAdminLogout}><LogOut className="w-4 h-4 mr-2" />Logout</Button>
        </div>

        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="students" onClick={() => { if (studentsList.length === 0) loadAdminData(); }}>Students</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
                <Card key={c} className={adminFilter === String(c) ? "border-primary" : ""} onClick={() => setAdminFilter(adminFilter === String(c) ? "all" : String(c))}>
                  <CardContent className="pt-4 text-center cursor-pointer hover:bg-secondary/30 transition">
                    <div className="text-2xl font-bold">{questionCounts[c] || 0}</div>
                    <div className="text-xs text-muted-foreground">Class {c}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search questions..." value={adminSearch} onChange={(e: any) => setAdminSearch(e.target.value)} className="pl-9" />
                  </div>
                  <ClassSelect value={adminFilter} onChange={setAdminFilter} showAll label="" />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button><Plus className="w-4 h-4 mr-1" />Add Question</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader><DialogTitle>Add Question</DialogTitle></DialogHeader>
                      <AdminQuestionForm initial={null} onSave={handleAdminSave} onCancel={() => {}} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b text-left"><th className="pb-3">Class</th><th className="pb-3">Question</th><th className="pb-3">Correct</th><th className="pb-3 text-right">Actions</th></tr></thead>
                    <tbody className="divide-y">
                      {filteredAdminQs.map((q) => {
                        const correct = q.options.find((o) => o.id === q.correctOptionId)?.text || "-";
                        return (
                          <tr key={q._id} className="hover:bg-secondary/20">
                            <td className="py-3 font-medium">Class {q.class}</td>
                            <td className="py-3 max-w-md truncate" title={q.question}>{q.question}</td>
                            <td className="py-3 text-green-600 truncate max-w-[150px]" title={correct}>{correct}</td>
                            <td className="py-3 text-right">
                              <div className="flex justify-end gap-1">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" onClick={() => setEditingQ(q)}><Edit className="w-4 h-4" /></Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader><DialogTitle>Edit Question</DialogTitle></DialogHeader>
                                    <AdminQuestionForm initial={editingQ} onSave={handleAdminSave} onCancel={() => setEditingQ(null)} />
                                  </DialogContent>
                                </Dialog>
                                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleAdminDelete(q._id)}><Trash className="w-4 h-4" /></Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredAdminQs.length === 0 && (
                        <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">No questions found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats?.totalStudents || studentsList.length}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Quiz Attempted</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-green-600">{stats?.attemptedQuiz || studentsList.filter(s => s.quizAttempted).length}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Not Attempted</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-yellow-600">{stats?.notAttempted || studentsList.filter(s => !s.quizAttempted).length}</div></CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle>Student List</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search by name or email..." value={studentSearch} onChange={(e: any) => setStudentSearch(e.target.value)} className="pl-9" />
                  </div>
                  <ClassSelect value={studentClassFilter} onChange={setStudentClassFilter} showAll label="" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b text-left"><th className="pb-3">Name</th><th className="pb-3">Class</th><th className="pb-3">Status</th><th className="pb-3">Score</th><th className="pb-3 text-right">Actions</th></tr></thead>
                    <tbody className="divide-y">
                      {filteredStudents.map((student) => (
                        <tr key={student._id} className="hover:bg-secondary/20">
                          <td className="py-3">
                            <div><p className="font-medium">{student.name}</p><p className="text-xs text-muted-foreground">{student.email}</p></div>
                          </td>
                          <td className="py-3">Class {student.class}</td>
                          <td className="py-3">
                            {student.quizAttempted ? <Badge variant="default" className="bg-green-500">Attempted</Badge> : <Badge variant="outline">Not Attempted</Badge>}
                          </td>
                          <td className="py-3">{student.quizAttempted ? <span className="font-medium">{student.quizScore}</span> : "-"}</td>
                          <td className="py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(student)}><Eye className="w-4 h-4 mr-1" />View</Button>
                              <Button variant="ghost" size="sm" onClick={() => printStudentDetails(student, 10)}><Printer className="w-4 h-4" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredStudents.length === 0 && (
                        <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No students found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <StudentDetailsModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      </div>
    );
  };

  // ============ MAIN RENDER ============
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 pb-6 border-b">
          <div className="flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-primary" />
            <h1 className="text-3xl font-bold">Quiz Portal</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? "Admin Panel" : user ? `Welcome, ${user.name} (Class ${user.class})` : "Practice quizzes Class 1-10"}
          </p>
        </div>

        {view === "landing" && renderLanding()}
        {(view === "register" || view === "login" || view === "change-class") && renderAuth()}
        {view === "quiz" && renderQuiz()}
        {view === "result" && renderResult()}
        {view === "admin-panel" && renderAdmin()}
      </div>
    </Layout>
  );
}
