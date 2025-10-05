# 👶 Mommy Blog - Platforma dla Rodziców

Nowoczesny blog o macierzyństwie i rodzicielstwie zbudowany w Next.js 14. Platforma oferuje bezpieczne środowisko do dzielenia się doświadczeniami, poradami i wsparciem dla rodziców.

🌐 **Live Demo:** [https://mommy-blog.vercel.app](https://mommy-blog.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-14.2.15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)

## ✨ Funkcjonalności

### 🔍 **Zaawansowane Wyszukiwanie**

- Real-time search z debouncing (300ms)
- Wyszukiwanie w tytułach i opisach postów
- Kompaktowy widok wyników z miniaturkami
- Podświetlanie wyszukanych fraz

### 📝 **Zarządzanie Treścią**

- Tworzenie i edycja postów z edytorem Rich Text (React Quill)
- System kategorii tematycznych
- Upload i optymalizacja obrazów (Cloudinary)
- Nawigacja między postami z miniaturkami

### 💬 **System Komentarzy**

- Komentarze przypisane do użytkowników
- Moderacja i zarządzanie komentarzami
- Real-time aktualizacje

### 🔐 **Bezpieczeństwo**

- NextAuth.js z wieloma providerami
- Rate limiting na wszystkich API endpoints
- Ochrona przed XSS (DOMPurify)
- Tokeny CSRF dla bezpiecznych operacji
- Walidacja i sanityzacja danych

### ♿ **Dostępność (WCAG 2.1 Level AA)**

- Skip links dla nawigacji klawiaturowej
- Semantyczne HTML i ARIA labels
- Wsparcie dla screen readerów
- Responsive design dla wszystkich urządzeń

### 🎨 **Nowoczesny Design**

- Glass-morphism i gradient efekty
- Smooth animacje i transitions
- Responsive design dla wszystkich urządzeń
- Custom scrollbars i loading states

## 🛠️ Stack Technologiczny

### Frontend

- **Next.js 14.2.15** - React framework z App Router
- **React 18** - Biblioteka UI z Hooks
- **CSS Modules** - Scoped styling
- **React Quill** - Rich Text Editor

### Backend & Database

- **Next.js API Routes** - Serverless API
- **Prisma ORM** - Type-safe database client
- **MongoDB** - NoSQL database
- **NextAuth.js** - Authentication library

### Usługi Zewnętrzne

- **Cloudinary** - Hosting i optymalizacja obrazów
- **Upstash Redis** - Rate limiting (opcjonalnie)

### Bezpieczeństwo

- **DOMPurify** - XSS protection
- **bcryptjs** - Password hashing
- **CSRF Tokens** - Cross-site request forgery protection
- **Rate Limiting** - API protection

## 🚀 Instalacja i Uruchomienie

### Wymagania

- Node.js 22+ (wymagane dla Vercel deployment)
- npm lub yarn
- MongoDB (lokalnie lub MongoDB Atlas)

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/tomrud88/mommy-blog.git
cd mommy-blog
```

### 2. Instalacja zależności

```bash
npm install
```

### 3. Konfiguracja zmiennych środowiskowych

Stwórz plik `.env.local` w głównym katalogu:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/mommy-blog"

# NextAuth.js
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (opcjonalnie)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Rate Limiting (opcjonalnie)
UPSTASH_REDIS_REST_URL="your-upstash-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-token"
```

### 4. Inicjalizacja bazy danych

```bash
npx prisma generate
npx prisma db push
```

### 5. Uruchomienie aplikacji

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`

## 📁 Struktura Projektu

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── auth/          # Authentication
│   │   ├── posts/         # Posts management
│   │   ├── comments/      # Comments system
│   │   └── search/        # Search functionality
│   ├── posts/[slug]/      # Dynamic post pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── search/           # Search functionality
│   ├── menu/             # Navigation components
│   └── SkipLinks/        # Accessibility
├── utils/                # Utility functions
│   ├── auth.js           # Authentication config
│   ├── rateLimiter.js    # Rate limiting
│   └── htmlSanitizer.js  # XSS protection
└── prisma/
    └── schema.prisma     # Database schema
```

## 🔧 API Endpoints

### Posts

- `GET /api/posts` - Lista postów z paginacją
- `POST /api/posts` - Tworzenie nowego postu (auth required)
- `DELETE /api/posts` - Usuwanie postu (admin only)
- `GET /api/posts/[slug]` - Pobieranie pojedynczego postu

### Search

- `GET /api/search?q={query}` - Wyszukiwanie postów

### Comments

- `GET /api/comments?postSlug={slug}` - Komentarze dla postu
- `POST /api/comments` - Dodawanie komentarza (auth required)

### Authentication

- `POST /api/auth/register` - Rejestracja użytkownika
- NextAuth.js endpoints w `/api/auth/`

## 🔒 Bezpieczeństwo

### Rate Limiting

- **Rejestracja**: 3 próby/godzinę na IP
- **Posty**: 5 postów/godzinę
- **Komentarze**: 10 komentarzy/10 minut
- **Upload**: 3 pliki/5 minut
- **API**: 100 żądań/minutę

### Ochrona przed atakami

- XSS protection z DOMPurify
- CSRF tokens dla operacji modyfikujących
- Walidacja wszystkich inputów
- Bezpieczne przechowywanie haseł (bcrypt)

## 🌐 Deployment

### ✅ Live na Vercel

Aplikacja jest już wdrożona i dostępna pod adresem:
**[https://mommy-blog.vercel.app](https://mommy-blog.vercel.app)**

### Konfiguracja dla Vercel

1. **Node.js Version**

   ```json
   // .nvmrc
   22
   ```

2. **Build Scripts** (package.json)

   ```json
   {
     "scripts": {
       "build": "prisma generate && next build",
       "postinstall": "prisma generate"
     },
     "engines": {
       "node": ">=22.0.0"
     }
   }
   ```

3. **Vercel Configuration** (vercel.json)
   ```json
   {
     "functions": {
       "src/app/api/**/route.js": {
         "maxDuration": 10
       }
     },
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           }
         ]
       }
     ]
   }
   ```

### Deployment na własnej instancji Vercel

1. **Fork repozytorium**

   ```bash
   git clone https://github.com/tomrud88/mommy-blog.git
   cd mommy-blog
   ```

2. **Zainstaluj Vercel CLI**

   ```bash
   npm install -g vercel
   vercel login
   ```

3. **Deploy aplikacji**

   ```bash
   vercel --prod
   ```

4. **Skonfiguruj zmienne środowiskowe**

   ```bash
   vercel env add AUTH_GOOGLE_ID
   vercel env add AUTH_GOOGLE_SECRET
   vercel env add AUTH_SECRET
   vercel env add NEXTAUTH_SECRET
   vercel env add DATABASE_URL
   vercel env add CLOUDINARY_CLOUD_NAME
   vercel env add CLOUDINARY_UPLOAD_PRESET
   vercel env add NEXTAUTH_URL  # https://your-domain.vercel.app
   ```

5. **Konfiguracja Google OAuth**
   - Dodaj domenę Vercel do Authorized redirect URIs:
   - `https://your-domain.vercel.app/api/auth/callback/google`

### Przygotowanie do deployment lokalnie

1. Upewnij się, że wszystkie zmienne środowiskowe są skonfigurowane
2. Wykonaj build produkcyjny:

```bash
npm run build
```

3. Przetestuj build lokalnie:

```bash
npm run start
```

### Inne platformy deployment

Aplikacja jest kompatybilna z:

- **Vercel** - ✅ Zalecana platforma (aktualnie wdrożona)
- **Netlify** - Alternatywa z dobrym CI/CD
- **Railway** - Prosty deployment z bazą danych
- **PlanetScale** - MySQL na skale
- **Heroku** - Klasyczna opcja z add-onami

## 🤝 Rozwój

### Uruchomienie w trybie development

```bash
npm run dev
```

### Linting i formatowanie

```bash
npm run lint
npm run lint:fix
```

### Build produkcyjny

```bash
npm run build
npm run start
```

## 📱 PWA Support

Aplikacja obsługuje Progressive Web App:

- Offline functionality
- Install prompt
- Service worker
- Web app manifest

## 🐛 Zgłaszanie Błędów

1. Sprawdź [istniejące issues](https://github.com/tomrud88/mommy-blog/issues)
2. Stwórz nowy issue z detalami:
   - Opis problemu
   - Kroki do reprodukcji
   - Screenshots (jeśli dotyczy)
   - Informacje o środowisku

## 📄 Licencja

MIT License - szczegóły w pliku `LICENSE`

## 👥 Autor

**Tomasz Rudny** - [GitHub](https://github.com/tomrud88)

---

## 🙏 Podziękowania

- Next.js team za świetny framework
- Społeczność open source za wsparcie
- Wszystkim contributorom projektu

---

_Made with ❤️ for parents by parents_
