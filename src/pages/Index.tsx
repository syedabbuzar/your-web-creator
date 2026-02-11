import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import EventCard from "@/components/EventCard";
import { ArrowRight, BookOpen, Users, Award, GraduationCap } from "lucide-react";
import event1Img from "@/assets/Event1.jpg";
import event2Img from "@/assets/Event2.jpg";
import event4Img from "@/assets/Event4.jpg";

const events = [
  {
    title: "Educational Expo & Conference 2025",
    description: "Join us for an exciting educational expo featuring innovative teaching methods and technologies.",
    date: "March 15, 2025",
    image: event2Img,
  },
  {
    title: "Glimpse of Urooj 2025",
    description: "Annual cultural festival celebrating talent, creativity, and the spirit of our students.",
    date: "February 28, 2025",
    image: event1Img,
  },
  {
    title: "POCSO Act 2012 Awareness Workshop",
    description: "Important awareness session about child protection laws and safety measures.",
    date: "February 20, 2025",
    image: event4Img,
  },
];

const stats = [
  { icon: Users, value: "5000+", label: "Students" },
  { icon: GraduationCap, value: "200+", label: "Faculty" },
  { icon: Award, value: "50+", label: "Awards" },
  { icon: BookOpen, value: "25+", label: "Years" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)`,
            backgroundSize: "20px 20px",
          }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 
              className="text-lg md:text-xl text-muted-foreground uppercase tracking-widest mb-6 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              Welcome to Scholar Campus
            </h2>
            <h1 
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-8 animate-fade-in-up font-serif"
              style={{ animationDelay: "0.3s" }}
            >
              "At Scholar Campus, we are committed to{" "}
              <span className="text-accent">shaping a better world</span> through better education."
            </h1>
            <div 
              className="animate-fade-in-up"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="inline-block bg-secondary/50 rounded-lg px-6 py-4 mb-8">
                <p className="text-xl md:text-2xl font-semibold text-foreground tracking-wider">
                  VERITAS
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Truth • Knowledge • Excellence
                </p>
              </div>
            </div>
            <Link 
              to="/about"
              className="animate-fade-in-up inline-block"
              style={{ animationDelay: "0.7s" }}
            >
              <Button className="btn-hover bg-primary text-primary-foreground text-lg px-8 py-6 rounded-full font-semibold group">
                EXPLORE MORE
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <stat.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 
              className="text-sm uppercase tracking-widest text-muted-foreground mb-3 animate-fade-in"
            >
              Latest Updates
            </h2>
            <h3 
              className="text-3xl md:text-4xl font-bold text-foreground animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              News & Events
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <EventCard
                key={event.title}
                {...event}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/events">
              <Button variant="outline" className="btn-hover border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-full font-semibold">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up"
          >
            Ready to Join Our Family?
          </h2>
          <p 
            className="text-lg opacity-90 mb-8 max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Take the first step towards a brighter future. Contact us to learn more about admissions and opportunities.
          </p>
          <Link 
            to="/contact"
            className="animate-fade-in-up inline-block"
            style={{ animationDelay: "0.2s" }}
          >
            <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8 py-6 rounded-full font-semibold btn-hover">
              Get In Touch
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
