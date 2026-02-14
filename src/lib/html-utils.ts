import jsPDF from "jspdf";

export async function htmlToPdf(html: string): Promise<Uint8Array> {
  const pdf = new jsPDF();
  const container = document.createElement("div");
  container.innerHTML = html;
  container.style.cssText =
    "position:absolute;left:-9999px;top:0;width:800px;font-family:sans-serif;font-size:14px;line-height:1.6;color:#000;";
  document.body.appendChild(container);

  const lines = pdf.splitTextToSize(container.innerText, 170);
  const pageHeight = pdf.internal.pageSize.getHeight() - 40;
  let y = 20;

  for (const line of lines) {
    if (y > pageHeight) {
      pdf.addPage();
      y = 20;
    }
    pdf.text(line, 20, y);
    y += 7;
  }

  document.body.removeChild(container);
  return new Uint8Array(pdf.output("arraybuffer"));
}
