# 🌐 SocialConnect

A modern, Instagram-style social media web app built with **Next.js**, **Supabase**, and **Tailwind CSS**.  
Share moments, connect with people, and explore a vibrant community — all in real-time.

<p align="center">
  <a href="https://socialconnect-bptg.vercel.app/login"><strong>View Live Deployed Website »</strong></a>
</p>
---

## 🚀 Features

- 🔐 **Authentication:** Email/password & Google OAuth (Supabase Auth)  
- 👤 **Profiles:** Avatar, bio, location, followers/following/post counts  
- 📝 **Posts:** Text + images, categories, likes & comments  
- 📰 **Personalized Feed:** Posts from people you follow  
- 🌎 **Explore:** Discover new users & posts with search  
- 🔗 **Follow System:** Follow/unfollow with counts  
- ❤️ **Likes & Comments:** Add, delete, like/unlike posts  
- 🔔 **Notifications:** Real-time for follows, likes & comments  
- 🛡 **Admin Dashboard:** Manage stats, users & posts (admin only)  
- 📱 **Responsive UI:** Mobile-first, styled with Tailwind & shadcn/ui  

---

## 🛠️ Tech Stack

- **Frontend/Backend:** Next.js (App Router, TypeScript)  
- **Database:** Supabase (PostgreSQL)  
- **Auth:** Supabase Auth (JWT, Google OAuth)  
- **Storage:** Supabase Storage (images)  
- **Realtime:** Supabase Realtime (notifications)  
- **UI:** Tailwind CSS, shadcn/ui, Lucide icons  
- **Deployment:** Vercel  

---

## 📦 Project Structure

## 📂 File Structure

```bash
/socialconnect
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx                # Home or redirect to /feed
│   ├── feed/page.tsx
│   ├── explore/page.tsx
│   ├── notifications/page.tsx
│   ├── settings/
│   │   └── profile/page.tsx
│   ├── profile/
│   │   └── [username]/page.tsx
│   ├── posts/
│   │   ├── [postId]/page.tsx
│   │   └── new/page.tsx
│   ├── admin/
│   │   ├── page.tsx            # Admin dashboard/stats
│   │   ├── users/page.tsx
│   │   ├── users/[userId]/page.tsx
│   │   └── posts/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── auth/
│   │   ├── confirm/page.tsx
│   │   └── reset/page.tsx
│   └── api/
│       ├── users/
│       │   ├── me/route.ts
│       │   ├── [userId]/route.ts
│       │   ├── [userId]/follow/route.ts
│       │   ├── [userId]/followers/route.ts
│       │   └── [userId]/following/route.ts
│       ├── posts/
│       │   ├── route.ts
│       │   ├── [postId]/route.ts
│       │   ├── [postId]/like/route.ts
│       │   ├── [postId]/like-status/route.ts
│       │   └── [postId]/comments/route.ts
│       ├── comments/
│       │   └── [commentId]/route.ts
│       ├── feed/route.ts
│       ├── notifications/
│       │   ├── route.ts
│       │   ├── [notificationId]/read/route.ts
│       │   └── mark-all-read/route.ts
│       ├── admin/
│       │   ├── users/route.ts
│       │   ├── users/[userId]/route.ts
│       │   ├── users/[userId]/deactivate/route.ts
│       │   ├── posts/route.ts
│       │   ├── posts/[postId]/route.ts
│       │   └── stats/route.ts
│       └── storage/upload/route.ts
│
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── Navbar.tsx
│   ├── PostCard.tsx
│   ├── Comment.tsx
│   ├── ProfileCard.tsx
│   ├── NotificationItem.tsx
│   └── ... (other shared components)
│
├── lib/
│   ├── supabase.ts             # Supabase client config
│   ├── auth.ts                 # Auth helpers
│   ├── utils.ts                # Utility functions
│   └── types.ts                # TypeScript types/interfaces
│
├── styles/
│   ├── globals.css             # Tailwind base
│   └── ... (other styles)
│
├── public/
│   └── ... (static assets)
│
├── .env.example                # Environment variables template
├── README.md
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── package.json
└── next.config.js
```

---

## ⚡ Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/socialconnect.git
   cd socialconnect
Install dependencies

bash
Copy code
npm install
Set up environment variables
Copy .env.example → .env.local and add your Supabase keys.

Run the dev server

bash
Copy code
npm run dev
Open http://localhost:3000 in your browser 🚀

📝 Environment Variables
Create a .env.local file with:

ini
Copy code
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
🧑‍💻 Admin Access
Set is_admin = true in the profiles table for a user.

Only admins can access /admin routes and delete any user/post.


🛡️ Security
No secrets or keys are committed to the repo.

RLS (Row Level Security) is enabled & enforced in Supabase.

📄 License
This project is licensed under the MIT License.


💬 Contact
For questions, open an issue or reach out to Syed Abdul Kareem.
