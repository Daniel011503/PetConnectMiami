# Pet Connect Miami 🐾

A full-stack social media platform for pet adoption and community building in Miami, featuring both web and mobile applications.

## 🚀 Features

### Web Application (Django)
- **User Authentication**: Register, login, logout with session management
- **Pet Management**: Add, edit, delete pet profiles with photos
- **Pet Search**: Browse and filter pets by name, breed, age
- **User Profiles**: Manage personal information and pet ownership
- **Admin Interface**: Full Django admin for content management

### Mobile Application (React Native + Expo)
- **Cross-Platform**: iOS and Android support using Expo
- **User Authentication**: JWT token-based login/register system
- **Pet Browsing**: Swipe through available pets with detailed views
- **Real-time Updates**: Live data from Django API
- **Profile Management**: User account management and logout
- **Modern UI**: Material Design-inspired interface

## 🛠️ Tech Stack

### Backend
- **Django 5.2.4**: Web framework
- **Django REST Framework**: API development
- **SQLite**: Database (easily upgradeable to PostgreSQL)
- **Django CORS Headers**: Cross-origin request handling
- **Pillow**: Image processing

### Mobile Frontend
- **React Native**: Mobile framework
- **Expo Router**: File-based navigation
- **TypeScript**: Type safety
- **AsyncStorage**: Local data persistence
- **Expo Image**: Optimized image handling

### Web Frontend
- **Django Templates**: Server-side rendering
- **Bootstrap 4**: Responsive design
- **Crispy Forms**: Form styling

## 📱 Mobile App Screenshots

The mobile app features:
- **Login/Register**: Secure authentication flow
- **Home Feed**: Browse all available pets
- **Pet Details**: Full pet profiles with photos and owner info
- **User Profile**: Account management and logout

## 🚦 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Expo CLI
- Git

### Backend Setup (Django)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Daniel011503/PetConnectMiami.git
   cd PetConnectMiami
   ```

2. **Install Python dependencies**
   ```bash
   pip install django djangorestframework django-cors-headers pillow django-crispy-forms crispy-bootstrap4
   ```

3. **Run migrations**
   ```bash
   python manage.py migrate
   ```

4. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

5. **Start the development server**
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

### Mobile App Setup (React Native)

1. **Navigate to mobile directory**
   ```bash
   cd PetConnectMobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Expo CLI globally**
   ```bash
   npm install -g @expo/cli
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device**
   - Download Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or use iOS Simulator / Android Emulator

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile

### Pets
- `GET /api/pets/search/` - Get all pets with search
- `GET /api/pets/{id}/` - Get specific pet details
- `POST /api/pets/` - Create new pet (authenticated)
- `PUT /api/pets/{id}/` - Update pet (owner only)

## 📂 Project Structure

```
PetConnectMiami/
├── petconnect/           # Django project settings
├── pets/                 # Pet management app
├── accounts/             # User authentication app
├── media/               # Uploaded images
├── PetConnectMobile/    # React Native mobile app
│   ├── app/             # Expo Router pages
│   ├── components/      # Reusable components
│   ├── contexts/        # React contexts
│   └── assets/          # Images and fonts
└── manage.py           # Django management script
```

## 🔐 Security Features

- **CSRF Protection**: Django CSRF middleware
- **CORS Configuration**: Secure cross-origin requests
- **Token Authentication**: JWT-based mobile authentication
- **Input Validation**: Comprehensive form validation
- **SQL Injection Protection**: Django ORM protection

## 🌟 Key Features Implemented

### Authentication System
- ✅ User registration with validation
- ✅ Secure login/logout
- ✅ Token-based mobile authentication
- ✅ Persistent login sessions
- ✅ Protected routes and API endpoints

### Pet Management
- ✅ CRUD operations for pets
- ✅ Image upload and display
- ✅ Search and filtering
- ✅ Owner association
- ✅ Mobile-optimized API

### Mobile Experience
- ✅ Cross-platform compatibility
- ✅ Smooth navigation
- ✅ Loading states and error handling
- ✅ Professional UI design
- ✅ Real-time data synchronization

## 🚧 Future Enhancements

- [ ] Push notifications for new pets
- [ ] Chat system between users
- [ ] Geolocation-based search
- [ ] Social features (likes, comments)
- [ ] Advanced filtering options
- [ ] Pet adoption workflow
- [ ] Payment integration
- [ ] Email notifications

## 📸 Demo

Visit the live demo: [Pet Connect Miami](https://github.com/Daniel011503/PetConnectMiami)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

Created with ❤️ by [Daniel011503](https://github.com/Daniel011503)

---

### 🔧 Development Notes

- Backend runs on `http://localhost:8000`
- Mobile app connects to `http://192.168.1.225:8000` (update IP as needed)
- CORS is configured for development (update for production)
- SQLite database is included for quick setup
- All sensitive settings should be environment variables in production

### 📱 Mobile Development

The mobile app uses modern React Native practices:
- Expo Router for navigation
- TypeScript for type safety
- Context API for state management
- AsyncStorage for persistence
- Professional error handling
