import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Reusable Utility to generate VIRQA Authored PDFs securely

export const generateVirginReportPDF = (interviewData, metricsData) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(79, 70, 229); // Indigo 600
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("VIRQA Authority Evaluation", 20, 25);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Official Interview Result Report`, 140, 25);

    // Metadata Section
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`Position: ${interviewData.title}`, 20, 60);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Company: ${interviewData.company}`, 20, 70);
    doc.text(`Date Evaluated: ${interviewData.date}`, 20, 80);
    doc.text(`Duration: ${interviewData.duration}`, 120, 80);

    // Score Board
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Overall Verified Score: ${interviewData.score} / 100`, 20, 100);

    // Metrics Table
    const tableColumn = ["Metric Evaluated", "Received Score", "Status"];
    const tableRows = [];

    metricsData.forEach(metric => {
        let status = "Pass";
        if (metric.score < 60) status = "Needs Work";
        else if (metric.score >= 80) status = "Excellent";

        tableRows.push([
            metric.name,
            `${metric.score} / 100`,
            status
        ]);
    });

    autoTable(doc, {
        startY: 115,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] },
        styles: { font: 'helvetica', fontSize: 11 },
        alternateRowStyles: { fillColor: [248, 250, 252] }
    });

    // Authenticity Footer
    const finalY = doc.lastAutoTable.finalY || 150;
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("This report is dynamically generated and certified by VIRQA Authority Systems.", 20, finalY + 20);
    doc.text(`Reference ID: ${interviewData.id}`, 20, finalY + 25);

    doc.save(`${interviewData.title.replace(/\s+/g, '_')}_VIRQA_Report.pdf`);
};

export const generateVirginTranscriptPDF = (interviewData, rawAnswersArray) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(16, 185, 129); // Emerald 500
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Official Interview Transcript", 20, 25);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`VIRQA Certified Document`, 150, 25);

    // Meta
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`Role: ${interviewData.title}`, 20, 60);

    // Table Content
    const tableColumn = ["Speaker", "Content", "Timestamp"];
    const tableRows = [];
    
    (rawAnswersArray || []).forEach((item, idx) => {
        tableRows.push([
            "AI Interviewer",
            item.questionText || "Question text unavailable",
            "N/A"
        ]);
        tableRows.push([
            "Candidate",
            item.transcribedText || "No response provided",
            item.answeredAt ? new Date(item.answeredAt).toLocaleTimeString() : "N/A"
        ]);
    });

    if (tableRows.length === 0) {
        tableRows.push(["System", "No transcript data found for this interview.", ""]);
    }

    autoTable(doc, {
        startY: 75,
        head: [tableColumn],
        body: tableRows,
        theme: 'plain',
        headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42] },
        styles: { font: 'helvetica', fontSize: 10, cellPadding: 5 },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 35 },
            1: { cellWidth: 120 }
        },
        alternateRowStyles: { fillColor: [250, 250, 250] } // very soft contrast
    });

    const finalY = doc.lastAutoTable.finalY || 100;
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text("END OF TRANSCRIPT.", 20, finalY + 15);
    doc.text("Certified by VIRQA Authority.", 20, finalY + 20);

    doc.save(`${interviewData.title.replace(/\s+/g, '_')}_Transcript.pdf`);
};
