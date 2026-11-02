// Creates a PDF invoice in the browser (jsPDF) for a confirmed / completed booking
export async function downloadInvoice(b) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const invoiceNo = "INV-" + String(b._id).slice(-8).toUpperCase();
  const rate = b.hours ? b.totalPrice / b.hours : 0;

  // header
  doc.setFontSize(24);
  doc.setTextColor(232, 89, 12);
  doc.text("StudioSpace", 20, 25);
  doc.setFontSize(11);
  doc.setTextColor(90);
  doc.text("Booking Invoice", 20, 33);
  doc.text(`Invoice No: ${invoiceNo}`, 190, 25, { align: "right" });
  doc.text(`Issued: ${new Date().toLocaleDateString()}`, 190, 33, { align: "right" });
  doc.setDrawColor(220);
  doc.line(20, 38, 190, 38);

  // helper to print "label ..... value"
  let y = 52;
  const row = (label, value) => {
    doc.setTextColor(120);
    doc.text(label, 20, y);
    doc.setTextColor(20);
    doc.text(String(value), 190, y, { align: "right" });
    y += 10;
  };

  doc.setFontSize(13);
  doc.setTextColor(20);
  doc.text("Guest", 20, y);
  y += 10;
  doc.setFontSize(11);
  row("Name", b.userName);
  row("Email", b.userEmail);

  y += 4;
  doc.setFontSize(13);
  doc.setTextColor(20);
  doc.text("Studio", 20, y);
  y += 10;
  doc.setFontSize(11);
  row("Studio", b.studioTitle);
  row("Location", b.location);
  row("Host", b.ownerEmail);

  y += 4;
  doc.setFontSize(13);
  doc.setTextColor(20);
  doc.text("Booking Details", 20, y);
  y += 10;
  doc.setFontSize(11);
  row("Date", b.date);
  row("Time", `${b.startTime} - ${b.endTime}`);
  row("Hours", +Number(b.hours).toFixed(2));
   row("Hourly rate", `$${+rate.toFixed(2)}`);
  row("Status", b.status);

  doc.line(20, y, 190, y);
  y += 12;
  doc.setFontSize(15);
  doc.setTextColor(232, 89, 12);
  doc.text("Total", 20, y);
  doc.text(`$${b.totalPrice}`, 190, y, { align: "right" });

  doc.setFontSize(9);
  doc.setTextColor(130);
  doc.text("Thank you for booking with StudioSpace. This is a computer generated invoice.", 105, 280, { align: "center" });

  doc.save(`${invoiceNo}.pdf`);
}