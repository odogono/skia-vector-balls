import * as ImageManipulator from 'expo-image-manipulator';

type Color = [number, number, number, number]; // [r, g, b, a] from 0-1

export const sampleImageColors = async (
  imageUri: string,
  columns: number,
  rows: number
): Promise<Color[]> => {
  // Resize the image to match our grid size
  const resizedImage = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: columns, height: rows } }],
    { base64: true }
  );

  if (!resizedImage.base64) {
    throw new Error('Failed to get base64 image data');
  }

  // Convert base64 to RGB values
  const binary = atob(resizedImage.base64);
  const colors: Color[] = [];

  // Process each pixel and normalize values to 0-1
  for (let i = 0; i < binary.length; i += 4) {
    colors.push([
      binary.charCodeAt(i) / 255, // r
      binary.charCodeAt(i + 1) / 255, // g
      binary.charCodeAt(i + 2) / 255, // b
      0.9 // fixed alpha
    ]);
  }

  return colors;
};
