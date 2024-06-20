import { FastifyRequest, FastifyReply } from 'fastify';
import { uploadFileToS3, downloadFileFromS3, deleteFileFromS3 } from '../service/fileService';

declare module 'fastify' {
  export interface FastifyRequest {
    parts: () => any;
  }
}

interface UploadRequestBody {
  fileName: string;
  companyId: string;
}

// Rota para upload de arquivo
export const uploadFile = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const parts = request.parts();
    let fileContent;
    let fileName;
    let companyId;

    for await (const part of parts) {
      if (part.file) {
        fileContent = await part.toBuffer();
        fileName = part.filename;
        companyId = part.fields.companyId.value;
      }
    }

    if (!fileContent || !fileName || !companyId) {
      return reply.status(400).send({ error: 'File content or filename missing' });
    }

    const data = await uploadFileToS3(fileContent, fileName, companyId);
    reply.status(201).send(data);
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
};

// Rota para download de arquivo
export const downloadFile = async (request: FastifyRequest<{ Body: UploadRequestBody }>, reply: FastifyReply) => {
  try {
    
    const { fileName, companyId } = request.body;
    console.log(fileName)
    console.log(companyId)

    const data = await downloadFileFromS3(fileName, companyId);
    reply.status(200).send(data);
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
};

// Rota para deletar arquivo
export const deleteFile = async (request: FastifyRequest<{ Body: UploadRequestBody }>, reply: FastifyReply) => {
  try {
    const { fileName, companyId } = request.body;
    console.log(fileName)
    console.log(companyId)

    if (!fileName || !companyId) {
      return reply.status(400).send({ error: 'File content or filename missing' });
    }

    await deleteFileFromS3(fileName, companyId);
    reply.status(200).send({ message: 'File deleted successfully' });
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
};
