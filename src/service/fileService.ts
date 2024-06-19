import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

// Função para upload de arquivo no S3
export const uploadFileToS3 = async (fileContent, fileName, companyId) => {
  console.log('fileName: ', fileName)
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${companyId}/messages/${fileName}`,
    Body: fileContent,
  };
  console.log('params: ', params)
  const command = new PutObjectCommand(params);
  return await s3Client.send(command);
};

// Função para download de arquivo do S3
export const downloadFileFromS3 = async (fileName, companyId) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${companyId}/messages/${fileName}`,
  };
  console.log('params: ', params)
  const command = new GetObjectCommand(params);
  const data = await s3Client.send(command);
  return data.Body;
};

// Função para deletar arquivo do S3
export const deleteFileFromS3 = async (filename, companyId) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${companyId}/messages/${filename}`,
  };
  const command = new DeleteObjectCommand(params);
  return await s3Client.send(command);
};