
import { Mail, Github, Linkedin } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gray-900/30 relative z-10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6">Get In Touch</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-8" />
        <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
          新しいプロジェクトのご相談や技術的なディスカッションなど、
          お気軽にご連絡ください。素晴らしいものを創造しましょう。
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <a
            href="mailto:haruta_tsukada@totor.co.jp"
            className="flex items-center space-x-3 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <Mail className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-cyan-400">haruta_tsukada@totor.co.jp</span>
          </a>
          <a
            href="https://github.com/hatamame"
            className="flex items-center space-x-3 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <Github className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-cyan-400">GitHub</span>
          </a>
          <a
            href="https://linkedin.com"
            className="flex items-center space-x-3 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <Linkedin className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-cyan-400">LinkedIn</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
