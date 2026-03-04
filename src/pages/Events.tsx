import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Calendar, Tag, Plus, Pencil, Trash2, ImagePlus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
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

const EventCardImageCarousel = ({ images, title }: { images: string[]; title: string }) => {
  const [idx, setIdx] = useState(0);
  const prev = useCallback((e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setIdx(p => (p - 1 + images.length) % images.length); }, [images.length]);
  const next = useCallback((e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setIdx(p => (p + 1) % images.length); }, [images.length]);
  return (
    <div className="aspect-video overflow-hidden relative">
      <OptimizedImage src={images[idx] || ""} alt={title} className="w-full h-full object-cover" />
      {images.length > 1 && (<>
        <button onClick={prev} className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition"><ChevronLeft className="w-3 h-3 text-white" /></button>
        <button onClick={next} className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition"><ChevronRight className="w-3 h-3 text-white" /></button>
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">{images.map((_, i) => (<button key={i} onClick={e => { e.preventDefault(); e.stopPropagation(); setIdx(i); }} className={`w-1.5 h-1.5 rounded-full transition ${i === idx ? "bg-white" : "bg-white/40"}`} />))}</div>
      </>)}
    </div>
  );
};

const Events = () => {
  const { isAdmin } = useAdmin();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", full_description: "", date: "", category: "", image: "", images: [] as string[] });
  const [newImageUrl, setNewImageUrl] = useState("");

  const fetchEvents = async () => { try { const r = await axiosInstance.get("/events"); setEvents(r.data || []); } catch { toast.error("Failed to load events"); } finally { setLoading(false); } };
  useEffect(() => { fetchEvents(); }, []);

  const openAdd = () => {
    setEditingEvent(null);
    setForm({ title: "", description: "", full_description: "", date: "", category: "", image: "", images: [] });
    setNewImageUrl("");
    setDialogOpen(true);
  };
  const openEdit = (e: any) => {
    setEditingEvent(e);
    setForm({
      title: e.title || "", description: e.description || "", full_description: e.full_description || "",
      date: e.date || "", category: e.category || "", image: e.image || "",
      images: Array.isArray(e.images) ? e.images : (e.image ? [e.image] : []),
    });
    setNewImageUrl("");
    setDialogOpen(true);
  };

  const addImageToList = () => {
    if (!newImageUrl.trim()) return;
    setForm({ ...form, images: [...form.images, newImageUrl.trim()] });
    setNewImageUrl("");
  };

  const removeImage = (idx: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  const handleSave = async () => {
    if (!form.title || !form.date || !form.category) { toast.error("Title, Date, Category required"); return; }
    const payload = {
      title: form.title,
      description: form.description,
      full_description: form.full_description,
      date: form.date,
      category: form.category,
      image: form.images[0] || form.image || "",
      images: form.images,
    };
    try {
      if (editingEvent) { await axiosInstance.put(`/events/${editingEvent._id}`, payload); toast.success("Updated!"); }
      else { await axiosInstance.post("/events", payload); toast.success("Added!"); }
      setDialogOpen(false); fetchEvents();
    } catch { toast.error("Failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await axiosInstance.delete(`/events/${id}`); toast.success("Removed!"); fetchEvents(); } catch { toast.error("Failed"); }
  };

  const getEventImages = (ev: any): string[] => {
    if (Array.isArray(ev.images) && ev.images.length > 0) return ev.images;
    if (ev.image) return [ev.image];
    return [];
  };

  return (<Layout>
    <SEOHead title="Events & Activities" description="Latest events, activities and news at Scholar Educational Campus Nanded. Stay updated with school functions, competitions, and celebrations." keywords="scholar campus events nanded, school events nanded, school activities nanded" path="/events" />
    <section className="py-10 sm:py-14 md:py-20 bg-secondary/30"><div className="container mx-auto px-4 text-center"><div className="flex items-center justify-center gap-3 mb-4"><Calendar className="w-8 h-8 text-primary" /><h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Our Events</h1></div><p className="text-sm sm:text-base text-muted-foreground">Discover the exciting events happening at Scholar Educational Campus</p></div></section>

    <section className="py-10 sm:py-14 md:py-20"><div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-2"><h2 className="text-xl sm:text-2xl font-bold text-primary">Upcoming Events</h2>{isAdmin && <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4 mr-1" />Add Event</Button>}</div>
      <p className="text-sm text-muted-foreground mb-8">Stay updated with our latest events and activities</p>
      {loading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {events.map((ev: any, i) => {
            const imgs = getEventImages(ev);
            return (
              <div key={ev._id || i} className="bg-card rounded-lg overflow-hidden shadow-md card-hover animate-fade-in-up relative group" style={{ animationDelay: `${i * 0.1}s` }}>
                {isAdmin && <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => openEdit(ev)} className="p-1.5 bg-card rounded-full shadow-md hover:bg-secondary"><Pencil className="w-3 h-3" /></button><button onClick={() => handleDelete(ev._id)} className="p-1.5 bg-card rounded-full shadow-md hover:bg-destructive/10"><Trash2 className="w-3 h-3" /></button></div>}
                <EventCardImageCarousel images={imgs} title={ev.title} />
                <div className="p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Tag className="w-3 h-3" />{ev.category}</span><span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{ev.date}</span></div>
                  <h3 className="font-bold text-foreground text-sm sm:text-base mb-2">{ev.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{ev.description}</p>
                  <div className="mt-3"><Link to={`/event/${ev._id}`}><Button variant="outline" size="sm" className="text-xs">View Details</Button></Link></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div></section>

    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{editingEvent ? "Edit" : "Add"} Event</DialogTitle></DialogHeader><div className="space-y-3">
      <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Event title" /></div>
      <div><Label>Short Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short description" rows={3} /></div>
      <div><Label>Full Description</Label><Textarea value={form.full_description} onChange={e => setForm({ ...form, full_description: e.target.value })} placeholder="Full description" rows={5} /></div>
      <div className="grid grid-cols-2 gap-3"><div><Label>Date *</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div><div><Label>Category *</Label><Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category" /></div></div>
      
      {/* Multiple Images */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1"><ImagePlus className="w-4 h-4" /> Event Images</Label>
        <div className="flex gap-2">
          <Input value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} placeholder="Paste image URL" className="flex-1" onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addImageToList(); } }} />
          <Button type="button" variant="outline" size="sm" onClick={addImageToList}>Add</Button>
        </div>
        {form.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {form.images.map((img, idx) => (
              <div key={idx} className="relative group/img">
                <img src={img} alt={`Event ${idx + 1}`} className="w-full h-20 object-cover rounded border" onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                <button onClick={() => removeImage(idx)} className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover/img:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        )}
        {form.images.length === 0 && <p className="text-xs text-muted-foreground">No images added yet. Add at least one image URL.</p>}
      </div>

      <Button onClick={handleSave} className="w-full">{editingEvent ? "Update" : "Add"}</Button>
    </div></DialogContent></Dialog>
  </Layout>);
};
export default Events;
