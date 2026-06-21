import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children }: { children: string }) {
  return (
    <div
      className="prose prose-invert prose-lg max-w-none
      prose-headings:font-display prose-headings:tracking-[-0.02em]
      prose-h2:mt-12 prose-h2:text-3xl prose-h2:font-semibold
      prose-h3:mt-8 prose-h3:text-2xl prose-h3:font-semibold
      prose-p:text-white/75 prose-p:leading-relaxed
      prose-strong:text-white
      prose-a:text-[var(--lime)] prose-a:no-underline hover:prose-a:underline
      prose-li:text-white/75
      prose-blockquote:border-l-[var(--lime)] prose-blockquote:text-white/70
      prose-code:text-[var(--lime)] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
      prose-code:before:content-none prose-code:after:content-none
      prose-hr:border-white/10
    "
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
