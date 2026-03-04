import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { FileText, Calendar, Download, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

interface ExamSchedule { _id: string; exam: string; classes: string; start_date: string; end_date: string; }
interface Result { _id: string; title: string; description: string; status: string; result_date: string; }
interface Resource { _id: string; title: string; file_type: string; file_size: string; file_url: string; }

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

  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ExamSchedule | null>(null);
  const [scheduleForm, setScheduleForm] = useState({ exam: "", classes: "", start_date: "", end_date: "" });

  const [resultDialog, setResultDialog] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [resultForm, setResultForm] = useState({ title: "", description: "", status: "upcoming", result_date: "" });

  const [resourceDialog, setResourceDialog] = useState(false);
  const [resourceForm, setResourceForm] = useState({ title: "", file_type: "", file_size: "", file_url: "" });

  const fetchData = async () => {
    try {
      const [schedRes, resultRes, resRes] = await Promise.all([
        axiosInstance.get("/exam-schedules").catch(() => ({ data: [] })),
        axiosInstance.get("/exam/results").catch(() => ({ data: [] })),
        axiosInstance.get("/exam/resources").catch(() => ({ data: [] })),
      ]);
      setExamSchedule(schedRes.data || []);
      setResults(resultRes.data || []);
      setResources(resRes.data || []);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // Schedule CRUD
  const saveSchedule = async () => {
    if (!scheduleForm.exam || !scheduleForm.classes) { toast.error("Fill required fields"); return; }
    try {
      if (editingSchedule) { await axiosInstance.put(`/exam-schedules/${editingSchedule._id}`, scheduleForm); toast.success("Updated"); }
      else { await axiosInstance.post("/exam-schedules", scheduleForm); toast.success("Added"); }
      setScheduleDialog(false); fetchData();
    } catch (err: any) { toast.error(err.response?.data?.message || "Failed"); }
  };
  const deleteSchedule = async (id: string) => { if (!confirm("Delete?")) return; try { await axiosInstance.delete(`/exam-schedules/${id}`); toast.success("Deleted"); fetchData(); } catch { toast.error("Failed"); } };

  // Result CRUD
  const saveResult = async () => {
    if (!resultForm.title) { toast.error("Title required"); return; }
    try {
      if (editingResult) { await axiosInstance.put(`/exam/results/${editingResult._id}`, resultForm); toast.success("Updated"); }
      else { await axiosInstance.post("/exam/results", resultForm); toast.success("Added"); }
      setResultDialog(false); fetchData();
    } catch (err: any) { toast.error(err.response?.data?.message || "Failed"); }
  };
  const deleteResult = async (id: string) => { if (!confirm("Delete?")) return; try { await axiosInstance.delete(`/exam/results/${id}`); toast.success("Deleted"); fetchData(); } catch { toast.error("Failed"); } };

  // Resource CRUD
  const saveResource = async () => {
    if (!resourceForm.title || !resourceForm.file_url) { toast.error("Title and URL required"); return; }
    try { await axiosInstance.post("/exam/resources", resourceForm); toast.success("Added"); setResourceDialog(false); fetchData(); }
    catch (err: any) { toast.error(err.response?.data?.message || "Failed"); }
  };
  const deleteResource = async (id: string) => { if (!confirm("Delete?")) return; try { await axiosInstance.delete(`/exam/resources/${id}`); toast.success("Deleted"); fetchData(); } catch { toast.error("Failed"); } };

  return (
    <Layout>
      <SEOHead title="Exam Portal" description="Scholar Educational Campus Nanded exam portal - exam schedules, results, study resources and downloads for all classes." keywords="exam schedule nanded school, school exam results nanded, scholar campus exam" path="/exam" />
      <section className="py-10 sm:py-14 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Exam Portal</h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">Access exam schedules, results, and study resources</p>
        </div>
      </section>

      {/* Exam Schedule */}
      <section className="py-10 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2"><Calendar className="w-5 h-5" /> Exam Schedule</h2>
            {isAdmin && <Button size="sm" onClick={() => { setEditingSchedule(null); setScheduleForm({ exam: "", classes: "", start_date: "", end_date: "" }); setScheduleDialog(true); }}><Plus className="w-4 h-4 mr-1" />Add</Button>}
          </div>
          {examSchedule.length === 0 ? <p className="text-muted-foreground text-center py-8">No exam schedules</p> : (
            <div className="overflow-x-auto"><table className="w-full bg-card rounded-lg overflow-hidden shadow-md text-sm">
              <thead><tr className="bg-primary text-primary-foreground"><th className="p-3 text-left">Exam</th><th className="p-3 text-left">Classes</th><th className="p-3 text-left">Start</th><th className="p-3 text-left">End</th>{isAdmin && <th className="p-3">Actions</th>}</tr></thead>
              <tbody>{examSchedule.map(s => (
                <tr key={s._id} className="border-b border-border hover:bg-secondary/30">
                  <td className="p-3">{s.exam}</td><td className="p-3">{s.classes}</td><td className="p-3">{s.start_date}</td><td className="p-3">{s.end_date}</td>
                  {isAdmin && <td className="p-3 text-center"><div className="flex gap-1 justify-center">
                    <Button size="sm" variant="ghost" onClick={() => { setEditingSchedule(s); setScheduleForm(s); setScheduleDialog(true); }}><Pencil className="w-3 h-3" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteSchedule(s._id)}><Trash2 className="w-3 h-3" /></Button>
                  </div></td>}
                </tr>
              ))}</tbody>
            </table></div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-primary">Exam Results</h2>
            {isAdmin && <Button size="sm" onClick={() => { setEditingResult(null); setResultForm({ title: "", description: "", status: "upcoming", result_date: "" }); setResultDialog(true); }}><Plus className="w-4 h-4 mr-1" />Add</Button>}
          </div>
          {results.length === 0 ? <p className="text-muted-foreground text-center py-8">No results</p> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map(r => (
                <div key={r._id} className="bg-card rounded-lg p-4 shadow-md relative group">
                  <h3 className="font-bold text-foreground">{r.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">Status: {r.status} | Date: {r.result_date}</p>
                  {isAdmin && <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="ghost" onClick={() => { setEditingResult(r); setResultForm(r); setResultDialog(true); }}><Pencil className="w-3 h-3" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteResult(r._id)}><Trash2 className="w-3 h-3" /></Button>
                  </div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Resources */}
      <section className="py-10 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2"><Download className="w-5 h-5" /> Study Resources</h2>
            {isAdmin && <Button size="sm" onClick={() => { setResourceForm({ title: "", file_type: "", file_size: "", file_url: "" }); setResourceDialog(true); }}><Plus className="w-4 h-4 mr-1" />Add</Button>}
          </div>
          {resources.length === 0 ? <p className="text-muted-foreground text-center py-8">No resources</p> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map(r => (
                <div key={r._id} className="bg-card rounded-lg p-4 shadow-md flex items-center justify-between group relative">
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{r.title}</h3>
                    <p className="text-xs text-muted-foreground">{r.file_type} • {r.file_size}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={r.file_url} target="_blank" rel="noopener noreferrer"><Button size="sm" variant="outline"><Download className="w-3 h-3" /></Button></a>
                    {isAdmin && <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteResource(r._id)}><Trash2 className="w-3 h-3" /></Button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Guidelines */}
      <section className="py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-xl font-bold text-primary mb-6">Exam Guidelines</h2>
          <ul className="space-y-3">{guidelines.map((g, i) => <li key={i} className="flex items-start gap-3 text-sm text-foreground/80"><span className="text-primary font-bold">{i + 1}.</span>{g}</li>)}</ul>
        </div>
      </section>

      {/* Dialogs */}
      <Dialog open={scheduleDialog} onOpenChange={setScheduleDialog}>
        <DialogContent><DialogHeader><DialogTitle>{editingSchedule ? "Edit" : "Add"} Schedule</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Exam *</Label><Input value={scheduleForm.exam} onChange={e => setScheduleForm({...scheduleForm, exam: e.target.value})} /></div>
            <div><Label>Classes *</Label><Input value={scheduleForm.classes} onChange={e => setScheduleForm({...scheduleForm, classes: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Start Date</Label><Input value={scheduleForm.start_date} onChange={e => setScheduleForm({...scheduleForm, start_date: e.target.value})} /></div>
              <div><Label>End Date</Label><Input value={scheduleForm.end_date} onChange={e => setScheduleForm({...scheduleForm, end_date: e.target.value})} /></div>
            </div>
            <div className="flex gap-2 justify-end"><Button variant="outline" onClick={() => setScheduleDialog(false)}>Cancel</Button><Button onClick={saveSchedule}>Save</Button></div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={resultDialog} onOpenChange={setResultDialog}>
        <DialogContent><DialogHeader><DialogTitle>{editingResult ? "Edit" : "Add"} Result</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title *</Label><Input value={resultForm.title} onChange={e => setResultForm({...resultForm, title: e.target.value})} /></div>
            <div><Label>Description</Label><Textarea value={resultForm.description} onChange={e => setResultForm({...resultForm, description: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Status</Label><Input value={resultForm.status} onChange={e => setResultForm({...resultForm, status: e.target.value})} /></div>
              <div><Label>Result Date</Label><Input value={resultForm.result_date} onChange={e => setResultForm({...resultForm, result_date: e.target.value})} /></div>
            </div>
            <div className="flex gap-2 justify-end"><Button variant="outline" onClick={() => setResultDialog(false)}>Cancel</Button><Button onClick={saveResult}>Save</Button></div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={resourceDialog} onOpenChange={setResourceDialog}>
        <DialogContent><DialogHeader><DialogTitle>Add Resource</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title *</Label><Input value={resourceForm.title} onChange={e => setResourceForm({...resourceForm, title: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>File Type</Label><Input value={resourceForm.file_type} onChange={e => setResourceForm({...resourceForm, file_type: e.target.value})} placeholder="PDF" /></div>
              <div><Label>File Size</Label><Input value={resourceForm.file_size} onChange={e => setResourceForm({...resourceForm, file_size: e.target.value})} placeholder="2.5 MB" /></div>
            </div>
            <div><Label>File URL *</Label><Input value={resourceForm.file_url} onChange={e => setResourceForm({...resourceForm, file_url: e.target.value})} /></div>
            <div className="flex gap-2 justify-end"><Button variant="outline" onClick={() => setResourceDialog(false)}>Cancel</Button><Button onClick={saveResource}>Add</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Exam;
