import Layout from "@/components/Layout";
import { FileText, Calendar, Download, Clock, BookOpen, AlertCircle, Plus, Pencil, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [resourceForm, setResourceForm] = useState({ title: "", file_type: "PDF", file_size: "" });
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const [schedRes, resRes, resourcesRes] = await Promise.all([
      supabase.from("exam_schedules").select("*").order("sort_order"),
      supabase.from("exam_results").select("*").order("sort_order"),
      supabase.from("exam_resources").select("*").order("sort_order"),
    ]);
    setExamSchedule(schedRes.data || []);
    setResults(resRes.data || []);
    setResources(resourcesRes.data || []);
    setLoading(false);
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
    if (!scheduleForm.exam || !scheduleForm.classes || !scheduleForm.start_date || !scheduleForm.end_date) return toast.error("All fields required");
    if (editingSchedule) {
      const { error } = await supabase.from("exam_schedules").update(scheduleForm).eq("id", editingSchedule.id);
      if (error) return toast.error("Update failed");
      toast.success("Schedule updated!");
    } else {
      const { error } = await supabase.from("exam_schedules").insert({ ...scheduleForm, sort_order: examSchedule.length + 1 });
      if (error) return toast.error("Add failed");
      toast.success("Schedule added!");
    }
    setScheduleDialog(false);
    fetchData();
  };
  const deleteSchedule = async (id: string) => {
    const { error } = await supabase.from("exam_schedules").delete().eq("id", id);
    if (error) return toast.error("Delete failed");
    toast.success("Schedule removed!");
    fetchData();
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
    if (!resultForm.title) return toast.error("Title required");
    if (editingResult) {
      const { error } = await supabase.from("exam_results").update({ ...resultForm, result_date: resultForm.result_date || null }).eq("id", editingResult.id);
      if (error) return toast.error("Update failed");
      toast.success("Result updated!");
    } else {
      const { error } = await supabase.from("exam_results").insert({ ...resultForm, result_date: resultForm.result_date || null, sort_order: results.length + 1 });
      if (error) return toast.error("Add failed");
      toast.success("Result added!");
    }
    setResultDialog(false);
    fetchData();
  };
  const deleteResult = async (id: string) => {
    const { error } = await supabase.from("exam_results").delete().eq("id", id);
    if (error) return toast.error("Delete failed");
    toast.success("Result removed!");
    fetchData();
  };

  // Resource CRUD
  const openAddResource = () => {
    setEditingResource(null);
    setResourceForm({ title: "", file_type: "PDF", file_size: "" });
    setResourceFile(null);
    setResourceDialog(true);
  };
  const openEditResource = (r: any) => {
    setEditingResource(r);
    setResourceForm({ title: r.title, file_type: r.file_type, file_size: r.file_size });
    setResourceFile(null);
    setResourceDialog(true);
  };

  const uploadFile = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const { error } = await supabase.storage.from("exam-resources").upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from("exam-resources").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const saveResource = async () => {
    if (!resourceForm.title) return toast.error("Title required");
    if (!editingResource && !resourceFile) return toast.error("Please select a file");
    setUploading(true);
    try {
      let file_url = editingResource?.file_url || "";
      let file_size = resourceForm.file_size;
      if (resourceFile) {
        file_url = await uploadFile(resourceFile);
        const sizeMB = (resourceFile.size / (1024 * 1024)).toFixed(1);
        file_size = `${sizeMB} MB`;
      }
      const payload = { title: resourceForm.title, file_type: resourceForm.file_type, file_size, file_url };
      if (editingResource) {
        const { error } = await supabase.from("exam_resources").update(payload).eq("id", editingResource.id);
        if (error) throw error;
        toast.success("Resource updated!");
      } else {
        const { error } = await supabase.from("exam_resources").insert({ ...payload, sort_order: resources.length + 1 });
        if (error) throw error;
        toast.success("Resource added!");
      }
      setResourceDialog(false);
      fetchData();
    } catch {
      toast.error("Failed to save resource");
    }
    setUploading(false);
  };

  const deleteResource = async (id: string) => {
    const { error } = await supabase.from("exam_resources").delete().eq("id", id);
    if (error) return toast.error("Delete failed");
    toast.success("Resource removed!");
    fetchData();
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
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Examination Schedule 2025-26</h2>
            </div>
            {isAdmin && (
              <Button onClick={openAddSchedule} size="sm" className="bg-primary text-primary-foreground rounded-full text-xs sm:text-sm">
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" /> Add
              </Button>
            )}
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full bg-card rounded-lg shadow-lg overflow-hidden">
                  <thead className="bg-primary text-primary-foreground">
                    <tr>
                      <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm">Examination</th>
                      <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm">Classes</th>
                      <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm">Start Date</th>
                      <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm">End Date</th>
                      {isAdmin && <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {examSchedule.map((exam, index) => (
                      <tr key={exam.id} className={`border-b border-border animate-fade-in-up ${index % 2 === 0 ? 'bg-card' : 'bg-secondary/30'}`} style={{ animationDelay: `${index * 0.1}s` }}>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-medium text-foreground text-xs sm:text-sm">{exam.exam}</td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-muted-foreground text-xs sm:text-sm">{exam.classes}</td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-muted-foreground text-xs sm:text-sm">{exam.start_date}</td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-muted-foreground text-xs sm:text-sm">{exam.end_date}</td>
                        {isAdmin && (
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                            <div className="flex gap-1">
                              <button onClick={() => openEditSchedule(exam)} className="p-1.5 hover:bg-secondary rounded"><Pencil className="w-3.5 h-3.5 text-primary" /></button>
                              <button onClick={() => deleteSchedule(exam.id)} className="p-1.5 hover:bg-destructive/10 rounded"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-3">
                {examSchedule.map((exam, index) => (
                  <div key={exam.id} className={`bg-card p-4 rounded-lg shadow animate-fade-in-up relative ${index % 2 === 0 ? '' : 'bg-secondary/30'}`} style={{ animationDelay: `${index * 0.1}s` }}>
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button onClick={() => openEditSchedule(exam)} className="p-1 bg-card rounded-full shadow-md hover:bg-secondary"><Pencil className="w-3 h-3 text-primary" /></button>
                        <button onClick={() => deleteSchedule(exam.id)} className="p-1 bg-card rounded-full shadow-md hover:bg-destructive/10"><Trash2 className="w-3 h-3 text-destructive" /></button>
                      </div>
                    )}
                    <h3 className="font-bold text-foreground text-sm mb-2 pr-16">{exam.exam}</h3>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <span className="text-muted-foreground">Classes:</span><span className="text-foreground">{exam.classes}</span>
                      <span className="text-muted-foreground">Start:</span><span className="text-foreground">{exam.start_date}</span>
                      <span className="text-muted-foreground">End:</span><span className="text-foreground">{exam.end_date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
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
            {results.map((result, index) => (
              <div key={result.id} className="bg-card p-4 sm:p-6 rounded-lg shadow-lg text-center animate-fade-in-up relative group" style={{ animationDelay: `${index * 0.1}s` }}>
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditResult(result)} className="p-1.5 bg-card rounded-full shadow-md hover:bg-secondary"><Pencil className="w-3.5 h-3.5 text-primary" /></button>
                    <button onClick={() => deleteResult(result.id)} className="p-1.5 bg-card rounded-full shadow-md hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                  </div>
                )}
                <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-3 animate-float" />
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{result.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">{result.description}</p>
                {result.result_date && <p className="text-xs text-primary font-medium">{result.result_date}</p>}
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${result.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {result.status === 'published' ? 'Published' : 'Upcoming'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guidelines & Resources Section */}
      <section className="py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            <div className="animate-slide-in-left">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Examination Guidelines</h2>
              </div>
              <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                {guidelines.map((guideline, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] sm:text-xs md:text-sm flex-shrink-0 mt-0.5">{index + 1}</span>
                    <span className="text-xs sm:text-sm md:text-base text-muted-foreground">{guideline}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="animate-slide-in-right">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Download className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Download Resources</h2>
                </div>
                {isAdmin && (
                  <Button onClick={openAddResource} size="sm" className="bg-primary text-primary-foreground rounded-full text-xs sm:text-sm">
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" /> Add
                  </Button>
                )}
              </div>
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                {resources.map((resource, index) => (
                  <div key={resource.id} className="flex items-center justify-between p-3 sm:p-4 bg-card rounded-lg shadow card-hover animate-fade-in-up relative group" style={{ animationDelay: `${index * 0.1}s` }}>
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
                          <button onClick={() => deleteResource(resource.id)} className="p-1.5 hover:bg-destructive/10 rounded"><Trash2 className="w-3 h-3 text-destructive" /></button>
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
                ))}
                {resources.length === 0 && !loading && (
                  <p className="text-center text-muted-foreground text-sm py-4">No resources available yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialog} onOpenChange={setScheduleDialog}>
        <DialogContent className="mx-4 max-w-md">
          <DialogHeader><DialogTitle className="text-base sm:text-lg">{editingSchedule ? "Edit Schedule" : "Add Schedule"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label className="text-xs sm:text-sm">Examination *</Label><Input value={scheduleForm.exam} onChange={e => setScheduleForm({ ...scheduleForm, exam: e.target.value })} placeholder="e.g. Mid-Term Examination" className="text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-xs sm:text-sm">Classes *</Label><Input value={scheduleForm.classes} onChange={e => setScheduleForm({ ...scheduleForm, classes: e.target.value })} placeholder="e.g. I - XII" className="text-sm" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs sm:text-sm">Start Date *</Label><Input value={scheduleForm.start_date} onChange={e => setScheduleForm({ ...scheduleForm, start_date: e.target.value })} placeholder="e.g. July 15, 2025" className="text-sm" /></div>
              <div className="space-y-1.5"><Label className="text-xs sm:text-sm">End Date *</Label><Input value={scheduleForm.end_date} onChange={e => setScheduleForm({ ...scheduleForm, end_date: e.target.value })} placeholder="e.g. July 25, 2025" className="text-sm" /></div>
            </div>
            <Button onClick={saveSchedule} className="w-full bg-primary text-primary-foreground text-sm">{editingSchedule ? "Update" : "Add"}</Button>
          </div>
        </DialogContent>
      </Dialog>

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
                <select value={resultForm.status} onChange={e => setResultForm({ ...resultForm, status: e.target.value })} className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm">
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
              <Label className="text-xs sm:text-sm">{editingResource ? "Replace File (optional)" : "Upload File *"}</Label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={e => setResourceFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full text-sm">
                <Upload className="w-4 h-4 mr-2" />
                {resourceFile ? resourceFile.name : "Choose File"}
              </Button>
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
