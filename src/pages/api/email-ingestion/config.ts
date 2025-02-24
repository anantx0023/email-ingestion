import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const EmailConfigSchema = z.object({
  emailAddress: z.string().email("Invalid email address"),
  connectionType: z.enum(["IMAP", "POP3", "GMAIL", "OUTLOOK"], {
    errorMap: () => ({ message: "Invalid connection type" }),
  }),
  username: z.string().optional(),
  password: z.string().min(1, "Password is required"),
  host: z.string().optional(),
  port: z.number().positive().optional(),
  useSSL: z.boolean().default(true),
  active: z.boolean().default(true),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const body = EmailConfigSchema.parse(req.body);
      const existingConfig = await prisma.emailIngestionConfig.findUnique({
        where: { emailAddress: body.emailAddress },
      });

      if (existingConfig) {
        return res.status(409).json({ error: "Email configuration already exists" });
      }

      const emailConfig = await prisma.emailIngestionConfig.create({
        data: body,
      });

      return res.status(201).json(emailConfig);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }

      console.error("Error creating email config:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === 'GET') {
    try {
      const configs = await prisma.emailIngestionConfig.findMany();
      return res.status(200).json(configs);
    } catch (error) {
      console.error("Error fetching email configs:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      await prisma.emailIngestionConfig.delete({
        where: { id: String(id) },
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error deleting email config:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}