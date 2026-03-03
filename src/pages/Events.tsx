import Layout from "@/components/Layout";
import { Calendar, Tag, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import OptimizedImage from "@/components/OptimizedImage";
import { Link } from "react-router-dom";

const Events = () => {
  const { isAdmin } = useAdmin();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    full_description: "",
    date: "",
    category: "",
    image: "",
  });

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get("/events");
      setEvents(response.data);
    } catch (error) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const openAdd = () => {
    setEditingEvent(null);
    setForm({
      title: "",
      description: "",
      full_description: "",
      date: "",
      category: "",
      image: "",
    });
    setDialogOpen(true);
  };

  const openEdit = (event: any) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      full_description: event.full_description,
      date: event.date,
      category: event.category,
      image: event.image,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.date || !form.category) {
      toast.error("Title, Date, and Category are required");
      return;
    }

    try {
      if (editingEvent) {
        await axiosInstance.put(`/events/${editingEvent._id}`, form);
        toast.success("Event updated!");
      } else {
        await axiosInstance.post("/events", form);
        toast.success("Event added!");
      }
      setDialogOpen(false);
      fetchEvents();
    } catch (error) {
      toast.error("Failed to save event");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/events/${id}`);
      toast.success("Event removed!");
      fetchEvents();
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Calendar className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground animate-fade-in">Our Events</h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up px-2" style={{ animationDelay: "0.1s" }}>
            Discover the exciting events happening at Scholar Educational Campus
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center animate-fade-in">Upcoming Events</h2>
            {isAdmin && (
              <Button onClick={openAdd} size="sm" className="bg-primary text-primary-foreground rounded-full text-xs sm:text-sm">
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" /> Add Event
              </Button>
            )}
          </div>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground text-center mb-6 sm:mb-8 md:mb-12 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Stay updated with our latest events and activities
          </p>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading events...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {events.map((event, index) => (
                <div key={event._id} className="bg-card rounded-lg shadow-lg overflow-hidden animate-fade-in-up relative group" style={{ animationDelay: `${index * 0.1}s` }}>
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button onClick={() => openEdit(event)} className="p-1.5 bg-card rounded-full shadow-md hover:bg-secondary">
                        <Pencil className="w-3.5 h-3.5 text-primary" />
                      </button>
                      <button onClick={() => handleDelete(event._id)} className="p-1.5 bg-card rounded-full shadow-md hover:bg-destructive/10">
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  )}
                  <div className="h-40 sm:h-48 overflow-hidden">
                    <OptimizedImage src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-[10px] sm:text-xs font-medium">
                        <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {event.category}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
                        <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {event.date}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground mb-1.5 sm:mb-2">{event.title}</h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                    <Link to={`/events/${event._id}`} className="mt-3 sm:mt-4 inline-block">
                      <Button variant="outline" className="text-[10px] sm:text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="mx-4 max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">{editingEvent ? "Edit Event" : "Add Event"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Short Description *</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description" className="text-sm" rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Full Description</Label>
              <Textarea value={form.full_description} onChange={(e) => setForm({ ...form, full_description: e.target.value })} placeholder="Full description" className="text-sm" rows={5} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Date *</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Category *</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Event category" className="text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Image URL</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="text-sm" />
            </div>
            <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground text-sm">{editingEvent ? "Update" : "Add"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Events;