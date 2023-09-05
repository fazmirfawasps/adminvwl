import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
const numberToWords = require("number-to-words");

const generatePdf = (dashboardData, value, number, selectedDate, category) => {
  var dates = new Date(selectedDate);

  var day = dates.getDate();
  var month = dates.getMonth() + 1;
  var year = dates.getFullYear();

  var date =
    (month < 10 ? "0" : "") +
    month +
    "/" +
    (day < 10 ? "0" : "") +
    day +
    "/" +
    year;

  const textRepresentation = numberToWords.toWords(dashboardData.total);

  const myTable = document.getElementById("my-table");

  // Use html2canvas to create a canvas element
  html2canvas(myTable, { scale: 2 }).then((canvas) => {
    // Create a jsPDF instance
    const pdf = new jsPDF("p", "mm", "a4");

    // Calculate the height and width of the table
    const tableWidth = pdf.internal.pageSize.getWidth() - 20;
    const tableHeight = myTable.offsetHeight / 2 + 10;

    // set up the border and dimensions
    const border = 0.2;
    const x = 10;
    const y = 10;
    const height = 18;

    // draw the border
    pdf.setLineWidth(border);
    pdf.setDrawColor("#b3adc0");
    pdf.rect(x, y, tableWidth, height);

    // add the content
    const title = "kxence";
    const location1 = "Kerala";
    const location2 = "India";
    const content = "dummyContent";

    // dashboardData.hasOwnProperty(value)
    //   ? (value2 = dashboardData[value])
    //   : (value2 = "Dashboard");

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, x + border + 2, y + border + 3);

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text(location1, x + border + 2, y + border + 7);
    pdf.text(location2, x + border + 2, y + border + 11);
    pdf.text(content, x + border + 2, y + border + 15);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "light");
    pdf.text(value, x + tableWidth - border - 5, y + height - border - 5, {
      align: "right",
    });

    pdf.setFontSize(10);
    pdf.text("#", x + 1, y + 22);
    pdf.text(":" + number, x + 48, y + 22);
    pdf.text(value + "Date", x + 1, y + 26);
    pdf.text(":" + date, x + 48, y + 26);
    pdf.text("place of supply", x + 96, y + 22);
    pdf.text(":" + dashboardData?.billingAddressState, x + 144, y + 22);
    pdf.rect(x, y + 18, tableWidth / 2, height - 8);
    pdf.rect(x, y + 18, tableWidth, height - 8);

    pdf.rect(x, y + 28, tableWidth, height - 13);
    pdf.text("Bill To", x + 1, y + 31 + border);

    pdf.rect(x, y + 33, tableWidth, height - 10);
    pdf.text(
      category === "sales" ? dashboardData.customer : dashboardData.vendor,
      x + 1,
      y + 38
    );

    pdf.autoTable({
      startY: 51,
      html: myTable,
      tableWidth,
      tableHeight,
      cellPadding: 5,
      margin: { left: 10, right: 20, horizontal: "center" },
    });

    pdf.rect(x, pdf?.autoTable?.previous?.finalY, tableWidth, height + 50);
    pdf.rect(
      tableWidth / 2 + (x + x * 2),
      pdf?.autoTable?.previous?.finalY,
      tableWidth / 2 - x * 2,
      height + 4
    );
    pdf.rect(
      tableWidth / 2 + (x + x * 2),
      pdf?.autoTable?.previous?.finalY + height + 4,
      tableWidth / 2 - x * 2,
      height + 4
    );
    pdf.text("Total in words", x + 1, pdf?.autoTable?.previous?.finalY + 5);
    pdf.text(
      textRepresentation + " only",
      x + 1,
      pdf?.autoTable?.previous?.finalY + 9
    );

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      "SubTotal",
      tableWidth / 2 + (x + x * 2 + 20),
      pdf?.autoTable?.previous?.finalY + 4
    );
    pdf.text(
      dashboardData.subTotal.toString(),
      tableWidth / 2 + (x + x * 2 + 54),
      pdf?.autoTable?.previous?.finalY + 4
    );
    pdf.text(
      "Discount",
      tableWidth / 2 + (x + x * 2 + 20),
      pdf?.autoTable?.previous?.finalY + 8
    );
    pdf.text(
      dashboardData.discount.toString(),
      tableWidth / 2 + (x + x * 2 + 54),
      pdf?.autoTable?.previous?.finalY + 8
    );
    pdf.text(
      "CGST9",
      tableWidth / 2 + (x + x * 2 + 20),
      pdf?.autoTable?.previous?.finalY + 12
    );
    pdf.text(
      "value",
      tableWidth / 2 + (x + x * 2 + 54),
      pdf?.autoTable?.previous?.finalY + 12
    );
    pdf.text(
      "SGST9",
      tableWidth / 2 + (x + x * 2 + 20),
      pdf?.autoTable?.previous?.finalY + 16
    );
    pdf.text(
      "value",
      tableWidth / 2 + (x + x * 2 + 54),
      pdf?.autoTable?.previous?.finalY + 16
    );
    pdf.text(
      "Total",
      tableWidth / 2 + (x + x * 2 + 20),
      pdf?.autoTable?.previous?.finalY + 20
    );
    pdf.text(
      dashboardData.total.toString(),
      tableWidth / 2 + (x + x * 2 + 54),
      pdf?.autoTable?.previous?.finalY + 20
    );
    pdf.text(
      "Looking forward for your business",
      x + 1,
      pdf?.autoTable?.previous?.finalY + 20
    );

    pdf.text(
      "Terms & conditions",
      x + 1,
      pdf?.autoTable?.previous?.finalY + 26
    );
    pdf.text(
      "Terms and conditions",
      x + 1,
      pdf?.autoTable?.previous?.finalY + 30
    );
    pdf.text(
      "Signature",
      tableWidth / 2 + (x + x * 2 + 33),
      pdf?.autoTable?.previous?.finalY + 42
    );

    // Save the PDF
    // pdf.save(`${value}.pdf`);
    // Save the PDF as a data URL
    const pdfData = pdf.output("dataurl");
    const iframe = document.getElementById("pdf-preview");
    // Create an iframe and set the PDF data URL as the source
    // const iframe = document.createElement("iframe");
    iframe.src = pdfData;
    iframe.style.width = "100%";
    iframe.style.height = "600px";
    // Append the iframe to the document body or any desired container
    // document.body.appendChild(iframe);
    // preview.appendChild(iframe);
  });
};

export default generatePdf;
