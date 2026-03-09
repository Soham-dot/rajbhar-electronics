# Rajbhar Electronics

A production-level website for Rajbhar Electronics — Mumbai's most trusted TV repair service since 1996, based in Chunabhatti.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (icons)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build & Deploy

```bash
npm run build
npm start
```

## Project Structure

```
rajbhar-electronics/
├── app/
│   ├── layout.tsx          # Root layout with metadata, Inter font
│   ├── page.tsx            # Home page composing all sections
│   └── globals.css         # Global styles + Tailwind directives
├── components/
│   ├── TopBar.tsx           # Location announcement bar
│   ├── Navbar.tsx           # Navigation with mobile menu
│   ├── Hero.tsx             # Hero section
│   ├── Stats.tsx            # Trust/stats counters
│   ├── Services.tsx         # Services grid
│   ├── HowItWorks.tsx       # Process steps
│   ├── Reviews.tsx          # Testimonials
│   ├── Contact.tsx          # Contact form + info
│   └── Footer.tsx           # Footer
```
