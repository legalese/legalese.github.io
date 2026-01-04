import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { HeroPost } from "@/app/_components/hero-post";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllPosts } from "../lib/api";
import Link from "next/link";
import Image from "next/image";

export default function Index() {
  const allPosts = getAllPosts();
  const recentPosts = allPosts.slice(0, 3);

  return (
    <main>
      <Container>
        <Header />
        
        {/* Hero Section */}
        <section className="mb-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-6">
                Software is<br />
                <span className="text-pink-600">eating law</span>
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
                  className="bg-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors"
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
            <div className="lg:w-1/2">
              <Image
                src="/assets/images/know-all-men-by-these-presents-1000.png"
                alt="Legal document illustration"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </section>

        {/* What is L4 Section */}
        <section className="mb-20 py-16 -mx-5 px-5 bg-gray-50 rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-center">
            What is L4?
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-8 text-center">
              L4 is our domain-specific programming language for law. It treats legal rules 
              and contracts as executable specifications, allowing you to:
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3">Formalize rules with precision</h3>
                <p className="text-gray-600">
                  Express legal logic with mathematical precision, eliminating ambiguity 
                  and enabling automated analysis.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3">Test contracts against scenarios</h3>
                <p className="text-gray-600">
                  Run your contracts through test cases to verify behavior before deployment, 
                  just like software testing.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3">Find contradictions automatically</h3>
                <p className="text-gray-600">
                  Static analysis can prove that a contract is internally consistent, 
                  free of contradiction, and complete.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
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
                className="text-pink-600 font-medium hover:text-pink-800 transition-colors"
              >
                View on GitHub →
              </a>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="mb-20">
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
                className="text-pink-600 font-medium hover:text-pink-800 transition-colors"
              >
                Learn more about us →
              </Link>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`// why wasn't this just
if( seriesB < 32.5 ) { 
  conversion = 27.5 
}
else if( seriesB < 40 ) { 
  conversion = seriesB * 0.85 
}
else if( seriesB < 80 ) { 
  conversion = 40 
}
else if( seriesB < 100 ) { 
  conversion = 45 
}
else { 
  conversion = 50 
}`}</pre>
              </div>
              <p className="text-sm text-gray-500 mt-3 italic">
                Why can't legal contracts be as clear as code?
              </p>
            </div>
          </div>
        </section>

        {/* News/Press Section */}
        <section className="mb-20">
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
              className="text-pink-600 font-medium hover:text-pink-800 transition-colors"
            >
              View all press coverage →
            </Link>
          </div>
        </section>

        {/* Blog Section */}
        {recentPosts.length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
              Latest from the Blog
            </h2>
            <MoreStories posts={recentPosts} />
            <div className="text-center mt-8">
              <Link 
                href="/posts" 
                className="text-pink-600 font-medium hover:text-pink-800 transition-colors"
              >
                View all posts →
              </Link>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="mb-20 text-center py-16 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl">
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
              className="bg-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors"
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
