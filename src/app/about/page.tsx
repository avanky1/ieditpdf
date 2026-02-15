import Link from "next/link";

const TOOL_COUNT = 18;

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">About iEditPDF</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mt-3 text-sm leading-relaxed max-w-2xl">
        iEditPDF is a free, open-source PDF toolkit built for people who care about privacy.
        Every operation - merging, splitting, signing, watermarking, and more - runs{" "}
        <strong className="text-neutral-700 dark:text-neutral-200">entirely inside your browser</strong>.
        Your files are never uploaded to any server. No accounts, no tracking, no strings attached.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-5">
          <h3 className="text-sm font-medium mb-2">100% Private</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Your documents stay on your device. Nothing is ever sent over the network - zero data collection, zero risk.
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-5">
          <h3 className="text-sm font-medium mb-2">Lightning Fast</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            No waiting for uploads and downloads. Processing happens instantly on your machine using modern browser APIs.
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-5">
          <h3 className="text-sm font-medium mb-2">Free Forever</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            No paywalls, no premium tiers, no limits. Every tool is completely free to use, as many times as you need.
          </p>
        </div>
      </div>

      <div className="mt-14">
        <h2 className="text-lg font-semibold tracking-tight">How It Works</h2>
        <ol className="mt-4 space-y-3 text-sm text-neutral-600 dark:text-neutral-400 list-decimal list-inside leading-relaxed max-w-2xl">
          <li><strong className="text-neutral-800 dark:text-neutral-200">Choose a tool</strong> - pick from {TOOL_COUNT} PDF operations on the <Link href="/" className="underline underline-offset-2 hover:text-neutral-900 dark:hover:text-neutral-100">home page</Link>.</li>
          <li><strong className="text-neutral-800 dark:text-neutral-200">Select your files</strong> - drag &amp; drop or browse. Files stay local.</li>
          <li><strong className="text-neutral-800 dark:text-neutral-200">Process &amp; download</strong> - everything happens in-browser. Grab your result instantly.</li>
        </ol>
      </div>

      <div className="mt-14">
        <h2 className="text-lg font-semibold tracking-tight">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-6 max-w-2xl">
          <div>
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Is my data really safe?</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
              Yes. iEditPDF is a static website with no backend. Your files are processed using JavaScript in your browser tab and are never transmitted anywhere.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Do I need to create an account?</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
              No. There are no accounts, no sign-ups, and no login walls. Just open the site and start editing.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Is there a file size limit?</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
              There is no hard limit set by iEditPDF. Performance depends on your device&apos;s memory and browser capabilities. Most PDFs up to 100 MB work smoothly.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">What browsers are supported?</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
              iEditPDF works on all modern browsers - Chrome, Firefox, Safari, and Edge. For the best experience, use the latest version.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-14 text-xs text-neutral-400 dark:text-neutral-600">
        Built with love using Next.js and pdf-lib. &copy; {new Date().getFullYear()} iEditPDF.
      </p>
    </div>
  );
}
