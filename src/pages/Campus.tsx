import Layout from "@/components/Layout";
import { Building, Book, Beaker, Music, Dumbbell, Monitor, Trees, Utensils } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const facilities = [
  { icon: Book, title: "Library", description: "State-of-the-art library with over 50,000 books, digital resources, and quiet study areas." },
  { icon: Beaker, title: "Science Labs", description: "Modern physics, chemistry, and biology laboratories equipped with latest equipment." },
  { icon: Monitor, title: "Computer Lab", description: "Advanced computer facilities with high-speed internet and latest software." },
  { icon: Dumbbell, title: "Sports Complex", description: "Indoor and outdoor sports facilities including basketball courts, swimming pool, and gymnasium." },
  { icon: Music, title: "Music Room", description: "Fully equipped music room with various instruments for developing artistic talents." },
  { icon: Trees, title: "Green Campus", description: "Eco-friendly campus with beautiful gardens, trees, and sustainable practices." },
  { icon: Utensils, title: "Cafeteria", description: "Hygienic cafeteria serving nutritious meals prepared by professional chefs." },
  { icon: Building, title: "Smart Classrooms", description: "Technology-enabled classrooms with projectors, smart boards, and AC facilities." },
];

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop", alt: "Main Building" },
  { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop", alt: "Classroom" },
  { src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop", alt: "Computer Lab" },
  { src: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&h=400&fit=crop", alt: "Library" },
  { src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop", alt: "Sports Ground" },
  { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop", alt: "Campus View" },
];

const Campus = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground animate-fade-in">
              Our Campus
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Explore our world-class facilities and beautiful campus environment
          </p>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-4 animate-fade-in">
            Campus Facilities
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Our campus is designed to provide the best learning environment with modern amenities
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((facility, index) => (
              <div 
                key={facility.title}
                className="bg-card p-6 rounded-lg card-hover animate-fade-in-up"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <facility.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">{facility.title}</h3>
                <p className="text-sm text-muted-foreground">{facility.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-4 animate-fade-in">
            Campus Gallery
          </h2>
          <p className="text-muted-foreground text-center mb-12 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Take a visual tour of our beautiful campus
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div 
                key={image.alt}
                className="image-zoom rounded-lg overflow-hidden shadow-lg cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                onClick={() => setSelectedImage(image.src)}
              >
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 bg-card">
                  <p className="text-sm font-medium text-foreground">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Tour Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4 animate-fade-in">
            Virtual Campus Tour
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Experience our campus from anywhere in the world
          </p>
          <div className="aspect-video max-w-4xl mx-auto bg-secondary rounded-lg flex items-center justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="text-center p-8">
              <Building className="w-16 h-16 text-primary mx-auto mb-4 animate-float" />
              <p className="text-muted-foreground">Virtual tour coming soon</p>
              <p className="text-sm text-muted-foreground mt-2">Contact us to schedule an in-person visit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="Campus" 
            className="max-w-full max-h-full object-contain rounded-lg animate-scale-in"
          />
          <button 
            className="absolute top-4 right-4 text-white text-2xl hover:opacity-75"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
        </div>
      )}
    </Layout>
  );
};

export default Campus;
