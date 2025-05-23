# Pariwar Hamro — A Family Meetup Gallery & Chat App

🌐 **Live App**: [https://pariwar-hamro.vercel.app/](https://pariwar-hamro.vercel.app/)

## 🧠 Motivation

We regularly meet with close family friends, enjoying meals, games, and memorable activities together. Over time, we realized that all the fun photos taken during these gatherings were scattered and unorganized. This app was born to give those memories a permanent, structured home — a place to store, share, and revisit our beautiful moments. Additionally, it adds interactivity through chats and AI, making our digital family space more engaging.

---

## ✨ Features

### 📷 Photo Gallery

- Upload and view images in an interactive gallery using `react-image-gallery`.
- Upload via file picker or drag-and-drop.
- Only logged-in users can upload/delete photos.
- Image uploads are stored in Cloudinary and associated with user data.
- Supports image validation (max size: 5MB, types: JPEG, PNG).
- Smooth UX with real-time error/success notifications using `react-hot-toast`.

### 🔐 Authentication

- Built with `NextAuth.js` using:
  - `CredentialsProvider` for email/password login
  - `GoogleProvider` for Google login
- User session is required for uploading images and accessing AI chat.

### 💬 Two Types of Chat

#### 1. Real-Time Socket.io Chat

GitHub Backend Repo: [Socket.io Chat Backend](https://github.com/khemrajneupane/socket.io-live-chat/tree/main/socket-chat-backend)

- Powered by Node.js, Express.js, and Socket.IO
- Features:
  - Public and private messaging
  - Real-time message updates (no refresh)
  - Optional username registration
  - Auto-assigned names for guests
  - Responsive UI with “You” indicator
  - Smart public/private message fallback
- Deployed on Render platform

#### 2. OpenAI Chat (AI Assistant)

GitHub Backend Repo: [Chatbot Flask](https://github.com/khemrajneupane/chatbot-flask/blob/main/app.py)

- Python Flask backend integrated with OpenAI’s GPT-3.5-turbo model
- Available only to logged-in users
- Prompt-based AI responses (max 50 tokens)
- Ideal for fun interactions, questions, or assistance

---

## 🛠️ Tech Stack

### Frontend

- [Next.js](https://nextjs.org/) (TypeScript)
- [Bootstrap 5](https://getbootstrap.com/)
- [React Icons](https://react-icons.github.io/)
- [React Image Gallery](https://www.npmjs.com/package/react-image-gallery)
- [Socket.IO Client](https://socket.io/)
- [React Hot Toast](https://react-hot-toast.com/)

### Backend & APIs

- [NextAuth.js](https://next-auth.js.org/) for authentication
- [MongoDB](https://www.mongodb.com/) via Mongoose for user and image data
- [Cloudinary](https://cloudinary.com/) for image hosting
- Custom API Routes:
  - `POST /api/images`: upload image
  - `DELETE /api/images/:id`: delete image

### External Chat Backends

- **Socket Chat Backend**: Node.js + Express.js + Socket.IO
- **OpenAI Chat Backend**: Python + Flask + OpenAI API

---

## 📦 Dependencies

```json
"dependencies": {
  "bcryptjs": "^3.0.2",
  "bootstrap": "^5.3.6",
  "cloudinary": "^2.6.1",
  "mongodb": "^6.16.0",
  "mongoose": "^8.14.1",
  "next-auth": "^4.24.11",
  "next-connect": "^1.0.0",
  "react-hot-toast": "^2.5.2",
  "react-icons": "^5.5.0",
  "react-image-gallery": "^1.4.0",
  "socket.io-client": "^4.8.1"
},
"devDependencies": {
  "typescript": "^5"
}
```

## 🚀 Getting Started Locally

```
git clone https://github.com/your-username/pariwar-hamro.git
cd pariwar-hamro
npm install
npm run dev

```

## 🔗 Links

- 🖼️ Live App: https://pariwar-hamro.vercel.app/

- 💬 Socket Chat Backend: GitHub Repo

- 🤖 OpenAI Chat Backend: GitHub Repo

## 🙏 Acknowledgements

Thanks to open-source libraries, APIs, and family & friends who inspired this fun app. "This currently a private social hub built for families or close friend groups to share memories, chat, and interact — all in a secure and cozy environment."

---

# Happy coding and nostalgic sharing!
