import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const accessKeyId = process.env.BUCKET_ACCESS_KEY_ID;
const secretAccessKey = process.env.BUCKET_SECRET_ACCESS_KEY;
const region = process.env.BUCKET_REGION;
const bucket = process.env.BUCKET_NAME;

export const uploadFileToS3 = async (fileContent: Blob, key: string): Promise<void> => {
  // Create S3 client
  const s3Client = new S3Client({
    region:region,
    credentials:{
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }
});

  // Set upload parameters
  const params = {
    Body: fileContent,
    Bucket: bucket,
    Key: key,
  };

  try {
    // Upload file to S3
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);
    console.log("File uploaded successfully", response);
  } catch (error) {
    console.error("Error uploading file", error);
  }
};