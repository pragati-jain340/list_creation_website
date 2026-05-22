# ✈️ Collaborative Packing List

A beautiful, modern, and premium collaborative packing list web application. Organize your travels, share lists with friends or family, and collaborate in real-time or via a feedback-driven suggestions system.

🚀 **Live URL**: [https://list-creation-website.vercel.app/](https://list-creation-website.vercel.app/)

---

## ✨ Features

- 👥 **Real-Time Collaboration**: Share your lists with others and see updates instantaneously.
- 💡 **Suggest Mode**: Allow friends or family to suggest additions, edits, or removals without directly altering your master list until you approve.
- 📝 **Inline Details & Dual-Input Editing**: Easily double-click or edit items to tweak the title and notes/messages simultaneously.
- 🎨 **Premium Modern Design**: Built with clean HSL custom colors, glassmorphism, responsive components, and fluid micro-animations.
- 🗂️ **Drag & Drop Reordering**: Seamlessly organize packing items within and across categories.
- 📱 **Fully Responsive Layout**: Built with a mobile-first philosophy to work beautifully on phones, tablets, and desktops alike.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions)
- **Styling**: Tailwind CSS, shadcn/ui, Lucide Icons
- **Database / ORM**: Drizzle ORM (highly optimized for low-latency queries)
- **State & Drag-and-Drop**: @dnd-kit/sortable, Zustand
- **Deployment**: Vercel

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/pragati-jain340/list_creation_website.git
cd list_creation_website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the root directory and configure your database and authentication variables:
```env
# Example Env Configuration
DATABASE_URL="your-database-url"
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
