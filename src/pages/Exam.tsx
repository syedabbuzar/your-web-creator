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

// ============ TYPES ============
interface ExamSchedule {
  _id?: string;
  id?: string;
  exam: string;
  classes: string;
  start_date: string;
  end_date: string;
}

interface Result {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  status: "upcoming" | "published";
  result_date: string;
}

interface Resource {
  _id?: string;
  id?: string;
  title: string;
  file_type: string;
  file_size: string;
  file_url: string;
}

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
  const [examSchedule, setExamSchedule] = useState<ExamSchedule[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  // Schedule dialog
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ExamSchedule | null>(null);
  const [scheduleForm, setScheduleForm] = useState({ exam: "", classes: "", start_date: "", end_date: "" });

  // Result dialog
  const [resultDialog, setResultDialog] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [resultForm, setResultForm] = useState({ title: "", description: "", status: "upcoming" as "upcoming" | "published", result_date: "" });

  // Resource dialog
  const [resourceDialog, setResourceDialog] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [resourceForm, setResourceForm] = useState({ title: "", file_type: "PDF", file_size: "", file_url: "" });
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractList = (payload: any, key?: string) => {
    if (key && Array.isArray(payload?.[key])) return payload[key];
    if (Array.isArray(payload?.data)) return payload.data;
    return Array.isArray(payload) ? payload : [];
  };
  const getItemId = (item: any) => item?._id || item?.id;

  const fetchData = async () => {
    try {
      const [schedRes, resRes, resourcesRes] = await Promise.all([
        axiosInstance.get("/exam-schedules"),
        axiosInstance.get("/exam/results"),
        axiosInstance.get("/exam/resources"),
      ]);
      setExamSchedule(extractList(schedRes.data, "schedules"));
      setResults(extractList(resRes.data, "results"));
      setResources(extractList(resourcesRes.data, "resources"));
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Result CRUD
  const openAddResult = () => {
    setEditingResult(null);
    setResultForm({ title: "", description: "", status: "upcoming", result_date: "" });
    setResultDialog(true);
  };

  const openEditResult = (r: Result) => {
    setEditingResult(r);
    setResultForm({ title: r.title, description: r.description, status: r.status, result_date: r.result_date });
    setResultDialog(true);
  };

  const saveResult = async () => {
    if (!resultForm.title) {
      toast.error("Title required");
      return;
    }
    try {
      const resultId = editingResult ? getItemId(editingResult) : null;
      if (editingResult && resultId) {
        await axiosInstance.put(`/exam/results/${resultId}`, resultForm);
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

  const openEditResource = (r: Resource) => {
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
      const resourceId = editingResource ? getItemId(editingResource) : null;
      if (editingResource && resourceId) {
        await axiosInstance.put(`/exam/resources/${resourceId}`, payload);
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

      {/* Results Section */}
      <section className="py-10 sm:py-14 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Result Announcements</h2>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Check your examination results here</p>
            {isAdmin && (
              <Button onClick={openAddResult} size="sm" className="bg-primary text-primary-foreground rounded-full text-xs sm:text-sm mt-3">
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" /> Add Result
              </Button>
            )}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {results.map((result, index) => {
              const resultId = getItemId(result);
              return (
                <div key={resultId || index} className="bg-card p-4 sm:p-6 rounded-lg shadow-lg animate-fade-in-up relative group" style={{ animationDelay: `${index * 0.1}s` }}>
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditResult(result)} className="p-1.5 bg-card rounded-full shadow-md hover:bg-secondary"><Pencil className="w-3.5 h-3.5 text-primary" /></button>
                      <button onClick={() => resultId && deleteResult(resultId)} className="p-1.5 bg-card rounded-full shadow-md hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                    </div>
                  )}
                  <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-3 animate-float" />
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 text-center">{result.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 text-center">{result.description}</p>
                  {result.result_date && <p className="text-xs text-primary font-medium text-center">{result.result_date}</p>}
                  <div className="text-center">
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${result.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {result.status === 'published' ? 'Published' : 'Upcoming'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <Download className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Download Resources</h2>
            </div>
            {isAdmin && (
              <Button onClick={openAddResource} size="sm" className="bg-primary text-primary-foreground rounded-full text-xs sm:text-sm">
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" /> Add Resource
              </Button>
            )}
          </div>
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {resources.map((resource, index) => {
              const resourceId = getItemId(resource);
              return (
                <div key={resourceId || index} className="flex items-center justify-between p-3 sm:p-4 bg-card rounded-lg shadow card-hover animate-fade-in-up relative group" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <FileText className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground text-xs sm:text-sm">{resource.title}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{resource.file_type} • {resource.file_size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {isAdmin && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-1">
                        <button onClick={() => openEditResource(resource)} className="p-1.5 hover:bg-secondary rounded"><Pencil className="w-3 h-3 text-primary" /></button>
                        <button onClick={() => resourceId && deleteResource(resourceId)} className="p-1.5 hover:bg-destructive/10 rounded"><Trash2 className="w-3 h-3 text-destructive" /></button>
                      </div>
                    )}
                    {resource.file_url && (
                      <a href={resource.file_url} target="_blank" rel="noopener noreferrer" download>
                        <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground p-1.5 sm:p-2">
                          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
            {resources.length === 0 && !loading && (
              <p className="text-center text-muted-foreground text-sm py-4">No resources available yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Result Dialog */}
      <Dialog open={resultDialog} onOpenChange={setResultDialog}>
        <DialogContent className="mx-4 max-w-md">
          <DialogHeader><DialogTitle className="text-base sm:text-lg">{editingResult ? "Edit Result" : "Add Result"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label className="text-xs sm:text-sm">Title *</Label><Input value={resultForm.title} onChange={e => setResultForm({ ...resultForm, title: e.target.value })} placeholder="e.g. First Term Results" className="text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-xs sm:text-sm">Description</Label><Textarea value={resultForm.description} onChange={e => setResultForm({ ...resultForm, description: e.target.value })} placeholder="Description" className="text-sm" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs sm:text-sm">Result Date</Label><Input value={resultForm.result_date} onChange={e => setResultForm({ ...resultForm, result_date: e.target.value })} placeholder="e.g. August 1, 2025" className="text-sm" /></div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Status</Label>
                <select value={resultForm.status} onChange={e => setResultForm({ ...resultForm, status: e.target.value as "upcoming" | "published" })} className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm">
                  <option value="upcoming">Upcoming</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <Button onClick={saveResult} className="w-full bg-primary text-primary-foreground text-sm">{editingResult ? "Update" : "Add"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resource Dialog */}
      <Dialog open={resourceDialog} onOpenChange={setResourceDialog}>
        <DialogContent className="mx-4 max-w-md">
          <DialogHeader><DialogTitle className="text-base sm:text-lg">{editingResource ? "Edit Resource" : "Add Resource"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label className="text-xs sm:text-sm">Title *</Label><Input value={resourceForm.title} onChange={e => setResourceForm({ ...resourceForm, title: e.target.value })} placeholder="e.g. Examination Guidelines 2025" className="text-sm" /></div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">File Type</Label>
              <select value={resourceForm.file_type} onChange={e => setResourceForm({ ...resourceForm, file_type: e.target.value })} className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm">
                <option value="PDF">PDF</option>
                <option value="ZIP">ZIP</option>
                <option value="DOC">DOC</option>
                <option value="DOCX">DOCX</option>
                <option value="XLS">XLS</option>
                <option value="XLSX">XLSX</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">File Size (e.g., 2.5 MB)</Label>
              <Input value={resourceForm.file_size} onChange={e => setResourceForm({ ...resourceForm, file_size: e.target.value })} placeholder="e.g., 2.5 MB" className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">File URL *</Label>
              <div className="flex gap-2">
                <Input value={resourceForm.file_url} onChange={e => setResourceForm({ ...resourceForm, file_url: e.target.value })} placeholder="File URL" className="text-sm flex-1" />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="text-sm">
                  <Upload className="w-4 h-4 mr-2" /> Upload
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      setResourceFile(e.target.files[0]);
                      setUploading(true);
                      const url = await uploadFile(e.target.files[0]);
                      setResourceForm({ ...resourceForm, file_url: url });
                      setUploading(false);
                    }
                  }}
                  className="hidden"
                />
              </div>
            </div>
            <Button onClick={saveResource} disabled={uploading} className="w-full bg-primary text-primary-foreground text-sm">
              {uploading ? "Uploading..." : editingResource ? "Update" : "Add"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Exam;