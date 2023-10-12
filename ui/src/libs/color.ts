import { createCanvas, loadImage } from "canvas";

// const changeColor = async (imgSrc: string) => {
//   const img = await loadImage(imgSrc);
//   const canvas = createCanvas(img.width, img.height);
//   const ctx = canvas.getContext("2d");

//   ctx.drawImage(img, 0, 0, img.width, img.height);

//   const imageData = ctx.getImageData(0, 0, img.width, img.height);
//   const data = imageData.data;

//   for (let i = 0; i < data.length; i += 4) {
//     console.log(
//       `Pixel at index ${i / 4}: R=${data[i]}, G=${data[i + 1]}, B=${
//         data[i + 2]
//       }`
//     );
//     // Check if the color is not too dark or too light
//     if (!isColorCloseToBlackOrWhite(data[i], data[i + 1], data[i + 2], 50)) {
//       data[i] = (data[i] + 122) % 256; // R value
//       data[i + 1] = (data[i + 1] + 50) % 256; // G value
//       data[i + 2] = (data[i + 2] + 20) % 256; // B value
//     }
//   }
//   ctx.putImageData(imageData, 0, 0);
// };

export const changeColor = (
  imgSrc: string,
  r: number,
  g: number,
  b: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imgSrc;
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx === null) {
        console.error("Unable to get 2D context from canvas");
        return;
      }

      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        if (
          !isColorCloseToBlackOrWhite(data[i], data[i + 1], data[i + 2], 50)
        ) {
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
        }
      }
      ctx.putImageData(imageData, 0, 0);

      // Get the DataURL of the modified image
      const modifiedImageUrl = canvas.toDataURL("image/png");

      // Resolve the promise with the modified image URL
      resolve(modifiedImageUrl);
    };

    img.onerror = () => {
      reject(new Error("Image loading error"));
    };
  });
};

const isColorCloseToBlackOrWhite = (
  r: number,
  g: number,
  b: number,
  threshold: number
): boolean => {
  const distanceToWhite = Math.sqrt(
    Math.pow(255 - r, 2) + Math.pow(255 - g, 2) + Math.pow(255 - b, 2)
  );
  const distanceToBlack = Math.sqrt(
    Math.pow(r, 2) + Math.pow(g, 2) + Math.pow(b, 2)
  );

  return distanceToWhite < threshold || distanceToBlack < threshold;
};

// Usage
// changeColor("./icon.jpg");
