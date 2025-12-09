// pdfUtils.js
import * as pdfjsLib from 'pdfjs-dist';

// 1. SET WORKER VERSION DYNAMICALLY
// This ensures the worker version always matches  installed local version.
// We use unpkg as it reliably hosts specific versions.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export const readPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // 2. LOAD DOCUMENT
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = '';

    // 3. EXTRACT TEXT FROM PAGES
    // Using a loop to keep order correct
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      // Join the text items. Adding a space ensures words don't merge.
      const pageText = textContent.items.map((item) => item.str).join(' ');
      
      fullText += pageText + '\n\n';
    }
    return fullText;
  } catch (error) {
    console.error("Error reading PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
};

//Refrence:https://mozilla.github.io/pdf.js/examples/