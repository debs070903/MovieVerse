# 🎬 MovieVerse

MovieVerse is a modern **movie discovery mobile application** built using **Expo (React Native)** and **Supabase**.  
The app allows users to explore, search, browse, and save movies using data from **TMDB**, with secure authentication and a clean, mobile-first user experience.

This project was built as a **learning + demo application**, focusing on real-world app architecture, backend integration, and deployment workflows.

---

## ✨ Features

- 🔐 User authentication using Supabase Auth
- 🔍 Search movies by title
- 🎞️ Browse movies by genre, year, and rating
- ❤️ Save movies to a personal collection
- 👤 User profile & session management
- ⚡ Fast and responsive UI with Expo & NativeWind
- ☁️ Cloud backend powered by Supabase
- 📱 Android demo build generated using Expo EAS

---

## 🛠️ Tech Stack

### Frontend
- React Native (Expo)
- TypeScript
- Expo Router
- NativeWind (Tailwind CSS for React Native)

### Backend
- Supabase (Authentication + Database)
- Row Level Security (RLS)

### External API
- TMDB (The Movie Database)

---

## 🚀 Demo

### 📱 Android APK (Preview Build)

An installable Android demo build generated using **Expo EAS Build**.

🔗 **APK Download Link:**  
https://expo.dev/accounts/debanik07/projects/movieverse/builds/87d388c6-1256-47a9-9f19-954871210015

> Note: You may need to allow **“Install from unknown sources”** on Android.

---

## 📦 Local Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/debs070903/MovieVerse
cd movieverse
npm install
````

### 2️⃣ Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_TMDB_API_KEY=tmdb_api_key_here
EXPO_PUBLIC_SUPABASE_URL=supabase_url_here
EXPO_PUBLIC_SUPABASE_KEY=supabase_key_here
```

> ⚠️ Never expose the Supabase `service_role` key in the frontend.

---

### 3️⃣ Run the app locally

```bash
npx expo start
```

* Scan QR code with **Expo Go**
* Or run on Android emulator

---

## 🔐 Supabase Configuration

* Enable Email Authentication
* Configure required tables (e.g. saved_movies)
* Apply Row Level Security (RLS) policies to ensure user-level data access
* Use **anon public key only** in the client

---

## 📌 Project Origin & Attribution

The initial setup and foundation of this project were inspired by a tutorial from **JS Mastery**.
While the project started as a guided learning reference, it has since been **independently extended, redesigned, and implemented** with additional features, architecture decisions, and integrations — including Supabase authentication, custom browsing logic, custom logics for saving movies and deployment using Expo EAS.

This project represents hands-on learning, experimentation, and original development beyond the initial reference material.

---

## 👨‍💻 Author

**Debanik Dutta**

* GitHub: [https://github.com/your-username](https://github.com/your-username)
* LinkedIn: [https://linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)

---

## 📜 License

This project is intended for learning, experimentation, and demo purposes.
