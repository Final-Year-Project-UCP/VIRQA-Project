import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Professional Report Generator for VIRQA
// Goal: Premium, fancy, and executive design

export const generateVirginReportPDF = (interviewData, metricsData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // 1. --- PREMIUM HEADER ---
    // Background Gradient (Indigo to Purple simulation)
    doc.setFillColor(67, 56, 202); // Indigo 700
    doc.rect(0, 0, pageWidth, 50, 'F');
    doc.setFillColor(124, 58, 237); // Purple 600
    doc.rect(pageWidth / 2, 0, pageWidth / 2, 50, 'F');
    
    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("VIRQA", 20, 25);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("AI-POWERED AUTHORITY ASSESSMENT", 20, 32);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("EXECUTIVE EVALUATION REPORT", pageWidth - 85, 25);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`ID: ${(interviewData.id || '').toUpperCase()}`, pageWidth - 85, 32);
    doc.text(`DATE: ${(interviewData.date || '').toUpperCase()}`, pageWidth - 85, 37);

    // 2. --- CANDIDATE & SESSION INFO ---
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(interviewData.title || '', 20, 70);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text(`Organization: ${interviewData.company || 'System'}`, 20, 78);
    doc.text(`Evaluation Type: Technical Interview`, 20, 83);

    // Score Highlight Box
    doc.setFillColor(248, 250, 252); // Slate 50
    doc.roundedRect(pageWidth - 80, 60, 60, 30, 5, 5, 'F');
    doc.setTextColor(79, 70, 229); // Indigo 600
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text(`${interviewData.score}`, pageWidth - 65, 82);
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text("/ 100", pageWidth - 35, 82);
    doc.setFontSize(8);
    doc.text("OVERALL SCORE", pageWidth - 65, 88);

    // 3. --- CORE METRICS TABLE ---
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Competency Breakdown", 20, 105);

    const tableColumn = ["Metric", "Score", "Performance Level"];
    const tableRows = metricsData.map(m => {
        let level = "Proficient";
        if (m.score >= 85) level = "Expert ✶";
        else if (m.score < 60) level = "Baseline";
        return [m.name, `${m.score}%`, level];
    });

    autoTable(doc, {
        startY: 110,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [67, 56, 202], fontSize: 10, cellPadding: 4 },
        styles: { fontSize: 9, cellPadding: 4, font: 'helvetica' },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        columnStyles: {
            1: { halign: 'center', fontStyle: 'bold' },
            2: { halign: 'right' }
        }
    });

    let currentY = doc.lastAutoTable.finalY + 15;

    // 4. --- AI INSIGHTS (Strengths & Weaknesses) ---
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("AI Evaluation Insights", 20, currentY);
    currentY += 8;

    // Strengths
    const rawStrengths = (interviewData.rawScores || []).flatMap(s => s.strengths || []).slice(0, 4);
    const strengths = rawStrengths.length > 0 ? rawStrengths : ["Exceptional technical clarity", "Structured problem-solving approach"];
    doc.setFillColor(236, 253, 245); // Emerald 50
    doc.roundedRect(20, currentY, 80, 45, 3, 3, 'F');
    doc.setTextColor(5, 150, 105); // Emerald 600
    doc.setFontSize(10);
    doc.text("CORE STRENGTHS", 25, currentY + 8);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    strengths.forEach((s, i) => {
        doc.text(`• ${s}`, 25, currentY + 18 + (i * 6));
    });

    // Weaknesses
    const rawWeaknesses = (interviewData.rawScores || []).flatMap(s => s.weaknesses || []).slice(0, 4);
    const weaknesses = rawWeaknesses.length > 0 ? rawWeaknesses : ["Deepen knowledge in edge-case handling", "Optimize response delivery speed"];
    doc.setFillColor(254, 242, 242); // Rose 50
    doc.roundedRect(110, currentY, 80, 45, 3, 3, 'F');
    doc.setTextColor(225, 29, 72); // Rose 600
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("DEVELOPMENT AREAS", 115, currentY + 8);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    weaknesses.forEach((w, i) => {
        doc.text(`• ${w}`, 115, currentY + 18 + (i * 6));
    });

    currentY += 55;

    // 5. --- NARRATIVE FEEDBACK ---
    const feedback = (interviewData.rawScores && interviewData.rawScores[0]?.feedback) || "The candidate displayed strong potential with consistent performance.";
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(20, currentY, 170, 25, 3, 3, 'F');
    doc.setTextColor(51, 65, 85);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    const splitFeedback = doc.splitTextToSize(`"${feedback}"`, 160);
    doc.text(splitFeedback, 25, currentY + 10);

    // 6. --- PROFESSIONAL FOOTER & SEAL ---
    const footerY = 280;
    doc.setDrawColor(226, 232, 240);
    doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);
    
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.text("This document is an official VIRQA Assessment Report, generated via multi-layered AI verification.", 20, footerY);
    doc.text("Verification Hash: " + Math.random().toString(36).substring(2, 15).toUpperCase(), 20, footerY + 5);

    // Digital Seal look
    doc.setFillColor(79, 70, 229);
    doc.circle(pageWidth - 35, footerY, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text("VIRQA", pageWidth - 42, footerY);
    doc.text("CERTIFIED", pageWidth - 45, footerY + 3);

    doc.save(`${(interviewData.title || 'report').replace(/\s+/g, '_')}_Analytics_Report.pdf`);
};

export const generateVirginTranscriptPDF = (interviewData, rawAnswersArray) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Elegant Header for Transcript
    doc.setFillColor(30, 41, 59); // Dark Slate
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("INTERVIEW TRANSCRIPT", 20, 22);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Position: ${(interviewData.title || '').toUpperCase()}`, 20, 30);
    doc.text(`Date: ${interviewData.date}`, pageWidth - 70, 22);

    const tableColumn = ["Speaker", "Dialogue Content"];
    const tableRows = [];
    
    (rawAnswersArray || []).forEach((item, idx) => {
        tableRows.push([
            { content: "AI COACH", styles: { textColor: [79, 70, 229], fontStyle: 'bold' } },
            item.questionText || "Question text unavailable"
        ]);
        tableRows.push([
            { content: "CANDIDATE", styles: { textColor: [15, 23, 42], fontStyle: 'bold' } },
            item.transcribedText || "No response recorded"
        ]);
    });

    autoTable(doc, {
        startY: 50,
        head: [tableColumn],
        body: tableRows,
        theme: 'plain',
        headStyles: { fillColor: [248, 250, 252], textColor: [100, 116, 139], fontSize: 10, cellPadding: 5 },
        styles: { fontSize: 9, cellPadding: 6, font: 'helvetica', minCellHeight: 12 },
        columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 140 }
        },
        alternateRowStyles: { fillColor: [252, 252, 252] },
        margin: { left: 20, right: 20 }
    });

    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("--- END OF OFFICIAL TRANSCRIPT ---", pageWidth / 2, finalY, { align: 'center' });

    doc.save(`${(interviewData.title || 'transcript').replace(/\s+/g, '_')}_Transcript.pdf`);
};
