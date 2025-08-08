# Pet Connect Miami 🐕🌴

A full-stack social platform connecting pet owners in Miami for playdates, breeding opportunities, and building a vibrant pet community with Instagram-like features. Features both web and mobile applications.

## 🎯 Mission

Pet Connect Miami aims to solve the challenge of pet socialization and connection in the bustling city of Miami. Many pet owners struggle to find suitable playmates for their dogs, breeding partners, or simply a community of like-minded pet lovers. Our platform bridges this gap by creating an Instagram-like social experience specifically designed for Miami's pet community.

## 🌟 Features

### Current Features
- **User Registration & Authentication**: Secure signup and login system (web & mobile)
- **Pet Profiles**: Create detailed profiles for your pets with photos
- **Pet Discovery**: Browse and discover pets in your area
- **Photo Sharing**: Upload and share photos of your furry friends
- **Cross-Platform**: Web application (Django) + Mobile app (React Native/Expo)
- **REST API**: Django REST Framework powering the mobile app

### Planned Features
- **Playdate Matching**: Connect dogs with compatible playmates based on size, energy level, and location
- **Breeding Network**: Find suitable breeding partners for your pets
- **Social Feed**: Instagram-like feed to share pet moments and updates
- **Location-Based Matching**: Find pets and owners in your Miami neighborhood
- **Event Organization**: Create and join pet-friendly events and meetups
- **Messaging System**: Direct messaging between pet owners
- **Rating & Reviews**: Rate playdate experiences and pet interactions

## 🛠️ Technology Stack

### Backend (Django)
- **Django 5.2.4**: Web framework
- **Django REST Framework**: API development
- **SQLite**: Database (development)
- **Authentication**: Django built-in + token authentication
- **Media Storage**: Local file storage

### Mobile App (React Native/Expo)
- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform and tools
- **TypeScript**: Type safety
- **File-based routing**: Expo Router navigation

### Web Frontend
- **Django Templates**: Server-side rendering
- **Bootstrap**: Responsive design
- **Crispy Forms**: Form styling

## 📱 Project Structure

```
pet-connect-miami/
├── accounts/              # Django user authentication
├── pets/                  # Django pet management
├── petconnect/           # Django project settings
├── social/               # Django social features
├── media/                # User-uploaded images
├── app/                  # React Native app pages
├── components/           # React Native components
├── contexts/             # React Native contexts
├── assets/               # Mobile app assets
└── manage.py             # Django management
```

## 🌴 Why Miami?

Miami's vibrant pet-friendly culture, beautiful weather year-round, and numerous dog parks make it the perfect city for pet socialization. From South Beach to Coral Gables, pet owners are looking for ways to connect and create meaningful relationships for both themselves and their furry companions.

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- Expo CLI
- Virtual environment (recommended)

### Backend Setup (Django)

1. **Create and activate virtual environment:**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux
```

2. **Install Django dependencies:**
```bash
pip install django==5.2.4
pip install djangorestframework
pip install django-crispy-forms
pip install crispy-bootstrap4
pip install django-cors-headers
```

3. **Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

4. **Create superuser (optional):**
```bash
python manage.py createsuperuser
```

5. **Start Django server:**
```bash
python manage.py runserver
```

### Mobile App Setup (Expo/React Native)

1. **Install dependencies:**
```bash
npm install
```

2. **Install Expo CLI globally:**
```bash
npm install -g @expo/cli
```

3. **Start the mobile app:**
```bash
npx expo start
```

4. **Run on device:**
- Download Expo Go app on your phone
- Scan the QR code from the terminal
- Or use iOS Simulator / Android Emulator

## 📋 Current Status

### ✅ Completed
- [x] Django backend with REST API
- [x] User authentication system
- [x] Pet model and CRUD operations
- [x] Photo upload functionality
- [x] React Native mobile app setup
- [x] Cross-platform mobile development
- [x] Git repository setup

### 🚧 In Progress
- [ ] Mobile app authentication integration
- [ ] Pet browsing in mobile app
- [ ] Enhanced UI/UX design

### 📅 Planned
- [ ] Advanced matching algorithm
- [ ] Real-time messaging
- [ ] Event management system
- [ ] Social media features (likes, comments, follows)
- [ ] Geolocation services
- [ ] Push notifications
- [ ] Production deployment

## 🤝 Contributing

We welcome contributions from the Miami tech and pet-loving community! Please feel free to:
- Report bugs and issues
- Suggest new features
- Submit pull requests
- Share feedback and ideas

## 📞 Contact

For questions, suggestions, or collaboration opportunities, please reach out through the GitHub repository issues section.

---

**Made with ❤️ for the Miami pet community** 🐕🌴

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
