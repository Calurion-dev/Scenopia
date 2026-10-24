export interface PlanImage {
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Réduit l'image avant stockage local. 2200 px suffit largement pour
 * poser des éléments sur un plan, et évite de saturer localStorage.
 */
export async function fileToPlanImage(file: File): Promise<PlanImage> {
  const bitmap = await createImageBitmap(file);
  const maxSide = 2200;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Impossible de lire l'image");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.82),
    width,
    height,
  };
}
