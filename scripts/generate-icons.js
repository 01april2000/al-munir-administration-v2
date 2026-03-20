const fs = require('fs');
const path = require('path');

// Simple PNG generation using base64 encoded PNG data
// This creates a basic green square with a simple person icon

function createPNGIcon(size, outputPath) {
  // Create a simple PNG header and data
  // For simplicity, we'll create a basic colored square
  
  const width = size;
  const height = size;
  
  // PNG signature
  const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // Create IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth
  ihdrData.writeUInt8(6, 9); // color type (RGBA)
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace
  
  const ihdrChunk = createChunk('IHDR', ihdrData);
  
  // Create IDAT chunk with simple image data
  const imageData = createImageData(width, height);
  const idatChunk = createChunk('IDAT', imageData);
  
  // Create IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  // Combine all chunks
  const pngBuffer = Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
  
  fs.writeFileSync(outputPath, pngBuffer);
  console.log(`Created ${outputPath}`);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const typeBuffer = Buffer.from(type, 'ascii');
  
  const crc = calculateCRC(Buffer.concat([typeBuffer, data]));
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);
  
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function createImageData(width, height) {
  // Create a simple green square with a white person icon
  const bytesPerPixel = 4;
  const rowSize = width * bytesPerPixel + 1; // +1 for filter byte
  const totalSize = rowSize * height;
  const data = Buffer.alloc(totalSize);
  
  // Background color (emerald green: #10b981 = R:16, G:185, B:129)
  const bgR = 16, bgG = 185, bgB = 129;
  
  // Foreground color (white)
  const fgR = 255, fgG = 255, fgB = 255;
  
  for (let y = 0; y < height; y++) {
    const rowStart = y * rowSize;
    data[rowStart] = 0; // filter type (none)
    
    for (let x = 0; x < width; x++) {
      const pixelStart = rowStart + 1 + x * bytesPerPixel;
      
      // Check if pixel is in the person icon area
      const cx = width / 2;
      const cy = height / 2;
      const dx = x - cx;
      const dy = y - cy;
      
      // Circle for head
      const headRadius = width * 0.17;
      const headCenterY = height * 0.42;
      const headDy = y - headCenterY;
      const inHead = (dx * dx + headDy * headDy) <= (headRadius * headRadius);
      
      // Rounded rectangle for body
      const bodyWidth = width * 0.5;
      const bodyHeight = height * 0.35;
      const bodyTop = height * 0.6;
      const bodyBottom = bodyTop + bodyHeight;
      const bodyLeft = cx - bodyWidth / 2;
      const bodyRight = cx + bodyWidth / 2;
      const inBody = x >= bodyLeft && x <= bodyRight && y >= bodyTop && y <= bodyBottom;
      
      // Rounded corners for body
      const cornerRadius = width * 0.08;
      let inBodyCorners = inBody;
      if (inBodyCorners) {
        // Top-left corner
        if (x < bodyLeft + cornerRadius && y < bodyTop + cornerRadius) {
          const cdx = x - (bodyLeft + cornerRadius);
          const cdy = y - (bodyTop + cornerRadius);
          inBodyCorners = (cdx * cdx + cdy * cdy) <= (cornerRadius * cornerRadius);
        }
        // Top-right corner
        else if (x > bodyRight - cornerRadius && y < bodyTop + cornerRadius) {
          const cdx = x - (bodyRight - cornerRadius);
          const cdy = y - (bodyTop + cornerRadius);
          inBodyCorners = (cdx * cdx + cdy * cdy) <= (cornerRadius * cornerRadius);
        }
      }
      
      if (inHead || inBodyCorners) {
        data[pixelStart] = fgR;
        data[pixelStart + 1] = fgG;
        data[pixelStart + 2] = fgB;
        data[pixelStart + 3] = 255;
      } else {
        data[pixelStart] = bgR;
        data[pixelStart + 1] = bgG;
        data[pixelStart + 2] = bgB;
        data[pixelStart + 3] = 255;
      }
    }
  }
  
  // Compress the data (simple deflate simulation)
  // For a proper implementation, you'd use zlib
  const zlib = require('zlib');
  return zlib.deflateSync(data);
}

function calculateCRC(buffer) {
  let crc = 0xFFFFFFFF;
  
  for (let i = 0; i < buffer.length; i++) {
    crc ^= buffer[i];
    
    for (let j = 0; j < 8; j++) {
      if (crc & 1) {
        crc = (crc >>> 1) ^ 0xEDB88320;
      } else {
        crc >>>= 1;
      }
    }
  }
  
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Generate icons
const publicDir = path.join(__dirname, '..', 'public');
createPNGIcon(192, path.join(publicDir, 'icon-192.png'));
createPNGIcon(512, path.join(publicDir, 'icon-512.png'));

console.log('Icons generated successfully!');
