import Layout from "@/components/Layout";
import EventCard from "@/components/EventCard";
import { Calendar, Filter, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { defaultEvents, type EventItem } from "@/data/events";

const categories = ["All", "Conference", "Cultural", "Workshop", "Academic"];

const Events = () => {
  const { isAdmin } = useAdmin();
  const [activeCategory, setActiveCategory] = useState("All");
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem("scholar_events");
    return saved ? JSON.parse(saved) : defaultEvents;
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", image: "", category: "Conference" });

  const saveEvents = (updated: EventItem[]) => {
    setEvents(updated);
    localStorage.setItem("scholar_events", JSON.stringify(updated));
  };

  const filteredEvents = activeCategory === "All" ? events : events.filter((e) => e.category === activeCategory);

  const openAdd = () => {
    setEditingEvent(null);
    setForm({ title: "", description: "", date: "", image: "", category: "Conference" });
    setDialogOpen(true);
  };

  const openEdit = (event: EventItem) => {
    setEditingEvent(event);
    setForm({ title: event.title, description: event.description, date: event.date, image: event.image, category: event.category });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title || !form.description || !form.date) return toast.error("Title, Description and Date are required");
    if (editingEvent) {
      saveEvents(events.map((e) => (e.id === editingEvent.id ? { ...e, ...form } : e)));
      toast.success("Event updated!");
    } else {
      saveEvents([...events, { id: Date.now().toString(), ...form, image: form.image || defaultEvents[0].image }]);
      toast.success("Event added!");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    saveEvents(events.filter((e) => e.id !== id));
    toast.success("Event removed!");
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
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <span className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">Filter by Category</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="relative group animate-fade-in-up opacity-0"
                style={{ animationDelay: `${0.15 + index * 0.15}s`, animationFillMode: "forwards" }}
              >
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button onClick={() => openEdit(event)} className="p-1 sm:p-1.5 bg-card rounded-full shadow-md hover:bg-secondary">
                      <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="p-1 sm:p-1.5 bg-card rounded-full shadow-md hover:bg-destructive/10">
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-destructive" />
                    </button>
                  </div>
                )}
                <EventCard
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  date={event.date}
                  image={event.image}
                  className="hover-scale"
                />
              </div>
            ))}
          </div>
          {filteredEvents.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground">No events found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="mx-4 max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">{editingEvent ? "Edit Event" : "Add Event"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" className="text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Description *</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Event description" className="text-sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm">Date *</Label>
                <Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g., March 15, 2025" className="text-sm" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm">Category</Label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm">
                  {categories.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Image URL</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL (optional)" className="text-sm" />
            </div>
            <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground text-sm">{editingEvent ? "Update" : "Add"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Events;
