import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Users, Target, Eye, Heart, Award, Plus, Pencil, Trash2, Shield, Crown, Globe, BookOpenCheck, PenTool } from "lucide-react";
import scholarEmblem from "@/assets/scholar-emblem.jpg";
import OptimizedImage from "@/components/OptimizedImage";
import { useAdmin } from "@/contexts/AdminContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import ImageUploadButton from "@/components/ImageUploadButton";

const values = [
  { icon: Target, title: "Truth", description: "We pursue knowledge with honesty and integrity in all our endeavors." },
  { icon: Eye, title: "Vision", description: "We envision a world where education transforms lives and communities." },
  { icon: Heart, title: "Compassion", description: "We care for every student's well-being and personal growth." },
  { icon: Award, title: "Excellence", description: "We strive for the highest standards in education and character." },
];

const About = () => {
  const { isAdmin } = useAdmin();
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState<any>(null);
  const [form, setForm] = useState({ name: "", role: "", image: "" });

  const fetchLeaders = async () => {
    try { const r = await axiosInstance.get("/leaders"); setLeaders(r.data || []); } catch { toast.error("Failed to load leaders"); } finally { setLoading(false); }
  };
  useEffect(() => { fetchLeaders(); }, []);

  const openAdd = () => { setEditingLeader(null); setForm({ name: "", role: "", image: "" }); setDialogOpen(true); };
  const openEdit = (l: any) => { setEditingLeader(l); setForm({ name: l.name, role: l.role, image: l.image || "" }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.name || !form.role) { toast.error("Name and Role required"); return; }
    try {
      if (editingLeader) { await axiosInstance.put(`/leaders/${editingLeader._id}`, form); toast.success("Updated!"); }
      else { await axiosInstance.post("/leaders", { ...form, image: form.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" }); toast.success("Added!"); }
      setDialogOpen(false); fetchLeaders();
    } catch { toast.error("Failed to save"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await axiosInstance.delete(`/leaders/${id}`); toast.success("Removed!"); fetchLeaders(); } catch { toast.error("Failed"); }
  };

  return (
    <Layout>
      <SEOHead title="About Us" description="Learn about Scholar Educational Campus Nanded - our history, vision, mission, core values, leadership team. Best school in Nanded since 2010." keywords="about scholar educational campus nanded, school history nanded, best school leadership nanded" path="/about" />
      <section className="py-10 sm:py-14 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4"><Users className="w-8 h-8 text-primary" /><h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">About Us</h1></div>
          <p className="text-sm sm:text-base text-muted-foreground">Discover our journey, mission, and the values that guide Scholar Educational Campus</p>
        </div>
      </section>

      <section className="py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl animate-fade-in-up">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-4 sm:mb-6">Our History</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">The journey of Scholar Educational Campus began more than 15 years ago with the blessings of Allah (SWT) and a sincere belief in the transformative power of education.</p>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">Over the years, the campus has grown through consistency, discipline, and the collective trust of students, parents, and teachers.</p>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">At the center of this journey stands the united vision of Baig Sir and Baig Ma'am.</p>
        </div>
      </section>

      <section className="py-10 sm:py-14 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center"><img src={scholarEmblem} alt="Scholar Emblem" className="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 object-contain rounded-lg shadow-lg" /></div>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-4 sm:mb-6">Our Emblem</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">Our emblem is more than just a picture; it tells the story of how we care for your child.</p>
              <div className="space-y-4">
                {[{icon:Shield,t:"The Shield",d:"Just like a shield protects a soldier, we protect and care for your child's growing mind."},{icon:Crown,t:"The Lions",d:"These represent strength and character. We teach children to be brave, respectful, and disciplined."},{icon:BookOpenCheck,t:"The Open Books",d:"This means learning is a joy. We want children to be curious and truly understand what they learn."},{icon:Globe,t:"The Globe",d:"We prepare our students to be successful anywhere in the world while staying connected to their roots."},{icon:PenTool,t:"The Pen & Crown",d:"The pen at the top shows that clear thinking and honest words are the keys to becoming a true leader."}].map(({icon:Icon,t,d})=>(
                  <div key={t} className="flex items-start gap-3"><Icon className="w-5 h-5 text-primary mt-1 flex-shrink-0" /><div><h3 className="font-semibold text-foreground text-sm sm:text-base">{t}</h3><p className="text-xs sm:text-sm text-muted-foreground">{d}</p></div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">VERITAS</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6">Our Motto: Truth</p>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">At Scholar Educational Campus, "Veritas" means we are honest and sincere in everything we do—from how we teach to how we nurture your child.</p>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">We don't just prepare students for exams; we prepare them for life.</p>
        </div>
      </section>

      <section className="py-10 sm:py-14 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary text-center mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((v,i)=>(<div key={v.title} className="bg-card rounded-lg p-6 text-center card-hover animate-fade-in-up" style={{animationDelay:`${i*0.1}s`}}><v.icon className="w-10 h-10 text-primary mx-auto mb-4" /><h3 className="font-bold text-foreground text-base sm:text-lg mb-2">{v.title}</h3><p className="text-xs sm:text-sm text-muted-foreground">{v.description}</p></div>))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="bg-card rounded-lg p-6 sm:p-8 card-hover animate-fade-in-up"><Eye className="w-8 h-8 text-primary mb-4" /><h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">Our Vision</h3><p className="text-sm sm:text-base text-muted-foreground leading-relaxed">To be a globally recognized institution that nurtures future leaders, innovators, and responsible citizens.</p></div>
            <div className="bg-card rounded-lg p-6 sm:p-8 card-hover animate-fade-in-up" style={{animationDelay:"0.1s"}}><Target className="w-8 h-8 text-primary mb-4" /><h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">Our Mission</h3><p className="text-sm sm:text-base text-muted-foreground leading-relaxed">To provide holistic education that combines academic excellence with character development.</p></div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">Our Leadership</h2>
            {isAdmin && <Button size="sm" onClick={openAdd} className="ml-2"><Plus className="w-4 h-4 mr-1" /> Add</Button>}
          </div>
          <p className="text-sm sm:text-base text-muted-foreground text-center mb-8">Meet the dedicated team leading Scholar Educational Campus</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {leaders.map((l:any,i)=>(<div key={l._id||i} className="bg-card rounded-lg overflow-hidden card-hover animate-fade-in-up relative group" style={{animationDelay:`${i*0.1}s`}}>
              {isAdmin && <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={()=>openEdit(l)} className="p-1.5 bg-card rounded-full shadow-md hover:bg-secondary"><Pencil className="w-3 h-3" /></button><button onClick={()=>handleDelete(l._id)} className="p-1.5 bg-card rounded-full shadow-md hover:bg-destructive/10"><Trash2 className="w-3 h-3" /></button></div>}
              <div className="aspect-square overflow-hidden flex items-center justify-center p-4"><OptimizedImage src={l.image} alt={l.name} className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-primary/20" /></div>
              <div className="p-4 text-center"><h3 className="font-bold text-foreground text-sm sm:text-base">{l.name}</h3><p className="text-xs sm:text-sm text-muted-foreground">{l.role}</p></div>
            </div>))}
          </div>
        </div>
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle>{editingLeader ? "Edit Leader" : "Add Leader"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name *</Label><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Enter name" /></div>
            <div><Label>Role *</Label><Input value={form.role} onChange={e=>setForm({...form,role:e.target.value})} placeholder="Enter role" /></div>
            <div><Label>Image</Label><div className="flex gap-2"><Input value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="Image URL" className="flex-1" /><ImageUploadButton onUpload={url=>setForm({...form,image:url})} label="Upload" /></div></div>
            <Button onClick={handleSave} className="w-full">{editingLeader?"Update":"Add"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};
export default About;