import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useUIStore } from "@/stores/useUIStore";
import { useMessageStore } from "@/stores/useMessageStore";
import { ExternalLink } from "lucide-react";

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const { setPreviewOpen, setSidebarOpen } = useUIStore();
  const { detectedUrl, clearDetectedUrl } = useMessageStore();

  // Function to handle URL clicks
  const handleUrlClick = (url: string) => (e: React.MouseEvent) => {
    e.preventDefault();

    // Set detected URL to the clicked URL
    clearDetectedUrl(); // Clear previous URL first

    // Open the URL in the preview window and hide sidebar
    setPreviewOpen(true);
    setSidebarOpen(false);

    // Wait a bit to ensure state updates before setting the URL
    setTimeout(() => {
      useMessageStore.setState({ detectedUrl: url });
    }, 100);
  };

  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <pre
          {...props}
          className={`${className} text-sm w-[80dvw] md:max-w-[500px] overflow-x-scroll bg-zinc-100 p-3 rounded-lg mt-2 dark:bg-zinc-800`}
        >
          <code className={match[1]}>{children}</code>
        </pre>
      ) : (
        <code
          className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`}
          {...props}
        >
          {children}
        </code>
      );
    },
    ol: ({ node, children, ...props }: any) => {
      return (
        <ol className="list-decimal list-outside ml-4" {...props}>
          {children}
        </ol>
      );
    },
    li: ({ node, children, ...props }: any) => {
      return (
        <li className="py-1" {...props}>
          {children}
        </li>
      );
    },
    ul: ({ node, children, ...props }: any) => {
      return (
        <ul className="list-decimal list-outside ml-4" {...props}>
          {children}
        </ul>
      );
    },
    strong: ({ node, children, ...props }: any) => {
      return (
        <span className="font-semibold" {...props}>
          {children}
        </span>
      );
    },
    a: ({ node, href, children, ...props }: any) => {
      const isUrl =
        href && (href.startsWith("http://") || href.startsWith("https://"));
      const isHighlighted = detectedUrl === href;

      return (
        <a
          className={`inline-flex items-center gap-1 rounded px-1 py-0.5 ${
            isHighlighted
              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
              : "text-blue-500 hover:underline hover:bg-blue-50 dark:hover:bg-blue-900/30"
          }`}
          target="_blank"
          rel="noreferrer"
          onClick={isUrl ? handleUrlClick(href) : undefined}
          {...props}
        >
          {children}
          {isUrl && <ExternalLink className="h-3 w-3" />}
        </a>
      );
    },
    h1: ({ node, children, ...props }: any) => {
      return (
        <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ node, children, ...props }: any) => {
      return (
        <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ node, children, ...props }: any) => {
      return (
        <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
          {children}
        </h3>
      );
    },
    h4: ({ node, children, ...props }: any) => {
      return (
        <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
          {children}
        </h4>
      );
    },
    h5: ({ node, children, ...props }: any) => {
      return (
        <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
          {children}
        </h5>
      );
    },
    h6: ({ node, children, ...props }: any) => {
      return (
        <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
          {children}
        </h6>
      );
    },
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
