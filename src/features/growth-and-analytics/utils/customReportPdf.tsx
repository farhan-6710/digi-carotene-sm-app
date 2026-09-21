import { pdf } from "@react-pdf/renderer";

import { CustomReportPdfDocument } from "../components/custom-report/CustomReportPdfDocument";
import type { CustomReportDocumentData } from "../types/customReport";

export async function buildCustomReportPdfBlob(
  data: CustomReportDocumentData,
): Promise<Blob> {
  return pdf(<CustomReportPdfDocument data={data} />).toBlob();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}
