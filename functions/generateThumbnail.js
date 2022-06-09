// 참조 url
// https://partha-bhattacharya.medium.com/image-processing-using-google-cloud-function-10e65eb19d61

"use strict";
const { Storage } = require("@google-cloud/storage");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs-extra");
const os = require("os");
//destination bucket
const bucketName = {
  dst: "thumb-codecamp-storage13",
};
const storage = new Storage();
exports.processThumbImage = async (data, context) => {
  const file = data;
  const name = file.name;
  // 1. Check for image file
  if (name.includes("thumb@")) {
    return;
  }
  const scrBucket = storage.bucket(file.bucket);
  const dstBucket = storage.bucket(bucketName.dst);
  const workingDir = path.join(os.tmpdir(), "thumbs");
  const tmpFilePath = path.join(workingDir, file.name);
  // 2. Wait for temp directory to be ready
  await fs.ensureDir(workingDir);
  // 3. Download file to temp location
  await scrBucket.file(file.name).download({
    destination: tmpFilePath,
  });
  const sizes = [1280, 640, 320];
  const uploadPromises = sizes.map(async (size) => {
    let dir;
    if (size === 1280) dir = "l";
    if (size === 640) dir = "m";
    if (size === 320) dir = "s";
    const thumbName = `thumb@${size}_${file.name}`;
    const thumbPath = path.join(workingDir, thumbName);
    // 4. Create thumb image
    await sharp(tmpFilePath).resize(size).toFile(thumbPath);
    // 5. Upload thumb image
    return dstBucket.upload(thumbPath, {
      destination: dstBucket.file(`thumb/${dir}/${thumbName}`),
      metadata: {
        contentType: "image/png",
        cacheControl: "public,max-age=3600",
      },
    });
  });
  await Promise.all(uploadPromises);
  // 6. Remove temp directory
  await fs.remove(workingDir);
  return true;
};
