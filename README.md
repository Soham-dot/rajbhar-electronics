# Rajbhar Electronics

A production-level website for Rajbhar Electronics — Mumbai's most trusted TV repair service since 1996, based in Chunabhatti.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (icons)

## Getting Started

> ⚠️ **Important (Windows/OneDrive users):**
>
> If this project is stored inside a OneDrive-synced folder, Next.js builds can fail due to Windows symlink/reparse-point issues. For best results, copy this project to a non-synced directory such as `C:\Projects\rajbhar-electronics` and run the commands from there.

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
│   └cd "C:\Users\Admin\OneDrive\Desktop\GITHUB WEBSITE PROJECT\rajbhar-electronics-main\rajbhar-electronics-main"
git initgit remote add origin https://github.com/Soham-dot/rajbhar-electronics.git
git branch -M main
git push -u origin main── Footer.tsx           # Footer
```
