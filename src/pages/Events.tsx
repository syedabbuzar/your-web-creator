import Layout from "@/components/Layout";
import EventCard from "@/components/EventCard";
import { Calendar, Filter } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const allEvents = [
  {
    title: "Educational Expo & Conference 2025",
    description: "Join us for an exciting educational expo featuring innovative teaching methods, modern technologies, and interactive sessions with education experts from across the country.",
    date: "March 15, 2025",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    category: "Conference",
  },
  {
    title: "Glimpse of Urooj 2025",
    description: "Annual cultural festival celebrating talent, creativity, and the spirit of our students. Music, dance, drama, and art exhibitions await!",
    date: "February 28, 2025",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
    category: "Cultural",
  },
  {
    title: "POCSO Act 2012 Awareness Workshop",
    description: "Important awareness session about child protection laws and safety measures. A must-attend for parents, teachers, and students.",
    date: "February 20, 2025",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&h=600&fit=crop",
    category: "Workshop",
  },
  {
    title: "Annual Sports Day 2025",
    description: "Celebrating athleticism and sportsmanship. Join us for an exciting day of competitions, team sports, and individual events.",
    date: "March 5, 2025",
    image: "https://images.unsplash.com/photo-1461896836934- voices-of-2022?w=800&h=600&fit=crop",
    category: "Sports",
  },
  {
    title: "Science Exhibition",
    description: "Students showcase their innovative science projects and experiments. Witness the future scientists in action!",
    date: "March 22, 2025",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop",
    category: "Academic",
  },
  {
    title: "Parent-Teacher Meeting",
    description: "An opportunity for parents to interact with teachers and discuss their child's academic progress and development.",
    date: "February 15, 2025",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop",
    category: "Meeting",
  },
];

const categories = ["All", "Conference", "Cultural", "Workshop", "Sports", "Academic", "Meeting"];

const Events = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredEvents = activeCategory === "All" 
    ? allEvents 
    : allEvents.filter(event => event.category === activeCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground animate-fade-in">
              Events
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Stay updated with all the latest happenings at Scholar Educational Campus
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground uppercase tracking-wider">Filter by Category</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-primary/20"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <EventCard
                key={event.title}
                title={event.title}
                description={event.description}
                date={event.date}
                image={event.image}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No events found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Events;
