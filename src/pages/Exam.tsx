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
      <section className="py-10 sm:py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <FileText className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground animate-fade-in">
              Examinations
            </h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up px-2" style={{ animationDelay: "0.1s" }}>
            Stay updated with exam schedules, results, and important guidelines
          </p>
        </div>
      </section>

      {/* Exam Schedule Section */}
      <section className="py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Examination Schedule 2025-26</h2>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full bg-card rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm">Examination</th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm">Classes</th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm">Start Date</th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm">End Date</th>
                </tr>
              </thead>
              <tbody>
                {examSchedule.map((exam, index) => (
                  <tr 
                    key={exam.exam}
                    className={`border-b border-border animate-fade-in-up ${index % 2 === 0 ? 'bg-card' : 'bg-secondary/30'}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-medium text-foreground text-xs sm:text-sm">{exam.exam}</td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-muted-foreground text-xs sm:text-sm">{exam.classes}</td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-muted-foreground text-xs sm:text-sm">{exam.startDate}</td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-muted-foreground text-xs sm:text-sm">{exam.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {examSchedule.map((exam, index) => (
              <div
                key={exam.exam}
                className={`bg-card p-4 rounded-lg shadow animate-fade-in-up ${index % 2 === 0 ? '' : 'bg-secondary/30'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="font-bold text-foreground text-sm mb-2">{exam.exam}</h3>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span className="text-muted-foreground">Classes:</span>
                  <span className="text-foreground">{exam.classes}</span>
                  <span className="text-muted-foreground">Start:</span>
                  <span className="text-foreground">{exam.startDate}</span>
                  <span className="text-muted-foreground">End:</span>
                  <span className="text-foreground">{exam.endDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-10 sm:py-14 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Result Announcements</h2>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Check your examination results here</p>
          </div>
          <div className="max-w-2xl mx-auto bg-card p-4 sm:p-6 md:p-8 rounded-lg shadow-lg text-center animate-fade-in-up">
            <Clock className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-primary mx-auto mb-3 sm:mb-4 animate-float" />
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-2">Results Portal</h3>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-4 sm:mb-6">
              Results will be published after the examination period. Check back for updates.
            </p>
            <Button className="btn-hover bg-primary text-primary-foreground text-xs sm:text-sm">
              Check Results
            </Button>
          </div>
        </div>
      </section>

      {/* Guidelines Section */}
      <section className="py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            <div className="animate-slide-in-left">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Examination Guidelines</h2>
              </div>
              <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                {guidelines.map((guideline, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-2 sm:gap-3 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] sm:text-xs md:text-sm flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-xs sm:text-sm md:text-base text-muted-foreground">{guideline}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="animate-slide-in-right">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <Download className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Download Resources</h2>
              </div>
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                {resources.map((resource, index) => (
                  <div 
                    key={resource.title}
                    className="flex items-center justify-between p-3 sm:p-4 bg-card rounded-lg shadow card-hover animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <FileText className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground text-xs sm:text-sm">{resource.title}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{resource.type} • {resource.size}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground p-1.5 sm:p-2">
                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
