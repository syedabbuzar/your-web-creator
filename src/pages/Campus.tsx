import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Building, Plus, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import OptimizedImage from "@/components/OptimizedImage";
import ImageUploadButton from "@/components/ImageUploadButton";

const Campus = () => {
  const { isAdmin } = useAdmin();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<any>(null);
  const [galleryForm, setGalleryForm] = useState({ src: "", alt: "" });

  const fetchData = async () => { try { const r = await axiosInstance.get("/gallery"); setGallery(r.data || []); } catch { toast.error("Failed to load"); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, []);

  const openAddGallery = () => { setEditingGallery(null); setGalleryForm({ src: "", alt: "" }); setGalleryDialogOpen(true); };
  const openEditGallery = (g: any) => { setEditingGallery(g); setGalleryForm({ src: g.src, alt: g.alt }); setGalleryDialogOpen(true); };

  const handleSaveGallery = async () => {
    if (!galleryForm.src || !galleryForm.alt) { toast.error("Image URL and Title required"); return; }
    try {
      if (editingGallery) { await axiosInstance.delete(`/gallery/${editingGallery._id}`); await axiosInstance.post("/gallery", galleryForm); toast.success("Updated!"); }
      else { await axiosInstance.post("/gallery", galleryForm); toast.success("Added!"); }
      setGalleryDialogOpen(false); fetchData();
    } catch { toast.error("Failed"); }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await axiosInstance.delete(`/gallery/${id}`); toast.success("Removed!"); fetchData(); } catch { toast.error("Failed"); }
  };

  if (loading) return <Layout><section className="py-16"><div className="container mx-auto px-4 text-center"><p className="text-muted-foreground">Loading...</p></div></section></Layout>;

  return (<Layout>
    <SEOHead title="Our Campus & Facilities" description="Explore Scholar Educational Campus Nanded facilities - smart classrooms, library, playground, science lab. Virtual campus tour available." keywords="scholar campus facilities nanded, smart classroom nanded school, school campus tour nanded" path="/campus" />
    <section className="py-10 sm:py-14 md:py-20 bg-secondary/30"><div className="container mx-auto px-4 text-center"><div className="flex items-center justify-center gap-3 mb-4"><Building className="w-8 h-8 text-primary" /><h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Our Campus</h1></div><p className="text-sm sm:text-base text-muted-foreground">Explore our world-class facilities and beautiful campus</p></div></section>

    <section className="py-10 sm:py-14 md:py-20"><div className="container mx-auto px-4">
      <div className="flex items-center justify-center gap-3 mb-2"><h2 className="text-xl sm:text-2xl font-bold text-primary">Campus Gallery</h2>{isAdmin && <Button size="sm" onClick={openAddGallery} className="ml-2"><Plus className="w-4 h-4 mr-1" />Add</Button>}</div>
      <p className="text-sm text-muted-foreground text-center mb-8">Take a visual tour of our beautiful campus</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {gallery.map((img:any,i)=>(<div key={img._id||i} className="relative group rounded-lg overflow-hidden shadow-md cursor-pointer card-hover animate-fade-in-up" style={{animationDelay:`${i*0.1}s`}} onClick={()=>setSelectedImage(img.src)}>
          {isAdmin && <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={e=>{e.stopPropagation();openEditGallery(img)}} className="p-1 bg-card rounded-full shadow-md hover:bg-secondary"><Pencil className="w-3 h-3" /></button><button onClick={e=>{e.stopPropagation();handleDeleteGallery(img._id)}} className="p-1 bg-card rounded-full shadow-md hover:bg-destructive/10"><Trash2 className="w-3 h-3" /></button></div>}
          <OptimizedImage src={img.src} alt={img.alt} className="w-full h-48 sm:h-56 object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3"><p className="text-primary-foreground text-sm font-medium">{img.alt}</p></div>
        </div>))}
      </div>
    </div></section>

    <section className="py-10 sm:py-14 md:py-20 bg-secondary/30"><div className="container mx-auto px-4 text-center"><h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">Virtual Campus Tour</h2><div className="max-w-2xl mx-auto bg-card rounded-lg p-8 shadow-md"><Building className="w-12 h-12 text-primary mx-auto mb-4" /><p className="text-foreground font-medium">Virtual tour coming soon</p><p className="text-sm text-muted-foreground mt-1">Contact us to schedule an in-person visit</p></div></div></section>

    {selectedImage && <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={()=>setSelectedImage(null)}><img src={selectedImage} alt="Gallery" className="max-w-full max-h-[90vh] object-contain rounded-lg" /><button className="absolute top-4 right-4 text-white text-2xl" onClick={()=>setSelectedImage(null)}>✕</button></div>}

    <Dialog open={galleryDialogOpen} onOpenChange={setGalleryDialogOpen}><DialogContent className="max-w-sm"><DialogHeader><DialogTitle>{editingGallery?"Edit":"Add"} Image</DialogTitle></DialogHeader><div className="space-y-4">
      <div><Label>Image</Label><div className="flex gap-2"><Input value={galleryForm.src} onChange={e=>setGalleryForm({...galleryForm,src:e.target.value})} placeholder="Image URL" className="flex-1" /><ImageUploadButton onUpload={url=>setGalleryForm({...galleryForm,src:url})} label="Upload" /></div></div>
      <div><Label>Title *</Label><Input value={galleryForm.alt} onChange={e=>setGalleryForm({...galleryForm,alt:e.target.value})} placeholder="Image title" /></div>
      {galleryForm.src && <img src={galleryForm.src} alt="Preview" className="w-full h-32 object-cover rounded" />}
      <Button onClick={handleSaveGallery} className="w-full">{editingGallery?"Update":"Add"}</Button>
    </div></DialogContent></Dialog>
  </Layout>);
};
export default Campus;