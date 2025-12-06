import mammoth from "mammoth";

export const readDocx = async (file) => {
  const arrayBuffer = await file.arrayBuffer();//convert into binary
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value; // extracted text
};
