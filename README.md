# Simple Email Application

This is a Next.js project for email ingestion and PDF attachment storage. The application allows you to configure email accounts, fetch emails with PDF attachments, and store them locally.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL
- Git

### Clone the Repository

First, clone the repository from GitHub:

```bash
git clone https://github.com/your-username/simple-email-application.git
cd simple-email-application/email-ingestion
```

### Install Dependencies

Install the project dependencies using npm:

```bash
npm install
```

### Set Up Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/db_name?schema=public
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
EMAIL_USER=your_email
EMAIL_PASS=your_password
PDF_STORAGE_PATH=./pdfs
```

### Set Up the Database

Run the Prisma migrations to set up the database schema:

```bash
npx prisma migrate dev --name init
```

Generate the Prisma client:

```bash
npx prisma generate
```

### Run the Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/pages`: Contains the Next.js pages.
- `src/utils`: Contains utility functions, including the email fetcher.
- `prisma/schema.prisma`: Prisma schema file for database models.

## Learn More

To learn more about Next.js and Prisma, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Prisma Documentation](https://www.prisma.io/docs/) - Learn about Prisma features and API.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
