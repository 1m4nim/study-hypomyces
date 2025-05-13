import * as fs from "fs";

const PDFDocument = require("pdfkit");

// JSONファイルを読み込む
const data = JSON.parse(fs.readFileSync("output.json", "utf-8"));

// PDF生成関数
const createPDF = (data: any[], filename: string = "output.pdf") => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filename));

  const margin = 30;
  const lineHeight = 15;
  const top = 50;
  let yPosition = top;

  // ヘッダー
  doc.fontSize(18).text("Hypomyces Fungi Data", margin, yPosition);
  yPosition += lineHeight;

  // テーブルのカラム名
  doc
    .fontSize(10)
    .text("Hypomyces Species", margin, yPosition, { width: 120 })
    .text("Host Genus", margin + 130, yPosition, { width: 120 })
    .text("Host Species", margin + 260, yPosition, { width: 120 })
    .text("Distribution", margin + 390, yPosition, { width: 120 })
    .text("Source", margin + 510, yPosition, { width: 120 })
    .text("Notes", margin + 630, yPosition, { width: 120 });
  yPosition += lineHeight;

  // 横線
  doc.moveTo(margin, yPosition).lineTo(700, yPosition).stroke();
  yPosition += 5;

  // 各データ行を描画
  data.forEach((entry) => {
    doc
      .fontSize(10)
      .text(entry.hypomyces_species, margin, yPosition, { width: 120 })
      .text(entry.host_genus, margin + 130, yPosition, { width: 120 })
      .text(entry.host_species, margin + 260, yPosition, { width: 120 })
      .text(entry.distribution, margin + 390, yPosition, { width: 120 })
      .text(entry.source, margin + 510, yPosition, { width: 120 })
      .text(entry.notes, margin + 630, yPosition, { width: 120 });

    yPosition += lineHeight;

    // ページがいっぱいになったら新しいページを作成
    if (yPosition > 750) {
      doc.addPage();
      yPosition = top;
    }
  });

  doc.end();
};

// PDFを生成
createPDF(data);
