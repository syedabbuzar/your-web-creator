// src/pages/quiz/index.tsx
// 🎓 Pure Frontend Quiz System - Single File Solution
// ✅ No Backend | ✅ localStorage Only | ✅ SPA Client Routing

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
  BookOpen,
  LogOut,
  Settings,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Edit,
  Trash,
  Plus,
  Search,
  Users,
  Award,
  Calendar,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

// ============ TYPES (Inline - No Separate File) ============
type UserRole = "student" | "admin";
type QuizView =
  | "landing"
  | "register"
  | "login"
  | "quiz"
  | "result"
  | "admin-login"
  | "admin-panel"
  | "change-class";

interface QuizOption {
  id: "a" | "b" | "c";
  text: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: "a" | "b" | "c";
  class: number;
  createdAt: string;
}

interface WrongAnswer {
  questionId: string;
  questionText: string;
  selectedOption: string;
  correctOption: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  class: number;
  role: UserRole;
  quizAttempted: boolean;
  quizScore?: number;
  wrongAnswers?: WrongAnswer[];
  createdAt: string;
}

// ============ STORAGE KEYS ============
const STORAGE = {
  STUDENTS: "scholar_quiz_students",
  QUESTIONS: "scholar_quiz_questions",
  CURRENT_USER: "scholar_quiz_current_user",
  ADMIN_SESSION: "scholar_quiz_admin_session",
};

// ============ ADMIN CREDENTIALS (FIXED) ============
const ADMIN_CREDENTIALS = {
  email: "scholaries4282@gmail.com",
  password: "Schol@r123",
};

// ============ STORAGE HELPERS ============
const getFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getSession = (key: string): boolean => sessionStorage.getItem(key) === "true";
const setSession = (key: string, value: boolean) => {
  if (value) sessionStorage.setItem(key, "true");
  else sessionStorage.removeItem(key);
};

// ============ INITIALIZATION ============
const initializeData = () => {
  if (!localStorage.getItem(STORAGE.STUDENTS)) {
    saveToStorage(STORAGE.STUDENTS, []);
  }

  if (!localStorage.getItem(STORAGE.QUESTIONS)) {
    seedQuestions();
  }
};

const seedQuestions = () => {
  const questions: QuizQuestion[] = [];
  const bank = [
    { q: "Capital of India?", opts: ["Mumbai", "New Delhi", "Kolkata"], a: 1 },
    { q: "2 + 2 = ?", opts: ["3", "4", "5"], a: 1 },
    { q: "Red Planet?", opts: ["Venus", "Mars", "Jupiter"], a: 1 },
    { q: "Water formula?", opts: ["H2O", "CO2", "O2"], a: 0 },
    { q: "Largest mammal?", opts: ["Elephant", "Blue Whale", "Giraffe"], a: 1 },
    { q: "Sun rises in?", opts: ["West", "East", "North"], a: 1 },
    { q: "Rainbow colors?", opts: ["5", "6", "7"], a: 2 },
    { q: "Fastest animal?", opts: ["Lion", "Cheetah", "Horse"], a: 1 },
    { q: "Smallest prime?", opts: ["0", "1", "2"], a: 2 },
    { q: "India's national bird?", opts: ["Parrot", "Peacock", "Sparrow"], a: 1 },
  ];

  for (let cls = 1; cls <= 10; cls++) {
    bank.forEach((b, idx) => {
      questions.push({
        id: `q${cls}_${idx + 1}`,
        question: `Class ${cls} - Q${idx + 1}: ${b.q}`,
        options: b.opts.map((t, i) => ({ id: String.fromCharCode(97 + i) as "a" | "b" | "c", text: t })),
        correctOptionId: String.fromCharCode(97 + b.a) as "a" | "b" | "c",
        class: cls,
        createdAt: new Date().toISOString(),
      });
    });
  }
  saveToStorage(STORAGE.QUESTIONS, questions);
};

// ============ AUTH FUNCTIONS ============
const getStudents = (): User[] => getFromStorage<User[]>(STORAGE.STUDENTS, []);
const saveStudents = (students: User[]) => saveToStorage(STORAGE.STUDENTS, students);

const registerStudent = (data: {
  name: string;
  email: string;
  password: string;
  class: number;
}): { success: boolean; message: string; user?: User } => {
  const students = getStudents();

  if (!data.name.trim()) return { success: false, message: "Name required" };
  if (!/\S+@\S+\.\S+/.test(data.email)) return { success: false, message: "Valid email required" };
  if (data.password.length < 6) return { success: false, message: "Password min 6 chars" };
  if (data.class < 1 || data.class > 10) return { success: false, message: "Invalid class" };
  if (students.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { success: false, message: "Email already registered" };
  }

  const newUser: User = {
    id: `stu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    password: data.password,
    class: data.class,
    role: "student",
    quizAttempted: false,
    createdAt: new Date().toISOString(),
  };

  students.push(newUser);
  saveStudents(students);
  return { success: true, message: "Registered! Please login.", user: newUser };
};

const loginStudent = (email: string, password: string): { success: boolean; message: string; user?: User } => {
  const students = getStudents();
  const user = students.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );
  return user
    ? { success: true, message: "Login successful", user }
    : { success: false, message: "Invalid credentials" };
};

const updateStudentClass = (
  email: string,
  password: string,
  newClass: number
): { success: boolean; message: string } => {
  if (newClass < 1 || newClass > 10) return { success: false, message: "Invalid class" };
  const students = getStudents();
  const idx = students.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (idx === -1) return { success: false, message: "Account not found" };
  if (students[idx].password !== password) return { success: false, message: "Wrong password" };

  students[idx].class = newClass;
  students[idx].quizAttempted = false;
  students[idx].quizScore = undefined;
  students[idx].wrongAnswers = undefined;
  saveStudents(students);
  return { success: true, message: "Class updated! Login again." };
};

const getCurrentUser = (): User | null => {
  const id = localStorage.getItem(STORAGE.CURRENT_USER);
  if (!id) return null;
  return getStudents().find((u) => u.id === id) || null;
};

const setCurrentUser = (user: User | null) => {
  if (user?.id) localStorage.setItem(STORAGE.CURRENT_USER, user.id);
  else localStorage.removeItem(STORAGE.CURRENT_USER);
};

const logoutStudent = () => localStorage.removeItem(STORAGE.CURRENT_USER);

const markQuizAttempted = (userId: string, score: number, wrong: WrongAnswer[]) => {
  const students = getStudents();
  const idx = students.findIndex((u) => u.id === userId);
  if (idx === -1) return false;

  students[idx].quizAttempted = true;
  students[idx].quizScore = score;
  students[idx].wrongAnswers = wrong;
  saveStudents(students);

  const current = getCurrentUser();
  if (current?.id === userId) setCurrentUser(students[idx]);
  return true;
};

// ============ QUIZ STORAGE FUNCTIONS ============
const getQuestions = (): QuizQuestion[] => getFromStorage<QuizQuestion[]>(STORAGE.QUESTIONS, []);
const saveQuestions = (qs: QuizQuestion[]) => saveToStorage(STORAGE.QUESTIONS, qs);

const getQuestionsByClass = (cls: number): QuizQuestion[] =>
  getQuestions()
    .filter((q) => q.class === cls)
    .sort((a, b) => a.id.localeCompare(b.id));

const addQuestion = (q: Omit<QuizQuestion, "id" | "createdAt">) => {
  const questions = getQuestions();
  const newQ: QuizQuestion = {
    ...q,
    id: `q_${q.class}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  questions.push(newQ);
  saveQuestions(questions);
  return newQ;
};

const updateQuestion = (id: string, updates: Partial<QuizQuestion>) => {
  const questions = getQuestions();
  const idx = questions.findIndex((q) => q.id === id);
  if (idx === -1) return false;
  questions[idx] = { ...questions[idx], ...updates };
  saveQuestions(questions);
  return true;
};

const deleteQuestion = (id: string) => {
  saveQuestions(getQuestions().filter((q) => q.id !== id));
  return true;
};

const getQuestionCounts = (): Record<number, number> => {
  const qs = getQuestions();
  const counts: Record<number, number> = {};
  for (let c = 1; c <= 10; c++) counts[c] = qs.filter((q) => q.class === c).length;
  return counts;
};

// ============ STUDENT STATISTICS FUNCTIONS ============
const getStudentStats = () => {
  const students = getStudents();
  const totalStudents = students.length;
  const attemptedQuiz = students.filter((s) => s.quizAttempted).length;
  const notAttempted = totalStudents - attemptedQuiz;

  const classWiseStats: Record<number, { total: number; attempted: number; avgScore: number }> = {};

  for (let cls = 1; cls <= 10; cls++) {
    const classStudents = students.filter((s) => s.class === cls);
    const attemptedInClass = classStudents.filter((s) => s.quizAttempted);
    const avgScore =
      attemptedInClass.length > 0
        ? attemptedInClass.reduce((sum, s) => sum + (s.quizScore || 0), 0) / attemptedInClass.length
        : 0;

    classWiseStats[cls] = {
      total: classStudents.length,
      attempted: attemptedInClass.length,
      avgScore: Math.round(avgScore * 10) / 10,
    };
  }

  return {
    totalStudents,
    attemptedQuiz,
    notAttempted,
    classWiseStats,
  };
};

const getStudentDetails = (classFilter?: number, searchTerm?: string) => {
  let students = getStudents();

  if (classFilter && classFilter > 0) {
    students = students.filter((s) => s.class === classFilter);
  }

  if (searchTerm && searchTerm.trim()) {
    const term = searchTerm.toLowerCase().trim();
    students = students.filter(
      (s) => s.name.toLowerCase().includes(term) || s.email.toLowerCase().includes(term)
    );
  }

  return students.sort((a, b) => {
    // Show attempted first, then by class, then by name
    if (a.quizAttempted !== b.quizAttempted) {
      return a.quizAttempted ? -1 : 1;
    }
    if (a.class !== b.class) {
      return a.class - b.class;
    }
    return a.name.localeCompare(b.name);
  });
};

// ============ MAIN COMPONENT ============
export default function QuizPage() {
  // Router State
  const [view, setView] = useState<QuizView>("landing");
  const [user, setUser] = useState<User | null>(null);
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

  // Student Details State
  const [studentsList, setStudentsList] = useState<User[]>([]);
  const [studentClassFilter, setStudentClassFilter] = useState<string>("all");
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    class: "",
    newClass: "",
  });
  const [loading, setLoading] = useState(false);

  // Initialize on mount
  useEffect(() => {
    initializeData();
    const u = getCurrentUser();
    const adminActive = getSession(STORAGE.ADMIN_SESSION);

    setUser(u);
    setIsAdmin(adminActive);

    if (adminActive) setView("admin-panel");
    else if (u) setView(u.quizAttempted ? "result" : "quiz");
    else setView("landing");

    if (u) setQuestions(getQuestionsByClass(u.class));
    if (adminActive) {
      setAdminQs(getQuestions());
      setStudentsList(getStudentDetails());
    }
  }, []);

  // Refresh user data
  const refreshUser = () => {
    const u = getCurrentUser();
    setUser(u);
    if (u) {
      setQuestions(getQuestionsByClass(u.class));
      if (u.quizAttempted && view === "quiz") setView("result");
    }
  };

  // Refresh student list
  const refreshStudents = () => {
    const filter = studentClassFilter === "all" ? undefined : parseInt(studentClassFilter);
    setStudentsList(getStudentDetails(filter, studentSearch));
  };

  // ============ NAVIGATION ============
  const navigate = (v: QuizView) => {
    if (v === "admin-panel" && !isAdmin) {
      setView("admin-login");
      return;
    }
    if ((v === "quiz" || v === "result") && !user) {
      setView("login");
      return;
    }
    setView(v);
  };

  // ============ AUTH HANDLERS ============
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords mismatch");
      return;
    }
    if (!form.class) {
      toast.error("Select class");
      return;
    }

    setLoading(true);
    const res = registerStudent({
      name: form.name,
      email: form.email,
      password: form.password,
      class: parseInt(form.class),
    });

    if (res.success) {
      toast.success(res.message);
      setView("login");
      setForm({ ...form, password: "", confirm: "" });
    } else toast.error(res.message);
    setLoading(false);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = loginStudent(form.email, form.password);

    if (res.success && res.user) {
      setCurrentUser(res.user);
      setUser(res.user);
      setQuestions(getQuestionsByClass(res.user.class));
      toast.success(res.message);
      navigate(res.user.quizAttempted ? "result" : "quiz");
      setForm({ ...form, password: "" });
    } else toast.error(res.message);
    setLoading(false);
  };

  const handleChangeClass = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.newClass) {
      toast.error("Select new class");
      return;
    }

    setLoading(true);
    const res = updateStudentClass(form.email, form.password, parseInt(form.newClass));

    if (res.success) {
      toast.success(res.message);
      logoutStudent();
      setUser(null);
      setView("login");
      setForm({ ...form, password: "", newClass: "" });
    } else toast.error(res.message);
    setLoading(false);
  };

  const handleLogout = () => {
    logoutStudent();
    setUser(null);
    setView("landing");
    toast.info("Logged out");
  };

  const handleAdminLogin = (e: FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const email = fd.get("email") as string;
    const pass = fd.get("password") as string;

    if (email === ADMIN_CREDENTIALS.email && pass === ADMIN_CREDENTIALS.password) {
      setSession(STORAGE.ADMIN_SESSION, true);
      setIsAdmin(true);
      setAdminQs(getQuestions());
      setStudentsList(getStudentDetails());
      setView("admin-panel");
      toast.success("Admin access granted");
      (e.currentTarget as HTMLFormElement).reset();
    } else toast.error("Invalid admin credentials");
  };

  const handleAdminLogout = () => {
    setSession(STORAGE.ADMIN_SESSION, false);
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

  const selectAnswer = (qid: string, opt: "a" | "b" | "c") => setAnswers((p) => ({ ...p, [qid]: opt }));

  const nextQ = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx((p) => p + 1);
    else submitQuiz();
  };

  const prevQ = () => {
    if (currentIdx > 0) setCurrentIdx((p) => p - 1);
  };

  const submitQuiz = () => {
    if (!user) return;
    let score = 0;
    const wrong: WrongAnswer[] = [];

    questions.forEach((q) => {
      const sel = answers[q.id];
      if (sel === q.correctOptionId) score++;
      else {
        wrong.push({
          questionId: q.id,
          questionText: q.question,
          selectedOption: q.options.find((o) => o.id === sel)?.text || "Not answered",
          correctOption: q.options.find((o) => o.id === q.correctOptionId)?.text || "",
        });
      }
    });

    markQuizAttempted(user.id, score, wrong);
    refreshUser();
    setView("result");
    toast.success(`Submitted! Score: ${score}/${questions.length}`);
  };

  // ============ ADMIN HANDLERS ============
  const handleAdminSave = async (data: {
    question: string;
    class: number;
    options: string[];
    correctIdx: number;
  }) => {
    setAdminLoading(true);
    const opts = data.options.map((t, i) => ({
      id: String.fromCharCode(97 + i) as "a" | "b" | "c",
      text: t,
    }));

    if (editingQ) {
      updateQuestion(editingQ.id, {
        question: data.question,
        class: data.class,
        options: opts,
        correctOptionId: opts[data.correctIdx].id,
      });
      toast.success("Question updated");
    } else {
      addQuestion({
        question: data.question,
        class: data.class,
        options: opts,
        correctOptionId: opts[data.correctIdx].id,
      });
      toast.success("Question added");
    }

    setAdminQs(getQuestions());
    setEditingQ(null);
    setAdminLoading(false);
  };

  const handleAdminDelete = (id: string) => {
    if (confirm("Delete permanently?")) {
      deleteQuestion(id);
      setAdminQs(getQuestions());
      toast.success("Deleted");
    }
  };

  const filteredAdminQs = adminQs.filter((q) => {
    const cMatch = adminFilter === "all" || q.class === parseInt(adminFilter);
    const sMatch = q.question.toLowerCase().includes(adminSearch.toLowerCase());
    return cMatch && sMatch;
  });

  // Apply filters to students
  useEffect(() => {
    if (isAdmin) {
      refreshStudents();
    }
  }, [studentClassFilter, studentSearch, isAdmin]);

  // ============ SUB-COMPONENTS (Inline) ============

  // Class Selector Component
  const ClassSelect = ({ value, onChange, label, disabled, showAll }: any) => (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Select class (1-10)" />
        </SelectTrigger>
        <SelectContent>
          {showAll && <SelectItem value="all">All Classes</SelectItem>}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
            <SelectItem key={c} value={String(c)}>
              Class {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  // Quiz Question Component
  const QuestionCard = ({ q, selected, onSelect, showResult, num }: any) => (
    <Card className={showResult ? "border-2 border-primary/50" : ""}>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
            {num}
          </span>
          <p className="font-medium text-lg">{q.question}</p>
        </div>
        <RadioGroup
          value={selected}
          onValueChange={(v: "a" | "b" | "c") => onSelect(q.id, v)}
          className="space-y-2 pl-10"
          disabled={showResult}
        >
          {q.options.map((opt) => {
            const isCorrect = opt.id === q.correctOptionId;
            const isSelected = selected === opt.id;
            const style = showResult
              ? isCorrect
                ? "bg-green-50 border-green-300"
                : isSelected
                ? "bg-red-50 border-red-300"
                : ""
              : "hover:bg-secondary/50";
            return (
              <div key={opt.id} className={`flex items-center space-x-3 p-3 rounded-lg border transition ${style}`}>
                <RadioGroupItem value={opt.id} id={`${q.id}-${opt.id}`} />
                <Label htmlFor={`${q.id}-${opt.id}`} className="flex-1 cursor-pointer font-normal">
                  <span className="font-semibold mr-2 text-muted-foreground">{opt.id.toUpperCase()}.</span>
                  {opt.text}
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

  // Result Component
  const ResultCard = ({ score, total, wrong, cls }: any) => {
    const pct = Math.round((score / total) * 100);
    const msg =
      pct >= 70
        ? { t: "Great! 👏", c: "text-green-600" }
        : pct >= 50
        ? { t: "Good! 👍", c: "text-yellow-600" }
        : { t: "Practice! 📚", c: "text-orange-600" };
    return (
      <div className="space-y-6">
        <Card className="text-center border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              {pct >= 70 ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              )}
              Class {cls} Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-6xl font-bold">
              {score}/{total}
            </div>
            <div className={`text-2xl font-semibold ${msg.c}`}>{msg.t}</div>
            <Badge variant={pct >= 70 ? "default" : "secondary"} className="text-lg py-1">
              {pct}%
            </Badge>
          </CardContent>
        </Card>
        {wrong.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="w-5 h-5" /> Mistakes ({wrong.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {wrong.map((w: any, i: number) => (
                <div key={i} className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                  <p className="font-medium">
                    <span className="text-muted-foreground">Q{i + 1}:</span> {w.questionText}
                  </p>
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
              <Button variant="outline" onClick={() => setView("landing")}>
                Home
              </Button>
              <Button variant="secondary" onClick={() => setView("change-class")}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Change Class
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Admin Question Form (Dialog Content)
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
          <Textarea
            value={f.question}
            onChange={(e: any) => setF({ ...f, question: e.target.value })}
            placeholder="Enter question..."
            rows={3}
            required
          />
        </div>
        <ClassSelect value={f.class} onChange={(v: string) => setF({ ...f, class: v })} label="Class *" />
        <div className="space-y-3">
          <Label>Options (3) *</Label>
          {f.options.map((opt: string, idx: number) => (
            <div key={idx} className="flex items-center gap-3 p-2 rounded hover:bg-secondary/30">
              <input
                type="radio"
                name="correct"
                checked={f.correctIdx === idx}
                onChange={() => setF({ ...f, correctIdx: idx })}
                className="w-4 h-4"
              />
              <Input
                value={opt}
                onChange={(e: any) => {
                  const o = [...f.options];
                  o[idx] = e.target.value;
                  setF({ ...f, options: o });
                }}
                placeholder={`Option ${String.fromCharCode(97 + idx)}`}
                required
              />
              <span className="text-sm text-muted-foreground w-5">{String.fromCharCode(97 + idx)}</span>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">🔘 Select correct answer</p>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={adminLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={adminLoading}>
            {adminLoading ? "Saving..." : initial ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    );
  };

  // Student Details Modal
  const StudentDetailsModal = ({ student, onClose }: { student: User | null; onClose: () => void }) => {
    if (!student) return null;

    const totalQuestions = getQuestionsByClass(student.class).length;
    const percentage = student.quizScore ? Math.round((student.quizScore / totalQuestions) * 100) : 0;

    return (
      <Dialog open={!!student} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" /> Student Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium">{student.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{student.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Class</Label>
                <p className="font-medium">Class {student.class}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Registered</Label>
                <p className="font-medium">{new Date(student.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <Card className={student.quizAttempted ? "border-green-200" : "border-gray-200"}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {student.quizAttempted ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  Quiz Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {student.quizAttempted ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Score</span>
                      <span className="text-2xl font-bold">
                        {student.quizScore}/{totalQuestions}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Percentage</span>
                        <span>{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>

                    {student.wrongAnswers && student.wrongAnswers.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2 flex items-center gap-1 text-red-600">
                          <XCircle className="w-4 h-4" /> Wrong Answers ({student.wrongAnswers.length})
                        </h4>
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
        <p className="text-muted-foreground max-w-xl mx-auto">
          Practice quizzes for Class 1-10. Register, attempt, and track progress.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          size="lg"
          onClick={() => {
            setForm({ ...form, password: "", confirm: "" });
            setView("register");
          }}
        >
          <User className="w-4 h-4 mr-2" />
          Register
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            setForm({ ...form, password: "" });
            setView("login");
          }}
        >
          Login
        </Button>
      </div>
      <Card className="max-w-md mx-auto mt-8 border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Admin Access
          </CardTitle>
          <CardDescription>Manage quiz questions</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-3">
            <Input name="email" type="email" placeholder="Admin email" required />
            <Input name="password" type="password" placeholder="Admin password" required />
            <Button type="submit" className="w-full" variant="secondary">
              Admin Login
            </Button>
          </form>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Demo: scholaries4282@gmail.com / Schol@r123
          </p>
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
            {view === "register"
              ? "Create account"
              : view === "change-class"
              ? "Verify to update class"
              : "Access your quiz"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={
              view === "register"
                ? handleRegister
                : view === "change-class"
                ? handleChangeClass
                : handleLogin
            }
            className="space-y-4"
          >
            {view === "register" && (
              <>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e: any) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    required
                  />
                </div>
                <ClassSelect
                  value={form.class}
                  onChange={(v: string) => setForm({ ...form, class: v })}
                  label="Your Class"
                />
              </>
            )}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e: any) => setForm({ ...form, email: e.target.value })}
                placeholder="student@example.com"
                required
                disabled={view === "change-class"}
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e: any) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••"
                minLength={6}
                required
              />
            </div>
            {view === "register" && (
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  value={form.confirm}
                  onChange={(e: any) => setForm({ ...form, confirm: e.target.value })}
                  placeholder="••••••"
                  required
                />
              </div>
            )}
            {view === "change-class" && (
              <ClassSelect
                value={form.newClass}
                onChange={(v: string) => setForm({ ...form, newClass: v })}
                label="New Class"
              />
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Processing..."
                : view === "register"
                ? "Register"
                : view === "change-class"
                ? "Update"
                : "Login"}
            </Button>
          </form>
          <div className="mt-4 text-center space-y-2 text-sm">
            {view === "login" && (
              <>
                <p>
                  New?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => {
                      setForm({ ...form, password: "", confirm: "" });
                      setView("register");
                    }}
                  >
                    Register
                  </Button>
                </p>
                <p>
                  Wrong class?{" "}
                  <Button variant="link" className="p-0 h-auto" onClick={() => setView("change-class")}>
                    Change here
                  </Button>
                </p>
              </>
            )}
            {(view === "register" || view === "change-class") && (
              <p>
                Have account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => {
                    setForm({ ...form, password: "" });
                    setView("login");
                  }}
                >
                  Login
                </Button>
              </p>
            )}
            {view === "change-class" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setView("login");
                  setForm({ ...form, password: "", newClass: "" });
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderQuiz = () => {
    if (!user || questions.length === 0)
      return (
        <Card className="text-center py-12">
          <CardContent>
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-lg font-medium">No questions available</p>
            <p className="text-muted-foreground mb-4">
              Contact admin to add questions for Class {user?.class}
            </p>
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
            <p className="text-muted-foreground">
              Q{currentIdx + 1} of {questions.length}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <QuestionCard q={q} selected={answers[q.id]} onSelect={selectAnswer} num={currentIdx + 1} />
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={prevQ} disabled={currentIdx === 0}>
            ← Previous
          </Button>
          <Button onClick={nextQ}>{currentIdx === questions.length - 1 ? "Submit Quiz" : "Next →"}</Button>
        </div>
        <Card className="bg-yellow-50/50 border-yellow-200">
          <CardContent className="pt-4 text-center text-sm text-yellow-800">
            ⚠️ Cannot retake after submission
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderResult = () => {
    if (!user) {
      setView("login");
      return null;
    }
    return <ResultCard score={user.quizScore || 0} total={questions.length || 10} wrong={user.wrongAnswers || []} cls={user.class} />;
  };

  const renderAdmin = () => {
    if (!isAdmin) {
      setView("admin-login");
      return null;
    }
    const stats = getStudentStats();
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Admin Panel
            </h2>
            <p className="text-muted-foreground">Manage Class 1-10 questions and view student progress</p>
          </div>
          <Button variant="outline" onClick={handleAdminLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4 mt-4">
            {/* Question Management */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => {
                const counts = getQuestionCounts();
                return (
                  <Card
                    key={c}
                    className={adminFilter === String(c) ? "border-primary" : ""}
                    onClick={() => setAdminFilter(adminFilter === String(c) ? "all" : String(c))}
                  >
                    <CardContent className="pt-4 text-center cursor-pointer hover:bg-secondary/30 transition">
                      <div className="text-2xl font-bold">{counts[c] || 0}</div>
                      <div className="text-xs text-muted-foreground">Class {c}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Card>
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search questions..."
                      value={adminSearch}
                      onChange={(e: any) => setAdminSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <ClassSelect value={adminFilter} onChange={setAdminFilter} showAll label="" />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Question
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add Question</DialogTitle>
                      </DialogHeader>
                      <AdminQuestionForm
                        initial={null}
                        onSave={handleAdminSave}
                        onCancel={() => {}}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3">Class</th>
                        <th className="pb-3">Question</th>
                        <th className="pb-3">Correct</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredAdminQs.map((q) => {
                        const correct = q.options.find((o) => o.id === q.correctOptionId)?.text || "-";
                        return (
                          <tr key={q.id} className="hover:bg-secondary/20">
                            <td className="py-3 font-medium">Class {q.class}</td>
                            <td className="py-3 max-w-md truncate" title={q.question}>
                              {q.question}
                            </td>
                            <td className="py-3 text-green-600 truncate max-w-[150px]" title={correct}>
                              {correct}
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex justify-end gap-1">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setEditingQ(q)}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Edit Question</DialogTitle>
                                    </DialogHeader>
                                    <AdminQuestionForm
                                      initial={editingQ}
                                      onSave={handleAdminSave}
                                      onCancel={() => setEditingQ(null)}
                                    />
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive"
                                  onClick={() => handleAdminDelete(q.id)}
                                >
                                  <Trash className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredAdminQs.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-muted-foreground">
                            No questions found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-4 mt-4">
            {/* Student Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStudents}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Quiz Attempted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.attemptedQuiz}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Not Attempted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.notAttempted}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Class-wise Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => {
                    const classStat = stats.classWiseStats[c];
                    return (
                      <Card key={c} className="text-center">
                        <CardContent className="pt-4">
                          <div className="text-lg font-bold">Class {c}</div>
                          <div className="text-sm text-muted-foreground">
                            {classStat.attempted}/{classStat.total}
                          </div>
                          {classStat.avgScore > 0 && (
                            <Badge variant="outline" className="mt-2">
                              Avg: {classStat.avgScore}%
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={studentSearch}
                      onChange={(e: any) => setStudentSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <ClassSelect
                    value={studentClassFilter}
                    onChange={setStudentClassFilter}
                    showAll
                    label=""
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Class</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Score</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {studentsList.map((student) => (
                        <tr key={student.id} className="hover:bg-secondary/20">
                          <td className="py-3">
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.email}</p>
                            </div>
                          </td>
                          <td className="py-3">Class {student.class}</td>
                          <td className="py-3">
                            {student.quizAttempted ? (
                              <Badge variant="default" className="bg-green-500">
                                Attempted
                              </Badge>
                            ) : (
                              <Badge variant="outline">Not Attempted</Badge>
                            )}
                          </td>
                          <td className="py-3">
                            {student.quizAttempted ? (
                              <span className="font-medium">
                                {student.quizScore}/{getQuestionsByClass(student.class).length}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedStudent(student)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {studentsList.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-muted-foreground">
                            No students found
                          </td>
                        </tr>
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
            {isAdmin
              ? "Admin Panel"
              : user
              ? `Welcome, ${user.name} (Class ${user.class})`
              : "Practice quizzes Class 1-10"}
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