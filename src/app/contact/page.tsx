import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - iEditPDF",
  description:
    "Get in touch with the iEditPDF team. Report bugs, request features, or just say hello.",
};

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Contact Us</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mt-3 text-sm leading-relaxed max-w-2xl">
        Have a question, found a bug, or want to request a feature? We would
        love to hear from you. Since iEditPDF is a fully client-side tool, we do
        not collect any data - your message goes directly to us.
      </p>

      <div className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Get in Touch</h2>
        <div className="mt-4 space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <div>
            <p className="font-medium text-neutral-800 dark:text-neutral-200">
              Email
            </p>
            <p className="mt-0.5">
              <a
                href="mailto:avanish@tutamail.com"
                className="underline underline-offset-2 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                avanish@tutamail.com
              </a>
            </p>
          </div>
          <div>
            <p className="font-medium text-neutral-800 dark:text-neutral-200">
              GitHub
            </p>
            <p className="mt-0.5">
              Report issues or contribute on{" "}
              <a
                href="https://github.com/ieditpdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
