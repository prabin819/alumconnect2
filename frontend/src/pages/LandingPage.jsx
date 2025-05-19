import { Button } from '@/components/ui/button';

export default function AlumniStudentPortal() {
  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Bridge the Gap</h1>
              <p className="text-xl text-slate-600 mb-6">
                Connect with alumni and students to build meaningful relationships that last beyond
                graduation.
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Explore the Network
              </Button>
            </div>
            <div className="w-full md:w-2/5">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Alumni and students connecting"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Your Gateway to Success</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 transition-all hover:shadow-md">
              <div className="bg-emerald-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Mentorship</h3>
              <p className="text-slate-600">
                Connect with experienced alumni who can guide your academic and career journey.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 transition-all hover:shadow-md">
              <div className="bg-emerald-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Job Opportunities</h3>
              <p className="text-slate-600">
                Access exclusive job postings and internships shared by our alumni network.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 transition-all hover:shadow-md">
              <div className="bg-emerald-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Events</h3>
              <p className="text-slate-600">
                Participate in networking events, workshops, and reunions throughout the year.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-emerald-600 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold mb-1">5,000+</div>
              <p className="text-emerald-100">Active Alumni</p>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold mb-1">250+</div>
              <p className="text-emerald-100">Mentorships</p>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold mb-1">120+</div>
              <p className="text-emerald-100">Annual Events</p>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold mb-1">85%</div>
              <p className="text-emerald-100">Job Placement Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Success Stories</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Alumni Testimonial */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Dr. James Wilson</h4>
                  <p className="text-slate-500 text-sm">Class of 2010, Surgeon</p>
                </div>
              </div>
              <p className="text-slate-600">
                "Mentoring students has been incredibly rewarding. I've helped guide five students
                into medical school, and watching them succeed makes me proud of our community."
              </p>
            </div>

            {/* Student Testimonial */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Maya Patel</h4>
                  <p className="text-slate-500 text-sm">Current Student, Engineering</p>
                </div>
              </div>
              <p className="text-slate-600">
                "My alumni mentor helped me secure an internship at a top tech company. The guidance
                and connections I've gained through this platform have been invaluable to my career
                path."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-12 border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community Today</h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Whether you're an alumnus looking to give back or a student seeking guidance, our portal
            connects you to opportunities that matter.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Alumni Registration</Button>
            <Button
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              Student Access
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
              <div className="text-emerald-600 font-semibold mb-2">May 25, 2025</div>
              <h3 className="text-lg font-bold mb-2">Annual Alumni Reunion</h3>
              <p className="text-slate-600 mb-4">
                Join us for a day of networking, reminiscing, and celebrating our alma mater.
              </p>
              <Button variant="link" className="text-emerald-600 p-0">
                Learn more →
              </Button>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
              <div className="text-emerald-600 font-semibold mb-2">June 12, 2025</div>
              <h3 className="text-lg font-bold mb-2">Career Fair</h3>
              <p className="text-slate-600 mb-4">
                Connect with 50+ companies looking to hire from our talented student and alumni
                pool.
              </p>
              <Button variant="link" className="text-emerald-600 p-0">
                Learn more →
              </Button>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
              <div className="text-emerald-600 font-semibold mb-2">July 8, 2025</div>
              <h3 className="text-lg font-bold mb-2">Mentorship Workshop</h3>
              <p className="text-slate-600 mb-4">
                Learn how to make the most of mentorship relationships in this interactive session.
              </p>
              <Button variant="link" className="text-emerald-600 p-0">
                Learn more →
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
