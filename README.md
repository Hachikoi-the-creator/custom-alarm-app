# Alarm App

A modern, feature-rich alarm application built with Next.js, TypeScript, and Supabase. This app provides a comprehensive alarm management system with user authentication, persistent storage, and real-time synchronization.

## 🚀 Current Features

### ✅ Completed
- **User Authentication System**
  - Login/logout functionality
  - Password hashing with bcryptjs
  - Secure authentication flow
- **Persistent Storage**
  - Zustand state management
  - Local state persistence
  - User session management
- **Database Integration**
  - Supabase backend connection
  - Real-time data synchronization
  - Secure API endpoints
- **Modern UI Components**
  - Radix UI components
  - Tailwind CSS styling
  - Responsive design
  - Custom form components (input, select, switch, slider)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI
- **State Management**: Zustand
- **Backend**: Supabase
- **Authentication**: bcryptjs for password hashing
- **Development**: Turbopack for fast builds

## 📋 Roadmap

### 🔄 In Progress / Next Priority
- **Native Android App Development**
  - Capacitor.js integration
  - Android platform setup
  - Native device features access
  - Background service support
  - Local notifications

- **Active Values Management**
  - Update alarm status (active/inactive)
  - Real-time status synchronization
  - Toggle alarm states
- **Database Operations**
  - Create new alarms
  - Update existing alarms
  - Delete alarms
  - Bulk operations support

### 🎯 Upcoming Features
- **Custom Alarm Creation**
  - Custom alarm sounds
  - Personalized alarm names
  - Alarm categories/tags
  - Custom repeat patterns
- **Enhanced User Experience**
  - Alarm snooze functionality
  - Multiple alarm profiles
  - Alarm history tracking
  - Notification preferences
- **Advanced Features**
  - Weather-based alarms
  - Location-based alarms
  - Integration with calendar apps
  - Smart alarm suggestions

### 🔮 Future Enhancements
- **Mobile App**
  - Bolt version
  - Push notifications
  - Offline functionality
- **Social Features**
  - Share alarm schedules
  - Collaborative alarms
  - Community alarm sounds
- **Analytics & Insights**
  - Sleep pattern analysis
  - Alarm effectiveness tracking
  - Personalized recommendations

## 🚧 Development Status

- **Phase 1**: ✅ Core infrastructure (COMPLETED)
- **Phase 2**: 🔄 Database operations & state management (IN PROGRESS)
- **Phase 3**: 🎯 Custom alarms & enhanced UX (PLANNED)
- **Phase 4**: 🔮 Advanced features & mobile app (FUTURE)

## 🏃‍♂️ Getting Started

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd alarm-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React context providers
├── lib/                # Utility functions and configurations
├── pages/              # Next.js pages and API routes
│   ├── alarms/         # Alarm management pages
│   ├── api/            # API endpoints
│   ├── login/          # Authentication pages
│   └── settings/       # User settings
```

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

This project is licensed under the MIT License.

---

**Current Focus**: Implementing proper database operations and active value management for alarms.
