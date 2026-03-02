import Layout from "@/components/Layout";
import { Building, Book, Beaker, Music, Dumbbell, Monitor, Trees, Utensils, Plus, Pencil, Trash2, ImagePlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import ImageUploadButton from "@/components/ImageUploadButton";

const iconMap: Record<string, any> = {
  Book, Beaker, Monitor, Dumbbell, Music, Trees, Utensils, Building,
};
const iconOptions = Object.keys(iconMap);

const Campus = () => {
  const { isAdmin } = useAdmin();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<any | null>(null);
  const [galleryForm, setGalleryForm] = useState({ src: "", alt: "" });

  const fetchData = async () => {
    try {
      const galleryResponse = await axiosInstance.get("/gallery");
      setGallery(galleryResponse.data || []);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

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
    if (!galleryForm.src || !galleryForm.alt) {
      toast.error("Image URL and Title are required");
      return;
    }
    try {
      if (editingGallery) {
        await axiosInstance.put(`/gallery/${editingGallery._id}`, galleryForm);
        toast.success("Gallery image updated!");
      } else {
        await axiosInstance.post("/gallery", galleryForm);
        toast.success("Gallery image added!");
      }
      setGalleryDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to save gallery image");
    }
  };

  const handleAddMultipleGalleryImages = async (urls: string[]) => {
    try {
      await Promise.all(urls.map(url =>
        axiosInstance.post("/gallery", { src: url, alt: "Uploaded Image" })
      ));
      toast.success(`${urls.length} images added to gallery!`);
      fetchData();
    } catch (error) {
      toast.error("Failed to add images");
    }
  };

  const handleDeleteGallery = async (id: string) => {
    try {
      await axiosInstance.delete(`/gallery/${id}`);
      toast.success("Gallery image removed!");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete gallery image");
    }
  };

  if (loading) {
    return (
      <Layout>
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </section>
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

      {/* Gallery Section */}
      <section className="py-10 sm:py-14 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center animate-fade-in">
              Campus Gallery
            </h2>
            {isAdmin && (
              <div className="flex gap-2">
                <Button onClick={openAddGallery} size="sm" className="bg-primary text-primary-foreground rounded-full text-xs sm:text-sm">
                  <ImagePlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" /> Add Image
                </Button>
                <ImageUploadButton
                  onUpload={() => {}}
                  multiple
                  onMultiUpload={handleAddMultipleGalleryImages}
                  label="Upload Multiple"
                />
              </div>
            )}
          </div>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground text-center mb-6 sm:mb-8 md:mb-12 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Take a visual tour of our beautiful campus
          </p>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {gallery.map((image, index) => (
              <div
                key={image._id}
                className="relative group image-zoom rounded-lg overflow-hidden shadow-lg cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                onClick={() => setSelectedImage(image.src)}
              >
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button onClick={(e) => { e.stopPropagation(); openEditGallery(image); }} className="p-1 bg-card rounded-full shadow-md hover:bg-secondary">
                      <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteGallery(image._id); }} className="p-1 bg-card rounded-full shadow-md hover:bg-destructive/10">
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

      {/* Gallery Dialog */}
      <Dialog open={galleryDialogOpen} onOpenChange={setGalleryDialogOpen}>
        <DialogContent className="mx-4 max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">{editingGallery ? "Edit Image" : "Add Image"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Image</Label>
              <div className="flex gap-2">
                <Input value={galleryForm.src} onChange={(e) => setGalleryForm({ ...galleryForm, src: e.target.value })} placeholder="Image URL" className="text-sm flex-1" />
                <ImageUploadButton onUpload={(url) => setGalleryForm({ ...galleryForm, src: url })} label="Upload" />
              </div>
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
