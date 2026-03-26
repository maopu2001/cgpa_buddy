export function makePdfResponse(pdfBytes: Uint8Array): Response {
  const pdfBinary = new Uint8Array(pdfBytes.length);
  pdfBinary.set(pdfBytes);

  return new Response(pdfBinary, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="cgpa-summary.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
