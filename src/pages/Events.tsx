import Layout from "@/components/Layout";
import EventCard from "@/components/EventCard";
import { Calendar, Filter, Plus, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const defaultCategories = ["All", "Conference", "Cultural", "Workshop", "Academic", "Teachers Achievement", "Job Vacancy"];

const Events = () => {
  const { isAdmin } = useAdmin();
  const [categories, setCategories] = useState(defaultCategories);
  const [activeCategory, setActiveCategory] = useState("All");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [form, setForm] = useState({ title: "", description: "", full_description: "", date: "", image: "", category: "Conference" });

  // Category admin
  const [catDialog, setCatDialog] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("events").select("*").order("sort_order");
    if (error) { toast.error("Failed to load events"); return; }
    setEvents(data || []);
    setLoading(false);
    // Extract unique categories from events
    if (data) {
      const eventCats = [...new Set(data.map((e: any) => e.category))];
      const merged = [...new Set([...defaultCategories, ...eventCats])];
      setCategories(merged);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const filteredEvents = activeCategory === "All" ? events : events.filter((e) => e.category === activeCategory);

  const openAdd = () => {
    setEditingEvent(null);
    setForm({ title: "", description: "", full_description: "", date: "", image: "", category: "Conference" });
    setDialogOpen(true);
  };

  const openEdit = (event: any) => {
    setEditingEvent(event);
    setForm({ title: event.title, description: event.description, full_description: event.full_description || "", date: event.date, image: event.image, category: event.category });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.description || !form.date) return toast.error("Title, Description and Date are required");
    if (editingEvent) {
      const { error } = await supabase.from("events").update({
        title: form.title, description: form.description, full_description: form.full_description || null,
        date: form.date, image: form.image, category: form.category
      }).eq("id", editingEvent.id);
      if (error) return toast.error("Failed to update event");
      toast.success("Event updated!");
    } else {
      const { error } = await supabase.from("events").insert({
        title: form.title, description: form.description, full_description: form.full_description || null,
        date: form.date, image: form.image || "/Event1.jpg", category: form.category,
        sort_order: events.length + 1
      });
      if (error) return toast.error("Failed to add event");
      toast.success("Event added!");
    }
    setDialogOpen(false);
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) return toast.error("Failed to delete event");
    toast.success("Event removed!");
    fetchEvents();
  };

  const addCategory = () => {
    if (!newCategory.trim()) return toast.error("Category name required");
    if (categories.includes(newCategory.trim())) return toast.error("Category already exists");
    setCategories([...categories, newCategory.trim()]);
    setNewCategory("");
    toast.success("Category added!");
  };

  const removeCategory = (cat: string) => {
    if (defaultCategories.includes(cat)) return toast.error("Cannot remove default category");
    setCategories(categories.filter(c => c !== cat));
    if (activeCategory === cat) setActiveCategory("All");
    toast.success("Category removed!");
  };

  return (
    <Layout>
      <section className="py-10 sm:py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground animate-fade-in">Events</h1>
            </div>
            {isAdmin && (
              <Button onClick={openAdd} size="sm" className="bg-primary text-primary-foreground rounded-full text-xs sm:text-sm">
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" /> Add Event
              </Button>
            )}
          </div>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up px-2" style={{ animationDelay: "0.1s" }}>
            Stay updated with all the latest happenings at Scholar Educational Campus
          </p>
        </div>
      </section>

      <section className="py-4 sm:py-6 md:py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <span className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">Filter by Category</span>
            </div>
            {isAdmin && (
              <Button onClick={() => setCatDialog(true)} variant="outline" size="sm" className="text-xs rounded-full">
                <Plus className="w-3 h-3 mr-1" /> Manage Categories
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300",
                  activeCategory === category ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-primary/20"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12"><p className="text-muted-foreground">Loading events...</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {filteredEvents.map((event, index) => (
                <div key={event.id} className="relative group animate-fade-in-up opacity-0" style={{ animationDelay: `${0.15 + index * 0.15}s`, animationFillMode: "forwards" }}>
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button onClick={() => openEdit(event)} className="p-1 sm:p-1.5 bg-card rounded-full shadow-md hover:bg-secondary"><Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" /></button>
                      <button onClick={() => handleDelete(event.id)} className="p-1 sm:p-1.5 bg-card rounded-full shadow-md hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-destructive" /></button>
                    </div>
                  )}
                  <EventCard id={event.id} title={event.title} description={event.description} date={event.date} image={event.image} className="hover-scale" />
                </div>
              ))}
            </div>
          )}
          {!loading && filteredEvents.length === 0 && (
            <div className="text-center py-8 sm:py-12"><p className="text-sm sm:text-base md:text-lg text-muted-foreground">No events found in this category.</p></div>
          )}
        </div>
      </section>

      {/* Event Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="mx-4 max-w-md sm:max-w-lg">
          <DialogHeader><DialogTitle className="text-base sm:text-lg">{editingEvent ? "Edit Event" : "Add Event"}</DialogTitle></DialogHeader>
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2"><Label className="text-xs sm:text-sm">Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" className="text-sm" /></div>
            <div className="space-y-1.5 sm:space-y-2"><Label className="text-xs sm:text-sm">Description *</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Event description" className="text-sm" /></div>
            <div className="space-y-1.5 sm:space-y-2"><Label className="text-xs sm:text-sm">Full Description</Label><Textarea value={form.full_description} onChange={(e) => setForm({ ...form, full_description: e.target.value })} placeholder="Detailed description (optional)" className="text-sm" rows={4} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2"><Label className="text-xs sm:text-sm">Date *</Label><Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g., March 15, 2025" className="text-sm" /></div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm">Category</Label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm">
                  {categories.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2"><Label className="text-xs sm:text-sm">Image URL</Label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL (optional)" className="text-sm" /></div>
            <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground text-sm">{editingEvent ? "Update" : "Add"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category Management Dialog */}
      <Dialog open={catDialog} onOpenChange={setCatDialog}>
        <DialogContent className="mx-4 max-w-sm">
          <DialogHeader><DialogTitle className="text-base sm:text-lg">Manage Categories</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New category name" className="text-sm" />
              <Button onClick={addCategory} size="sm" className="bg-primary text-primary-foreground"><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="space-y-2">
              {categories.filter(c => c !== "All").map(cat => (
                <div key={cat} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                  <span className="text-sm text-foreground">{cat}</span>
                  {!defaultCategories.includes(cat) && (
                    <button onClick={() => removeCategory(cat)} className="p-1 hover:bg-destructive/10 rounded"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Events;
