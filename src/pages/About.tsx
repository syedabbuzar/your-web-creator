import Layout from "@/components/Layout";
import { Users, Target, Eye, Heart, Award, BookOpen, Plus, Pencil, Trash2 } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const values = [
  { icon: Target, title: "Truth", description: "We pursue knowledge with honesty and integrity in all our endeavors." },
  { icon: Eye, title: "Vision", description: "We envision a world where education transforms lives and communities." },
  { icon: Heart, title: "Compassion", description: "We care for every student's well-being and personal growth." },
  { icon: Award, title: "Excellence", description: "We strive for the highest standards in education and character." },
];

interface Leader {
  id: string;
  name: string;
  role: string;
  image: string;
}

const defaultLeaders: Leader[] = [
  { id: "1", name: "Dr. Rajesh Kumar", role: "Principal", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" },
  { id: "2", name: "Mrs. Priya Sharma", role: "Vice Principal", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop" },
  { id: "3", name: "Mr. Amit Verma", role: "Academic Director", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop" },
  { id: "4", name: "Mrs. Sunita Patel", role: "Administrative Head", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop" },
];

const About = () => {
  const { isAdmin } = useAdmin();
  const [leaders, setLeaders] = useState<Leader[]>(() => {
    const saved = localStorage.getItem("scholar_leaders");
    return saved ? JSON.parse(saved) : defaultLeaders;
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [form, setForm] = useState({ name: "", role: "", image: "" });

  const saveLeaders = (updated: Leader[]) => {
    setLeaders(updated);
    localStorage.setItem("scholar_leaders", JSON.stringify(updated));
  };

  const openAdd = () => {
    setEditingLeader(null);
    setForm({ name: "", role: "", image: "" });
    setDialogOpen(true);
  };

  const openEdit = (leader: Leader) => {
    setEditingLeader(leader);
    setForm({ name: leader.name, role: leader.role, image: leader.image });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.role) return toast.error("Name and Role are required");
    if (editingLeader) {
      saveLeaders(leaders.map((l) => (l.id === editingLeader.id ? { ...l, ...form } : l)));
      toast.success("Leader updated!");
    } else {
      saveLeaders([...leaders, { id: Date.now().toString(), ...form, image: form.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" }]);
      toast.success("Leader added!");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    saveLeaders(leaders.filter((l) => l.id !== id));
    toast.success("Leader removed!");
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground animate-fade-in">About Us</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Discover our journey, mission, and the values that guide Scholar Educational Campus
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-3xl font-bold text-foreground mb-6">Our History</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Founded in 1998, Scholar Educational Campus has been a beacon of educational excellence for over 25 years.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Our journey began with a simple belief: every child deserves access to world-class education that nurtures both academic excellence and character development.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Over the years, we have produced thousands of successful alumni who are making their mark in various fields across the globe.
              </p>
            </div>
            <div className="animate-slide-in-right">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop" alt="School Building" className="rounded-lg shadow-xl" />
                <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
                  <p className="text-4xl font-bold">25+</p>
                  <p className="text-sm opacity-90">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VERITAS Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in font-serif">VERITAS</h2>
          <p className="text-xl mb-8 opacity-90 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>Truth • Knowledge • Excellence</p>
          <div className="max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <p className="text-lg leading-relaxed opacity-90">
              VERITAS, Latin for "Truth," is the cornerstone of our educational philosophy. We believe that the pursuit of truth through knowledge leads to excellence in all aspects of life.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12 animate-fade-in">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={value.title} className="text-center p-6 bg-card rounded-lg card-hover animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <value.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-card p-8 rounded-lg shadow-lg animate-slide-in-left">
              <BookOpen className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be a globally recognized institution that nurtures future leaders, innovators, and responsible citizens who contribute positively to society.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-lg animate-slide-in-right">
              <Target className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide holistic education that combines academic excellence with character development, encouraging curiosity, critical thinking, and creativity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-3xl font-bold text-foreground text-center animate-fade-in">Our Leadership</h2>
            {isAdmin && (
              <Button onClick={openAdd} size="sm" className="bg-primary text-primary-foreground rounded-full">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            )}
          </div>
          <p className="text-muted-foreground text-center mb-12 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Meet the dedicated team leading Scholar Educational Campus
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leaders.map((leader, index) => (
              <div key={leader.id} className="text-center animate-fade-in-up relative group" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                {isAdmin && (
                  <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button onClick={() => openEdit(leader)} className="p-1.5 bg-card rounded-full shadow-md hover:bg-secondary">
                      <Pencil className="w-4 h-4 text-primary" />
                    </button>
                    <button onClick={() => handleDelete(leader.id)} className="p-1.5 bg-card rounded-full shadow-md hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                )}
                <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden image-zoom border-4 border-primary/20">
                  <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{leader.name}</h3>
                <p className="text-sm text-muted-foreground">{leader.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLeader ? "Edit Leader" : "Add Leader"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter name" />
            </div>
            <div className="space-y-2">
              <Label>Role *</Label>
              <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Enter role" />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Enter image URL (optional)" />
            </div>
            <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground">{editingLeader ? "Update" : "Add"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default About;
