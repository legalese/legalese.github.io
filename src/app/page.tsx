import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import Alert from "@/app/_components/alert";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllPosts } from "../lib/api";
import Link from "next/link";

export default function Index() {
  const allPosts = getAllPosts();
  const recentPosts = allPosts.slice(0, 4);

  return (
    <main>
      <Alert>
          Legalese acquires Monad Solutions &nbsp;
          <a href="posts/2026-01-01-legalese-acquires-monad-solutions" className="text-accent">Read more</a>
      </Alert>
      <Container>
        <Header />
        
        {/* Hero Section */}
        <section className="mb-4">
          <div className="relative flex flex-col lg:flex-row items-center gap-12 bg-amber-50 rounded-2xl overflow-hidden">
            {/* Background image - hidden on mobile/tablet */}
            <div 
              className="hidden lg:block absolute inset-0"
              style={{
                backgroundImage: 'url(/assets/images/hero.png)',
                backgroundPosition: 'right center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
              }}
            />
            <div className="relative lg:w-2/3 p-24">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-6">
                Software is<br />
                <span className="text-accent">eating law</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Legalese is building L4, a domain-specific programming language for law. 
                We treat legal rules and contracts as executable specifications.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://l4.legalese.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-accent-hover transition-colors"
                >
                  Explore L4
                </a>
                <a 
                  href="https://jl4.legalese.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="border-2 border-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition-colors"
                >
                  Try the IDE
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* What is L4 Section */}
        <section className="mb-20 py-16 -mx-5 px-5 ">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-center">
            What is L4?
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-8 text-center">
              L4 is our domain-specific programming language for law. It treats legal rules 
              and contracts as executable specifications, allowing you to:
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-3">Formalize rules with precision</h3>
                <p className="text-gray-600">
                  Express legal logic with mathematical precision, eliminating ambiguity 
                  and enabling automated analysis.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-3">Test contracts against scenarios</h3>
                <p className="text-gray-600">
                  Run your contracts through test cases to verify behavior before deployment, 
                  just like software testing.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-3">Find contradictions automatically</h3>
                <p className="text-gray-600">
                  Static analysis can prove that a contract is internally consistent, 
                  free of contradiction, and complete.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-3">Generate applications</h3>
                <p className="text-gray-600">
                  Compile L4 specifications into user-facing applications, decision services, 
                  and natural language explanations.
                </p>
              </div>
            </div>
            <div className="text-center mt-8">
              <a 
                href="https://github.com/smucclaw/l4-ide" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent font-medium hover:text-accent-hover transition-colors"
              >
                View on GitHub →
              </a>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="max-w-6xl mx-auto m-20">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                About Legalese
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Marc Andreessen said, "software is eating the world"; at Legalese, we say 
                <em> software is eating law</em>. Our solution to the broken-law problem is to 
                resolve it at a fundamental level, using math, computer science, and logic.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                At the core, we are an open-source computational law project working on the 
                drafting of legal documents the way programmers develop software.
              </p>
              <Link 
                href="/about" 
                className="text-accent font-medium hover:text-accent-hover transition-colors"
              >
                Learn more about us →
              </Link>
            </div>
            <div className="lg:w-1/2">
              <div className="rounded-lg text-sm overflow-x-auto">
                <iframe src="https://jl4.legalese.com/?id=49ca8910-b83b-4ac9-8836-a120df51ea13" frame-border="0" width="100%" height="380px" loading="lazy" />
                <p className="text-sm text-gray-500 mt-3 italic">
                  Why can't legal contracts be as clear as code?
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* News/Press Section */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
            In the News
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a 
              href="https://www.straitstimes.com/singapore/focus-on-tech-and-the-law-at-new-smu-centre" 
              target="_blank"
              rel="noopener noreferrer"
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <p className="text-sm text-gray-500 mb-2">Straits Times • 2020</p>
              <h3 className="font-bold mb-2">SMU to create a working programming language for law</h3>
              <p className="text-gray-600 text-sm">First-of-its-kind research partnership</p>
            </a>
            <a 
              href="https://www.techinasia.com/singapore-legalese-audacious-goal-to-create-a-programming-language-for-the-legal-industry" 
              target="_blank"
              rel="noopener noreferrer"
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <p className="text-sm text-gray-500 mb-2">Tech in Asia • 2017</p>
              <h3 className="font-bold mb-2">Singapore startup's audacious goal</h3>
              <p className="text-gray-600 text-sm">Creating a programming language for the legal industry</p>
            </a>
            <a 
              href="https://www.artificiallawyer.com/2016/07/29/al-interview-software-is-eating-law-legalese-com/" 
              target="_blank"
              rel="noopener noreferrer"
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <p className="text-sm text-gray-500 mb-2">Artificial Lawyer • 2016</p>
              <h3 className="font-bold mb-2">Software is Eating Law</h3>
              <p className="text-gray-600 text-sm">Interview with Legalese</p>
            </a>
          </div>
          <div className="text-center mt-8">
            <Link 
              href="/media" 
              className="text-accent font-medium hover:text-accent-hover transition-colors"
            >
              View all press coverage →
            </Link>
          </div>
        </section>

        {/* Blog Section */}
        {recentPosts.length > 0 && (
          <section className="max-w-6xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
              Latest from the Blog
            </h2>
            <MoreStories posts={recentPosts} />
            <div className="text-center mt-8">
              <Link 
                href="/posts" 
                className="text-accent font-medium hover:text-accent-hover transition-colors"
              >
                View all posts →
              </Link>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="mb-20 text-center py-16 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Ready to explore computational law?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community, try L4, or get in touch to learn how we're building 
            the future of legal technology.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/community"
              className="bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-accent-hover transition-colors"
            >
              Join the Community
            </Link>
            <a 
              href="https://github.com/smucclaw/l4-ide" 
              target="_blank" 
              rel="noopener noreferrer"
              className="border-2 border-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition-colors"
            >
              Star on GitHub
            </a>
          </div>
        </section>
      </Container>
    </main>
  );
}
