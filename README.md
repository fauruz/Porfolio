# Personal Landing Page - React Version

A modern, responsive personal portfolio website built with React, TypeScript, and modern web technologies.

## Features

- **Responsive Design**: Works perfectly on all devices
- **Scroll Snap**: Smooth section-by-section navigation
- **Modern UI**: Clean and professional design
- **Interactive Elements**: Hover effects and smooth transitions
- **Contact Form**: Functional contact form for inquiries
- **Project Gallery**: Showcase your work with beautiful cards
- **Services Section**: Highlight your professional services

## Technologies Used

- React 18
- TypeScript
- CSS3 with modern features
- Font Awesome icons
- Webpack for bundling

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project folder
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

### Building for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `dist` folder.

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation header
│   ├── Home.tsx        # Hero section
│   ├── About.tsx       # About section
│   ├── Portfolio.tsx     # Projects gallery
│   ├── Services.tsx    # Services section
│   └── Contact.tsx     # Contact form
├── hooks/              # Custom React hooks
│   └── useScrollSnap.ts # Scroll snap functionality
├── App.tsx             # Main app component
├── index.tsx           # Entry point
└── style.css           # Global styles
```

## Customization

### Personal Information
- Update the name "Fauruz" in the Header and Home components
- Change the profile image by replacing `public/main.jpg`
- Update contact information in the Contact component

### Styling
- Modify colors in `src/style.css` (primary color is `#b74b4b`)
- Adjust fonts, spacing, and other visual elements
- Add your own CSS animations and effects

### Content
- Update the About section with your personal information
- Add your real projects to the Gallery section
- Modify the Services section to match your offerings
- Update social media links in the Home component

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [ISC License](LICENSE).

## Contributing

Feel free to submit issues and enhancement requests!

