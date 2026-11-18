// src/lib/pdf.ts
// Utility to generate a printable PDF with cards for each CodeItem.
// Each PDF page is A4 (210 mm × 297 mm) and contains a grid of 2 columns × 3 rows (6 cards per page).
// Cards have a 2px dashed border and are formatted for RTL Arabic text for easy printing and cutting.
// Includes a direct scannable QR Code pointing to https://emadhussein.com/

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import { CodeItem } from "@/types/dashboard";

const PLATFORM_URL = "https://emadhussein.com/";

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Export an array of codes to a downloadable PDF.
 * Each page contains 6 cards (2 columns × 3 rows) on an A4 page.
 * The PDF downloads directly without window.print().
 */
export async function exportCodesToPdf(
  codes: CodeItem[],
  fileName?: string
): Promise<void> {
  if (!codes || codes.length === 0) return;

  // Generate QR Code data URL once (linked to the platform URL)
  let qrDataUrl = "";
  try {
    qrDataUrl = await QRCode.toDataURL(PLATFORM_URL, {
      margin: 1,
      width: 200,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    });
  } catch {
    qrDataUrl = "";
  }

  // Ensure fonts are ready before html2canvas rendering
  if (typeof document !== "undefined" && document.fonts) {
    try {
      await document.fonts.load("bold 14px 'Cairo'");
      await document.fonts.load("900 30px 'Courier New'");
      await document.fonts.ready;
    } catch {
      // Continue if font check is not supported
    }
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  // 6 cards per page (2 columns × 3 rows) for spacious, large and clear printing
  const COLS = 2;
  const ROWS = 3;
  const CARDS_PER_PAGE = COLS * ROWS;

  // Build an A4 container for 6 cards (794px × 1123px represents standard A4 at 96 DPI)
  const buildPageContainer = (cardsSlice: CodeItem[]): HTMLDivElement => {
    const container = document.createElement("div");
    container.style.width = "794px";
    container.style.height = "1123px";
    container.style.boxSizing = "border-box";
    container.style.padding = "24px 22px";
    container.style.background = "#ffffff";
    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(2, 364px)";
    container.style.gridTemplateRows = "repeat(3, 345px)";
    container.style.columnGap = "18px";
    container.style.rowGap = "18px";
    container.style.direction = "rtl";
    container.style.position = "absolute";
    container.style.left = "0";
    container.style.top = "0";
    container.style.zIndex = "-99999";
    container.style.pointerEvents = "none";
    container.style.fontFamily = "'Cairo', Tahoma, Arial, sans-serif";

    cardsSlice.forEach((c) => {
      const card = document.createElement("div");
      card.style.width = "364px";
      card.style.height = "345px";
      card.style.border = "2px dashed #4b5563";
      card.style.borderRadius = "16px";
      card.style.padding = "16px 18px";
      card.style.boxSizing = "border-box";
      card.style.background = "#ffffff";
      card.style.color = "#111827";
      card.style.display = "flex";
      card.style.flexDirection = "column";
      card.style.justifyContent = "space-between";
      card.style.direction = "rtl";

      const lessonName = c.lessonTitle || "كود عام (شامل المنهج)";
      const groupName = c.groupName || "عام";
      const validity = c.validityDays || 30;

      card.innerHTML = `
        <!-- 1. Card Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #e2e8f0; padding-bottom:10px;">
          <div style="text-align:right; direction:rtl;">
            <div style="font-size:14px; font-weight:800; color:#FF6A00; line-height:1.3; font-family:'Cairo',Tahoma,Arial,sans-serif;">منصة أ/ عماد حسين التعليمية</div>
            <div style="font-size:11.5px; font-weight:700; color:#334155; margin-top:2px; line-height:1.2; font-family:'Cairo',Tahoma,Arial,sans-serif;">كود تفعيل ودخول الحصة</div>
          </div>
          <div style="background:#0f172a; color:#ffffff; font-size:12px; font-weight:900; padding:4px 12px; border-radius:8px; letter-spacing:1px; flex-shrink:0;">
            EH
          </div>
        </div>

        <!-- 2. Card Center: Large Direct Code Box -->
        <div style="background:#f8fafc; border:2px solid #e2e8f0; border-radius:14px; padding:12px 10px; margin:8px 0; text-align:center;">
          <div style="display:flex; justify-content:center; align-items:center; margin-bottom:4px;">
            <span style="font-size:11.5px; color:#64748b; font-weight:700; direction:rtl; text-align:right; font-family:'Cairo',Tahoma,Arial,sans-serif;">
              رمز الدخول المباشر
            </span>
          </div>
          <div style="font-family:'Courier New', Courier, monospace, sans-serif; font-size:30px; font-weight:900; color:#FF6A00; letter-spacing:4px; line-height:1.2; direction:ltr; text-align:center;">
            ${escapeHtml(c.code)}
          </div>
        </div>

        <!-- 3. Card Footer: Details & Large QR Code (Using robust 2-cell table layout to avoid html2canvas flex bugs) -->
        <div style="border-top:1.5px solid #e2e8f0; padding-top:10px;">
          <table style="width:100%; border-collapse:collapse; direction:rtl;" border="0">
            <tr>
              <!-- Right Cell: Text Info -->
              <td style="vertical-align:middle; text-align:right; direction:rtl; padding-left:10px;">
                <div style="margin-bottom:6px; font-size:12px; font-weight:800; color:#0f172a; line-height:1.4; font-family:'Cairo',Tahoma,Arial,sans-serif;">
                  الدفعة: ${escapeHtml(groupName)}
                </div>
                <div style="margin-bottom:6px; font-size:12px; font-weight:700; color:#4338ca; line-height:1.4; font-family:'Cairo',Tahoma,Arial,sans-serif;">
                  المحتوى: ${escapeHtml(lessonName)}
                </div>
                <div style="font-size:11px; font-weight:600; color:#64748b; line-height:1.4; font-family:'Cairo',Tahoma,Arial,sans-serif;">
                  صلاحية الكود: ${validity} يوم ${c.lessonDuration && c.lessonDuration !== "—" ? `• مدة: ${escapeHtml(c.lessonDuration)}` : ""}
                </div>
              </td>

              <!-- Left Cell: Big Scannable QR Code -->
              <td style="width:78px; vertical-align:middle; text-align:center; direction:rtl;">
                <div style="display:inline-block; text-align:center;">
                  ${
                    qrDataUrl
                      ? `<img src="${qrDataUrl}" style="width:68px; height:68px; border:1.5px solid #cbd5e1; border-radius:8px; padding:2px; background:#ffffff; display:block; margin:0 auto;" alt="QR" />`
                      : `<div style="width:68px; height:68px; border:1.5px solid #cbd5e1; border-radius:8px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; font-size:10px; color:#94a3b8; margin:0 auto;">QR</div>`
                  }
                  <div style="font-size:9px; font-weight:700; color:#475569; text-align:center; margin-top:4px; white-space:nowrap; font-family:'Cairo',Tahoma,Arial,sans-serif;">
                    امسح للدخول
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      `;

      container.appendChild(card);
    });

    return container;
  };

  // Render each page with html2canvas and append to the PDF
  for (let i = 0; i < codes.length; i += CARDS_PER_PAGE) {
    const chunk = codes.slice(i, i + CARDS_PER_PAGE);
    const pageContainer = buildPageContainer(chunk);
    document.body.appendChild(pageContainer);

    try {
      const canvas = await html2canvas(pageContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        x: 0,
        y: 0,
        width: 794,
        height: 1123,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL("image/png");

      if (i > 0) {
        doc.addPage();
      }

      // 4mm safety margin all around to prevent any border or header clipping
      doc.addImage(imgData, "PNG", 4, 4, 202, 289, undefined, "FAST");
    } finally {
      if (pageContainer.parentNode) {
        pageContainer.parentNode.removeChild(pageContainer);
      }
    }
  }

  const outputName =
    fileName || `اكواد_المنصة_${new Date().toISOString().slice(0, 10)}.pdf`;

  doc.save(outputName);
}
