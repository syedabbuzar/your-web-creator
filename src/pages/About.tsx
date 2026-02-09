import Layout from "@/components/Layout";
import { Users, Target, Eye, Heart, Award, BookOpen } from "lucide-react";

const values = [
  { icon: Target, title: "Truth", description: "We pursue knowledge with honesty and integrity in all our endeavors." },
  { icon: Eye, title: "Vision", description: "We envision a world where education transforms lives and communities." },
  { icon: Heart, title: "Compassion", description: "We care for every student's well-being and personal growth." },
  { icon: Award, title: "Excellence", description: "We strive for the highest standards in education and character." },
];

const leadership = [
  { name: "Dr. Rajesh Kumar", role: "Principal", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" },
  { name: "Mrs. Priya Sharma", role: "Vice Principal", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop" },
  { name: "Mr. Amit Verma", role: "Academic Director", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop" },
  { name: "Mrs. Sunita Patel", role: "Administrative Head", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop" },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground animate-fade-in">
              About Us
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Discover our journey, mission, and the values that guide Scholar Educational Campus
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-3xl font-bold text-foreground mb-6">Our History</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Founded in 1998, Scholar Educational Campus has been a beacon of educational excellence for over 25 years. What started as a small institution with a vision to provide quality education has now grown into one of the region's most prestigious educational establishments.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Our journey began with a simple belief: every child deserves access to world-class education that nurtures both academic excellence and character development. Today, we continue to uphold this founding principle while embracing modern teaching methodologies.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Over the years, we have produced thousands of successful alumni who are making their mark in various fields across the globe, carrying forward the values and knowledge they gained at Scholar Campus.
              </p>
            </div>
            <div className="animate-slide-in-right">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop" 
                  alt="School Building" 
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
                  <p className="text-4xl font-bold">25+</p>
                  <p className="text-sm opacity-90">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VERITAS Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in font-serif">VERITAS</h2>
          <p className="text-xl mb-8 opacity-90 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Truth • Knowledge • Excellence
          </p>
          <div className="max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <p className="text-lg leading-relaxed opacity-90">
              VERITAS, Latin for "Truth," is the cornerstone of our educational philosophy. We believe that the pursuit of truth through knowledge leads to excellence in all aspects of life. This motto guides our teaching approach, our interactions with students, and our commitment to holistic education.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12 animate-fade-in">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={value.title}
                className="text-center p-6 bg-card rounded-lg card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <value.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-card p-8 rounded-lg shadow-lg animate-slide-in-left">
              <BookOpen className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be a globally recognized institution that nurtures future leaders, innovators, and responsible citizens who contribute positively to society. We envision a learning environment where every student discovers their potential and develops the skills needed to thrive in an ever-changing world.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-lg animate-slide-in-right">
              <Target className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide holistic education that combines academic excellence with character development. We are committed to creating a supportive learning environment that encourages curiosity, critical thinking, and creativity while instilling values of integrity, compassion, and social responsibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-4 animate-fade-in">
            Our Leadership
          </h2>
          <p className="text-muted-foreground text-center mb-12 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Meet the dedicated team leading Scholar Educational Campus
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((leader, index) => (
              <div 
                key={leader.name}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden image-zoom border-4 border-primary/20">
                  <img 
                    src={leader.image} 
                    alt={leader.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-foreground">{leader.name}</h3>
                <p className="text-sm text-muted-foreground">{leader.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
