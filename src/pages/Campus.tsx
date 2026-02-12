import Layout from "@/components/Layout";
import { Building, Book, Beaker, Music, Dumbbell, Monitor, Trees, Utensils, Plus, Pencil, Trash2, ImagePlus } from "lucide-react";
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

const iconMap: Record<string, any> = {
  Book, Beaker, Monitor, Dumbbell, Music, Trees, Utensils, Building,
};
const iconOptions = Object.keys(iconMap);

const Campus = () => {
  const { isAdmin } = useAdmin();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [facilities, setFacilities] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [facilityDialogOpen, setFacilityDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<any | null>(null);
  const [facilityForm, setFacilityForm] = useState({ title: "", description: "", icon: "Building" });

  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<any | null>(null);
  const [galleryForm, setGalleryForm] = useState({ src: "", alt: "" });

  const fetchData = async () => {
    const [fRes, gRes] = await Promise.all([
      supabase.from("facilities").select("*").order("sort_order"),
      supabase.from("gallery").select("*").order("sort_order"),
    ]);
    setFacilities(fRes.data || []);
    setGallery(gRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Facility CRUD
  const openAddFacility = () => {
    setEditingFacility(null);
    setFacilityForm({ title: "", description: "", icon: "Building" });
    setFacilityDialogOpen(true);
  };

  const openEditFacility = (f: any) => {
    setEditingFacility(f);
    setFacilityForm({ title: f.title, description: f.description, icon: f.icon });
    setFacilityDialogOpen(true);
  };

  const handleSaveFacility = async () => {
    if (!facilityForm.title || !facilityForm.description) return toast.error("Title and Description are required");
    if (editingFacility) {
      const { error } = await supabase.from("facilities").update(facilityForm).eq("id", editingFacility.id);
      if (error) return toast.error("Failed to update");
      toast.success("Facility updated!");
    } else {
      const { error } = await supabase.from("facilities").insert({ ...facilityForm, sort_order: facilities.length + 1 });
      if (error) return toast.error("Failed to add");
      toast.success("Facility added!");
    }
    setFacilityDialogOpen(false);
    fetchData();
  };

  const handleDeleteFacility = async (id: string) => {
    const { error } = await supabase.from("facilities").delete().eq("id", id);
    if (error) return toast.error("Failed to delete");
    toast.success("Facility removed!");
    fetchData();
  };

  // Gallery CRUD
  const openAddGallery = () => {
    setEditingGallery(null);
    setGalleryForm({ src: "", alt: "" });
    setGalleryDialogOpen(true);
  };

  const openEditGallery = (g: any) => {
    setEditingGallery(g);
    setGalleryForm({ src: g.src, alt: g.alt });
    setGalleryDialogOpen(true);
  };

  const handleSaveGallery = async () => {
    if (!galleryForm.src || !galleryForm.alt) return toast.error("Image URL and Title are required");
    if (editingGallery) {
      const { error } = await supabase.from("gallery").update(galleryForm).eq("id", editingGallery.id);
      if (error) return toast.error("Failed to update");
      toast.success("Gallery image updated!");
    } else {
      const { error } = await supabase.from("gallery").insert({ ...galleryForm, sort_order: gallery.length + 1 });
      if (error) return toast.error("Failed to add");
      toast.success("Gallery image added!");
    }
    setGalleryDialogOpen(false);
    fetchData();
  };

  const handleDeleteGallery = async (id: string) => {
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) return toast.error("Failed to delete");
    toast.success("Gallery image removed!");
    fetchData();
  };

  if (loading) {
    return (
      <Layout>
        <section className="py-16"><div className="container mx-auto px-4 text-center"><p className="text-muted-foreground">Loading...</p></div></section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Building className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground animate-fade-in">
              Our Campus
            </h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up px-2" style={{ animationDelay: "0.1s" }}>
            Explore our world-class facilities and beautiful campus environment
          </p>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center animate-fade-in">
              Campus Facilities
            </h2>
            {isAdmin && (
              <Button onClick={openAddFacility} size="sm" className="bg-primary text-primary-foreground rounded-full text-xs sm:text-sm">
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" /> Add Facility
              </Button>
            )}
          </div>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground text-center mb-6 sm:mb-8 md:mb-12 max-w-2xl mx-auto animate-fade-in-up px-2" style={{ animationDelay: "0.1s" }}>
            Our campus is designed to provide the best learning environment with modern amenities
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {facilities.map((facility, index) => {
              const IconComp = iconMap[facility.icon] || Building;
              return (
                <div
                  key={facility.id}
                  className="relative group bg-card p-3 sm:p-4 md:p-6 rounded-lg card-hover animate-fade-in-up"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button onClick={() => openEditFacility(facility)} className="p-1 bg-card rounded-full shadow-md hover:bg-secondary">
                        <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                      </button>
                      <button onClick={() => handleDeleteFacility(facility.id)} className="p-1 bg-card rounded-full shadow-md hover:bg-destructive/10">
                        <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-destructive" />
                      </button>
                    </div>
                  )}
                  <IconComp className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary mb-2 sm:mb-3 md:mb-4" />
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground mb-1 sm:mb-2">{facility.title}</h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{facility.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-10 sm:py-14 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center animate-fade-in">
              Campus Gallery
            </h2>
            {isAdmin && (
              <Button onClick={openAddGallery} size="sm" className="bg-primary text-primary-foreground rounded-full text-xs sm:text-sm">
                <ImagePlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" /> Add Image
              </Button>
            )}
          </div>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground text-center mb-6 sm:mb-8 md:mb-12 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Take a visual tour of our beautiful campus
          </p>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {gallery.map((image, index) => (
              <div
                key={image.id}
                className="relative group image-zoom rounded-lg overflow-hidden shadow-lg cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                onClick={() => setSelectedImage(image.src)}
              >
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button onClick={(e) => { e.stopPropagation(); openEditGallery(image); }} className="p-1 bg-card rounded-full shadow-md hover:bg-secondary">
                      <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteGallery(image.id); }} className="p-1 bg-card rounded-full shadow-md hover:bg-destructive/10">
                      <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-destructive" />
                    </button>
                  </div>
                )}
                <img src={image.src} alt={image.alt} className="w-full h-32 sm:h-40 md:h-52 lg:h-64 object-cover" />
                <div className="p-2 sm:p-3 md:p-4 bg-card">
                  <p className="text-xs sm:text-sm font-medium text-foreground">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Tour Section */}
      <section className="py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 sm:mb-4 animate-fade-in">
            Virtual Campus Tour
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto animate-fade-in-up px-2" style={{ animationDelay: "0.1s" }}>
            Experience our campus from anywhere in the world
          </p>
          <div className="aspect-video max-w-4xl mx-auto bg-secondary rounded-lg flex items-center justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="text-center p-4 sm:p-6 md:p-8">
              <Building className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-primary mx-auto mb-2 sm:mb-3 md:mb-4" />
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Virtual tour coming soon</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-1 sm:mt-2">Contact us to schedule an in-person visit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Campus" className="max-w-full max-h-full object-contain rounded-lg animate-scale-in" />
          <button className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white text-xl sm:text-2xl hover:opacity-75" onClick={() => setSelectedImage(null)}>✕</button>
        </div>
      )}

      {/* Facility Dialog */}
      <Dialog open={facilityDialogOpen} onOpenChange={setFacilityDialogOpen}>
        <DialogContent className="mx-4 max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">{editingFacility ? "Edit Facility" : "Add Facility"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Title *</Label>
              <Input value={facilityForm.title} onChange={(e) => setFacilityForm({ ...facilityForm, title: e.target.value })} placeholder="Facility name" className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Description *</Label>
              <Textarea value={facilityForm.description} onChange={(e) => setFacilityForm({ ...facilityForm, description: e.target.value })} placeholder="Facility description" className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Icon</Label>
              <select value={facilityForm.icon} onChange={(e) => setFacilityForm({ ...facilityForm, icon: e.target.value })} className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm">
                {iconOptions.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
              </select>
            </div>
            <Button onClick={handleSaveFacility} className="w-full bg-primary text-primary-foreground text-sm">{editingFacility ? "Update" : "Add"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gallery Dialog */}
      <Dialog open={galleryDialogOpen} onOpenChange={setGalleryDialogOpen}>
        <DialogContent className="mx-4 max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">{editingGallery ? "Edit Image" : "Add Image"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Image URL *</Label>
              <Input value={galleryForm.src} onChange={(e) => setGalleryForm({ ...galleryForm, src: e.target.value })} placeholder="https://..." className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Title *</Label>
              <Input value={galleryForm.alt} onChange={(e) => setGalleryForm({ ...galleryForm, alt: e.target.value })} placeholder="Image title" className="text-sm" />
            </div>
            {galleryForm.src && (
              <div className="rounded-md overflow-hidden border border-border">
                <img src={galleryForm.src} alt="Preview" className="w-full h-32 object-cover" />
              </div>
            )}
            <Button onClick={handleSaveGallery} className="w-full bg-primary text-primary-foreground text-sm">{editingGallery ? "Update" : "Add"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Campus;
