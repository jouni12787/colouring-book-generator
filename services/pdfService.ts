
// @ts-nocheck - This is to allow for the global jsPDF object.
// In a real project, you would install the @types/jspdf package.

export const createColoringBookPdf = (
  coverImage: string,
  pageImages: string[],
  title: string,
  childName: string
): void => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'in',
    format: 'letter'
  });

  const pageWidth = 8.5;
  const pageHeight = 11;
  const margin = 0.5;
  const maxImgWidth = pageWidth - (margin * 2);
  const maxImgHeight = pageHeight - (margin * 2);

  const addImageToPage = (imgData: string, isCover: boolean) => {
    const img = new Image();
    img.src = imgData;
    img.onload = () => {
      const imgWidth = img.width;
      const imgHeight = img.height;
      const aspectRatio = imgWidth / imgHeight;

      let finalWidth, finalHeight;
      if (aspectRatio > (maxImgWidth / maxImgHeight)) {
        finalWidth = maxImgWidth;
        finalHeight = finalWidth / aspectRatio;
      } else {
        finalHeight = maxImgHeight;
        finalWidth = finalHeight * aspectRatio;
      }
      
      const x = (pageWidth - finalWidth) / 2;
      const y = isCover ? (pageHeight - finalHeight) / 2 : margin;
      
      doc.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

      if (isCover) {
         doc.setFontSize(24);
         doc.setFont('helvetica', 'bold');
         doc.text(title, pageWidth / 2, y + finalHeight + 0.5, { align: 'center' });
         doc.setFontSize(18);
         doc.setFont('helvetica', 'normal');
         doc.text(`Specially made for ${childName}!`, pageWidth / 2, y + finalHeight + 0.8, { align: 'center' });
      }
    };
  };

  addImageToPage(coverImage, true);

  pageImages.forEach(pageImage => {
    doc.addPage();
    addImageToPage(pageImage, false);
  });
  
  // Need to use a timeout to ensure images are loaded and added before saving.
  setTimeout(() => {
    doc.save(`${childName}_${title.replace(/\s+/g, '_')}_Coloring_Book.pdf`);
  }, 1000 * pageImages.length); // A rough estimate to allow images to load
};
   