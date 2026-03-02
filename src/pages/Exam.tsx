import Layout from "@/components/Layout";
import { FileText, Calendar, Download, Clock, BookOpen, AlertCircle, Plus, Pencil, Trash2, Upload, Loader2, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

const guidelines = [
  "Students must carry their hall tickets to the examination center.",
  "Reach the examination center 30 minutes before the exam starts.",
  "Electronic devices are strictly prohibited in the examination hall.",
  "Use only blue or black pen for writing answers.",
  "Any form of malpractice will lead to immediate disqualification.",
  "Students must bring their own stationery items.",
];

const Exam = () => {
  const { isAdmin } = useAdmin();
  const [examSchedule, setExamSchedule] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Schedule dialog
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [scheduleForm, setScheduleForm] = useState({ exam: "", classes: "", start_date: "", end_date: "" });

  // Result dialog
  const [resultDialog, setResultDialog] = useState(false);
  const [editingResult, setEditingResult] = useState<any>(null);
  const [resultForm, setResultForm] = useState({ title: "", description: "", status: "upcoming", result_date: "" });

  // Resource dialog
  const [resourceDialog, setResourceDialog] = useState(false);
  const [editingResource, setEditingResource] = useState<any>(null);
  const [resourceForm, setResourceForm] = useState({ title: "", file_type: "PDF", file_size: "", file_url: "" });
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const [schedRes, resRes, resourcesRes] = await Promise.all([
        axiosInstance.get("/exam-schedules"),
        axiosInstance.get("/exam/results"),
        axiosInstance.get("/exam/resources"),
      ]);
      setExamSchedule(schedRes.data || []);
      setResults(resRes.data || []);
      setResources(resourcesRes.data || []);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Schedule CRUD
  const openAddSchedule = () => {
    setEditingSchedule(null);
    setScheduleForm({ exam: "", classes: "", start_date: "", end_date: "" });
    setScheduleDialog(true);
  };

  const openEditSchedule = (s: any) => {
    setEditingSchedule(s);
    setScheduleForm({ exam: s.exam, classes: s.classes, start_date: s.start_date, end_date: s.end_date });
    setScheduleDialog(true);
  };

  const saveSchedule = async () => {
    if (!scheduleForm.exam || !scheduleForm.classes || !scheduleForm.start_date || !scheduleForm.end_date) {
      toast.error("All fields required");
      return;
    }
    try {
      if (editingSchedule) {
        await axiosInstance.put(`/exam-schedules/${editingSchedule._id}`, scheduleForm);
        toast.success("Schedule updated!");
      } else {
        await axiosInstance.post("/exam-schedules", scheduleForm);
        toast.success("Schedule added!");
      }
      setScheduleDialog(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to save schedule");
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      await axiosInstance.delete(`/exam-schedules/${id}`);
      toast.success("Schedule removed!");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete schedule");
    }
  };

  // Result CRUD
  const openAddResult = () => {
    setEditingResult(null);
    setResultForm({ title: "", description: "", status: "upcoming", result_date: "" });
    setResultDialog(true);
  };

  const openEditResult = (r: any) => {
    setEditingResult(r);
    setResultForm({ title: r.title, description: r.description, status: r.status, result_date: r.result_date || "" });
    setResultDialog(true);
  };

  const saveResult = async () => {
    if (!resultForm.title) {
      toast.error("Title required");
      return;
    }
    try {
      if (editingResult) {
        await axiosInstance.put(`/exam/results/${editingResult._id}`, resultForm);
        toast.success("Result updated!");
      } else {
        await axiosInstance.post("/exam/results", resultForm);
        toast.success("Result added!");
      }
      setResultDialog(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to save result");
    }
  };

  const deleteResult = async (id: string) => {
    try {
      await axiosInstance.delete(`/exam/results/${id}`);
      toast.success("Result removed!");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete result");
    }
  };

  // Resource CRUD
  const openAddResource = () => {
    setEditingResource(null);
    setResourceForm({ title: "", file_type: "PDF", file_size: "", file_url: "" });
    setResourceFile(null);
    setResourceDialog(true);
  };

  const openEditResource = (r: any) => {
    setEditingResource(r);
    setResourceForm({ title: r.title, file_type: r.file_type, file_size: r.file_size, file_url: r.file_url });
    setResourceDialog(true);
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await axiosInstance.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.url;
  };

  const saveResource = async () => {
    if (!resourceForm.title || !resourceForm.file_url) {
      toast.error("Title and File URL are required");
      return;
    }
    setUploading(true);
    try {
      let file_url = resourceForm.file_url;
      if (resourceFile) {
        file_url = await uploadFile(resourceFile);
      }
      const payload = { ...resourceForm, file_url };
      if (editingResource) {
        await axiosInstance.put(`/exam/resources/${editingResource._id}`, payload);
        toast.success("Resource updated!");
      } else {
        await axiosInstance.post("/exam/resources", payload);
        toast.success("Resource added!");
      }
      setResourceDialog(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to save resource");
    } finally {
      setUploading(false);
    }
  };

  const deleteResource = async (id: string) => {
    try {
      await axiosInstance.delete(`/exam/resources/${id}`);
      toast.success("Resource removed!");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete resource");
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <FileText className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground animate-fade-in">
              Examinations
            </h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up px-2" style={{ animationDelay: "0.1s" }}>
            Stay updated with exam schedules, results, and important guidelines
          </p>
        </div>
      </section>

      {/* Exam Schedule Section */}
      <section className="py-10 sm:py-14 md:py-20">
        {/* Exam Schedule Content */}
      </section>

      {/* Results Section */}
      <section className="py-10 sm:py-14 md:py-20 bg-secondary/30">
        {/* Results Content */}
      </section>

      {/* Guidelines & Resources Section */}
      <section className="py-10 sm:py-14 md:py-20">
        {/* Guidelines & Resources Content */}
      </section>

      {/* Dialogs */}
      {/* Schedule Dialog, Result Dialog, Resource Dialog */}
    </Layout>
  );
};

export default Exam;
