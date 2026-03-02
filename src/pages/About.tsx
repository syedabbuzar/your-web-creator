import Layout from "@/components/Layout";
import { Users, Target, Eye, Heart, Award, BookOpen, Plus, Pencil, Trash2, Shield, Crown, Globe, BookOpenCheck, PenTool } from "lucide-react";
import scholarEmblem from "@/assets/scholar-emblem.jpg";
import OptimizedImage from "@/components/OptimizedImage";
import { useAdmin } from "@/contexts/AdminContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
  const [editingLeader, setEditingLeader] = useState<any | null>(null);
  const [form, setForm] = useState({ name: "", role: "", image: "" });

  const fetchLeaders = async () => {
    const { data, error } = await supabase.from("leaders").select("*").order("sort_order");
    if (error) { toast.error("Failed to load leaders"); return; }
    setLeaders(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchLeaders(); }, []);

  const openAdd = () => {
    setEditingLeader(null);
    setForm({ name: "", role: "", image: "" });
    setDialogOpen(true);
  };

  const openEdit = (leader: any) => {
    setEditingLeader(leader);
    setForm({ name: leader.name, role: leader.role, image: leader.image });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.role) return toast.error("Name and Role are required");
    if (editingLeader) {
      const { error } = await supabase.from("leaders").update(form).eq("id", editingLeader.id);
      if (error) return toast.error("Failed to update");
      toast.success("Leader updated!");
    } else {
      const { error } = await supabase.from("leaders").insert({
        ...form,
        image: form.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
        sort_order: leaders.length + 1
      });
      if (error) return toast.error("Failed to add");
      toast.success("Leader added!");
    }
    setDialogOpen(false);
    fetchLeaders();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("leaders").delete().eq("id", id);
    if (error) return toast.error("Failed to delete");
    toast.success("Leader removed!");
    fetchLeaders();
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground animate-fade-in">About Us</h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up px-2" style={{ animationDelay: "0.1s" }}>
            Discover our journey, mission, and the values that guide Scholar Educational Campus
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-slide-in-left">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 sm:mb-6">Our History</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                The journey of Scholar Educational Campus began more than 15 years ago With the blessings of Allah (SWT) a sincere belief in the transformative power of education.              </p>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
             Over the years, the campus has grown through consistency, discipline, and the collective trust of students, parents, and teachers. What defines this institution is not only progress, but a shared culture of responsibility, respect, and purposeful learning.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
               At the center of this journey stands the united vision of Baig Sir and Baig Ma’am. Together, they have guided the institution with complementary roles — providing strength, direction, and a firm foundation of values. Their leadership is widely recognized within the school community for its clarity of purpose, thoughtful decision-making, and commitment to meaningful education.
                Through steady guidance and a long-term vision, they laid the groundwork upon which the institution continues to grow — supported by dedicated educators, inspired students, and a community that believes in its mission.
Today, the story of Scholar Educational Campus continues to evolve with humility and gratitude, carrying forward a legacy built on faith, unity, and service to education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Emblem Section */}
      <section className="py-10 sm:py-14 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <div className="flex justify-center animate-slide-in-left">
              <OptimizedImage src={scholarEmblem} alt="Scholar Educational Campus Emblem" className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain rounded-2xl shadow-xl" loading="eager" />
            </div>
            <div className="animate-slide-in-right">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 sm:mb-6">Our Emblem</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed italic">
                Our emblem is more than just a picture; it tells the story of how we care for your child.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-foreground">The Shield</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Just like a shield protects a soldier, we protect and care for your child's growing mind.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-foreground">The Lions</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">These represent strength and character. We teach children to be brave, respectful, and disciplined.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BookOpenCheck className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-foreground">The Open Books</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">This means learning is a joy. We want children to be curious and truly understand what they learn, not just memorize it.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-foreground">The Globe</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">We prepare our students to be successful anywhere in the world while staying connected to their roots.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PenTool className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-foreground">The Pen & Crown</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">The pen at the top shows that clear thinking and honest words are the keys to becoming a true leader.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VERITAS Section */}
      <section className="py-10 sm:py-14 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 animate-fade-in font-serif">VERITAS</h2>
          <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 md:mb-8 opacity-90 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>Our Motto: Truth</p>
          <div className="max-w-3xl mx-auto animate-fade-in-up px-2" style={{ animationDelay: "0.2s" }}>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed opacity-90 mb-4">
              At Scholar Educational Campus, "Veritas" means we are honest and sincere in everything we do—from how we teach to how we nurture your child.
            </p>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed opacity-90 font-semibold">
              We don't just prepare students for exams; we prepare them for life.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center mb-6 sm:mb-8 md:mb-12 animate-fade-in">Our Core Values</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {values.map((value, index) => (
              <div key={value.title} className="text-center p-3 sm:p-4 md:p-6 bg-card rounded-lg card-hover animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <value.icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary mx-auto mb-2 sm:mb-3 md:mb-4" />
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-foreground mb-1 sm:mb-2">{value.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-10 sm:py-14 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            <div className="bg-card p-4 sm:p-6 md:p-8 rounded-lg shadow-lg animate-slide-in-left">
              <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">Our Vision</h3>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                To be a globally recognized institution that nurtures future leaders, innovators, and responsible citizens who contribute positively to society.
              </p>
            </div>
            <div className="bg-card p-4 sm:p-6 md:p-8 rounded-lg shadow-lg animate-slide-in-right">
              <Target className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">Our Mission</h3>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                To provide holistic education that combines academic excellence with character development, encouraging curiosity, critical thinking, and creativity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center animate-fade-in">Our Leadership</h2>
            {isAdmin && (
              <Button onClick={openAdd} size="sm" className="bg-primary text-primary-foreground rounded-full text-xs sm:text-sm">
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" /> Add
              </Button>
            )}
          </div>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground text-center mb-6 sm:mb-8 md:mb-12 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Meet the dedicated team leading Scholar Educational Campus
          </p>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {leaders.map((leader, index) => (
              <div key={leader.id} className="text-center animate-fade-in-up relative group" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                {isAdmin && (
                  <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button onClick={() => openEdit(leader)} className="p-1 sm:p-1.5 bg-card rounded-full shadow-md hover:bg-secondary">
                      <Pencil className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    </button>
                    <button onClick={() => handleDelete(leader.id)} className="p-1 sm:p-1.5 bg-card rounded-full shadow-md hover:bg-destructive/10">
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" />
                    </button>
                  </div>
                )}
                <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto mb-2 sm:mb-3 md:mb-4 rounded-full overflow-hidden image-zoom border-2 sm:border-4 border-primary/20">
                  <OptimizedImage src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-foreground">{leader.name}</h3>
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{leader.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
            
      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="mx-4 max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">{editingLeader ? "Edit Leader" : "Add Leader"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter name" className="text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Role *</Label>
              <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Enter role" className="text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Image</Label>
              <div className="flex gap-2">
                <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL (optional)" className="text-sm flex-1" />
                <ImageUploadButton onUpload={(url) => setForm({ ...form, image: url })} label="Upload" />
              </div>
              {form.image && (
                <div className="w-16 h-16 rounded-full overflow-hidden border border-border mx-auto mt-2">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground text-sm">{editingLeader ? "Update" : "Add"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default About;
