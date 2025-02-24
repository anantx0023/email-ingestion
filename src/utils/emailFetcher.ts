import imaps from "imap-simple";
import { simpleParser } from "mailparser";
import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fetchEmails = async () => {
  try {
    const emailConfigs: { id: number; emailAddress: string; lastChecked: Date; createdAt: Date; updatedAt: Date; connectionType: string; username?: string; password?: string; host?: string; port?: number; useSSL?: boolean; }[] = await prisma.emailIngestionConfig.findMany({
      where: { active: true },
    });

    for (const config of emailConfigs) {
      try {
        if (config.connectionType === "IMAP" || config.connectionType === "POP3") {
          const imapConfig = {
            imap: {
              user: config.username || config.emailAddress,
              password: config.password,
              host: config.host,
              port: config.port,
              tls: config.useSSL,
              authTimeout: 10000,
              tlsOptions: { rejectUnauthorized: false },
            },
          };

          const connection = await imaps.connect(imapConfig);
          console.log(`Connected to ${config.emailAddress}`);

          await connection.openBox("INBOX");
          const messages = await connection.search(["UNSEEN"], {
            bodies: ["HEADER", "TEXT"],
            struct: true,
          });

          console.log(`Found ${messages.length} unread messages`);

          for (const message of messages) {
            try {
              const all = message.parts.find((part) => part.which === "TEXT");
              if (!all) continue;

              const parsed = await simpleParser(all.body);

              if (parsed.attachments && parsed.attachments.length > 0) {
                for (const attachment of parsed.attachments) {
                  if (attachment.contentType === "application/pdf") {
                    // Create pdfs directory if it doesn't exist
                    const pdfDir = path.join(process.cwd(), "pdfs");
                    await fs.mkdir(pdfDir, { recursive: true });

                    // Generate unique filename to prevent overwrites
                    const uniqueFilename = `${Date.now()}-${attachment.filename}`;
                    const pdfPath = path.join(pdfDir, uniqueFilename);

                    await fs.writeFile(pdfPath, attachment.content);
                    console.log(`Saved PDF: ${uniqueFilename}`);

                    await prisma.emailAttachment.create({
                      data: {
                        emailConfigId: config.id,
                        fromAddress: parsed.from?.text || "Unknown",
                        dateReceived: parsed.date || new Date(),
                        subject: parsed.subject || "No Subject",
                        attachmentFileName: uniqueFilename,
                        path: pdfPath,
                      },
                    });
                  }
                }
              }

              // Mark message as seen after processing
              await connection.addFlags(message.attributes.uid, "\\Seen");
            } catch (messageError) {
              console.error(`Error processing message: ${messageError}`);
              continue; // Continue with next message even if one fails
            }
          }

          await connection.end();
        } else if (config.connectionType === "GMAIL") {
          // Implement Gmail API connection and email fetching logic here
        } else if (config.connectionType === "OUTLOOK") {
          // Implement Outlook/Graph API connection and email fetching logic here
        }
        // Add more connection types as needed
      } catch (configError) {
        console.error(`Error processing config ${config.emailAddress}: ${configError}`);
        continue; // Continue with next config even if one fails
      }
    }
  } catch (error) {
    console.error("Fatal error in fetchEmails:", error);
    throw error;
  }
};

export default fetchEmails;