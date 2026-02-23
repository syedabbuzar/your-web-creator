import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import FloatingActions from "@/components/FloatingActions";
import EventCard from "@/components/EventCard";
import HeroCarousel from "@/components/HeroCarousel";
import { ArrowRight, BookOpen, Users, Award, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const stats = [
  //{ icon: Users, value: "5000+", label: "classroom" },
  { icon: GraduationCap, value: "50+", label: "Faculty" },
  { icon: Award, value: "50+", label: "Awards" },
  { icon: BookOpen, value: "12+", label: "Years" },
];

const Index = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase.from("events").select("*").order("sort_order").limit(3);
      setEvents(data || []);
    };
    fetchEvents();
  }, []);

  return (
    <Layout>
      <FloatingActions />
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)`,
            backgroundSize: "20px 20px",
          }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground uppercase tracking-widest mb-3 sm:mb-4 md:mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Welcome to Scholar Educational Campus
                 Nursery To 12th Grade 
            </h2>
            <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight mb-4 sm:mb-6 md:mb-8 animate-fade-in-up font-serif px-2" style={{ animationDelay: "0.3s" }}>
              "At Scholar Educational Campus, we are committed to{" "}
              <span className="text-accent">shaping a better world</span> through better education."
            </h1>
            <div className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              <div className="inline-block bg-secondary/50 rounded-lg px-4 sm:px-6 py-3 sm:py-4 mb-4 sm:mb-6 md:mb-8">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-foreground tracking-wider">VERITAS</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Truth • Knowledge • Excellence</p>
              </div>
            </div>
            <Link to="/about" className="animate-fade-in-up inline-block" style={{ animationDelay: "0.7s" }}>
              <Button className="btn-hover bg-primary text-primary-foreground text-sm sm:text-base md:text-lg px-6 sm:px-8 py-4 sm:py-5 md:py-6 rounded-full font-semibold group">
                EXPLORE MORE
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <stat.icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary mx-auto mb-2 sm:mb-3" />
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground mb-2 sm:mb-3 animate-fade-in">Latest Updates</h2>
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>News & Events</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="animate-fade-in-up opacity-0"
                style={{ animationDelay: `${0.2 + index * 0.15}s`, animationFillMode: "forwards" }}
              >
                <EventCard id={event.id} title={event.title} description={event.description} date={event.date} image={event.image} className="hover-scale" />
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-10 md:mt-12">
            <Link to="/events">
              <Button variant="outline" className="btn-hover border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-14 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 animate-fade-in-up">Ready to Join Our Family?</h2>
          <p className="text-sm sm:text-base md:text-lg opacity-90 mb-5 sm:mb-6 md:mb-8 max-w-2xl mx-auto animate-fade-in-up px-2" style={{ animationDelay: "0.1s" }}>
            Take the first step towards a brighter future. Contact us to learn more about admissions and opportunities.
          </p>
          <Link to="/contact" className="animate-fade-in-up inline-block" style={{ animationDelay: "0.2s" }}>
            <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-4 sm:py-5 md:py-6 rounded-full font-semibold btn-hover">
              Get In Touch
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
