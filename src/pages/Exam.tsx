import Layout from "@/components/Layout";
import { FileText, Calendar, Download, Clock, BookOpen, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const examSchedule = [
  { exam: "First Term Examination", classes: "I - XII", startDate: "July 15, 2025", endDate: "July 25, 2025" },
  { exam: "Mid-Term Examination", classes: "I - XII", startDate: "October 10, 2025", endDate: "October 20, 2025" },
  { exam: "Second Term Examination", classes: "I - XII", startDate: "December 15, 2025", endDate: "December 23, 2025" },
  { exam: "Annual Examination", classes: "I - XII", startDate: "March 1, 2026", endDate: "March 15, 2026" },
];

const resources = [
  { title: "Examination Guidelines 2025", type: "PDF", size: "2.5 MB" },
  { title: "Sample Question Papers", type: "ZIP", size: "15 MB" },
  { title: "Syllabus for 2025-26", type: "PDF", size: "5 MB" },
  { title: "Exam Hall Ticket Format", type: "PDF", size: "500 KB" },
];

const guidelines = [
  "Students must carry their hall tickets to the examination center.",
  "Reach the examination center 30 minutes before the exam starts.",
  "Electronic devices are strictly prohibited in the examination hall.",
  "Use only blue or black pen for writing answers.",
  "Any form of malpractice will lead to immediate disqualification.",
  "Students must bring their own stationery items.",
];

const Exam = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground animate-fade-in">
              Examinations
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Stay updated with exam schedules, results, and important guidelines
          </p>
        </div>
      </section>

      {/* Exam Schedule Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Examination Schedule 2025-26</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-card rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="px-6 py-4 text-left">Examination</th>
                  <th className="px-6 py-4 text-left">Classes</th>
                  <th className="px-6 py-4 text-left">Start Date</th>
                  <th className="px-6 py-4 text-left">End Date</th>
                </tr>
              </thead>
              <tbody>
                {examSchedule.map((exam, index) => (
                  <tr 
                    key={exam.exam}
                    className={`border-b border-border animate-fade-in-up ${index % 2 === 0 ? 'bg-card' : 'bg-secondary/30'}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td className="px-6 py-4 font-medium text-foreground">{exam.exam}</td>
                    <td className="px-6 py-4 text-muted-foreground">{exam.classes}</td>
                    <td className="px-6 py-4 text-muted-foreground">{exam.startDate}</td>
                    <td className="px-6 py-4 text-muted-foreground">{exam.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Result Announcements</h2>
            </div>
            <p className="text-muted-foreground">Check your examination results here</p>
          </div>
          <div className="max-w-2xl mx-auto bg-card p-8 rounded-lg shadow-lg text-center animate-fade-in-up">
            <Clock className="w-16 h-16 text-primary mx-auto mb-4 animate-float" />
            <h3 className="text-xl font-bold text-foreground mb-2">Results Portal</h3>
            <p className="text-muted-foreground mb-6">
              Results will be published after the examination period. Check back for updates.
            </p>
            <Button className="btn-hover bg-primary text-primary-foreground">
              Check Results
            </Button>
          </div>
        </div>
      </section>

      {/* Guidelines Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="animate-slide-in-left">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Examination Guidelines</h2>
              </div>
              <ul className="space-y-4">
                {guidelines.map((guideline, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-3 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{guideline}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="animate-slide-in-right">
              <div className="flex items-center gap-3 mb-6">
                <Download className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Download Resources</h2>
              </div>
              <div className="space-y-4">
                {resources.map((resource, index) => (
                  <div 
                    key={resource.title}
                    className="flex items-center justify-between p-4 bg-card rounded-lg shadow card-hover animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{resource.title}</p>
                        <p className="text-xs text-muted-foreground">{resource.type} • {resource.size}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Exam;
