# Google Sheets Manager Application

## Overview

This is a Flask-based web application that provides a user-friendly interface for managing data stored in Google Sheets. The application serves as a CRUD (Create, Read, Update, Delete) interface for four main data categories: Profile, Experience, Certifications, and Projects. It features a modern tabbed interface with Bootstrap styling and supports image uploads through Google Apps Script integration.

## System Architecture

### Frontend Architecture
- **Framework**: Bootstrap 5.3.0 with dark theme
- **UI Pattern**: Single-page application with tabbed interface
- **Styling**: Custom CSS with Font Awesome icons
- **JavaScript**: Vanilla JavaScript for dynamic interactions
- **Image Handling**: Base64 encoding for file uploads

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Architecture Pattern**: Service-oriented with dedicated Google Sheets service layer
- **API Design**: RESTful endpoints for CRUD operations
- **Error Handling**: Comprehensive exception handling with logging
- **Middleware**: ProxyFix for deployment behind reverse proxies

### External Integration
- **Data Storage**: Google Sheets as primary database
- **Integration Method**: Google Apps Script as middleware API
- **Communication**: HTTP requests (GET/POST) with JSON payloads
- **Authentication**: Relies on Google Apps Script's built-in security

## Key Components

### 1. Flask Application (`app.py`)
- Main application entry point with route definitions
- Handles HTTP requests and responses
- Manages session configuration and security
- Integrates with Google Sheets service layer

### 2. Google Sheets Service (`google_sheets_service.py`)
- Abstraction layer for Google Sheets API communication
- Handles HTTP requests to Google Apps Script endpoint
- Manages error handling and response parsing
- Supports CRUD operations across multiple sheets

### 3. Frontend Templates
- **Base Template**: Common layout with navigation and Bootstrap integration
- **Index Template**: Main dashboard with tabbed interface for all sheets
- **Responsive Design**: Mobile-friendly with Bootstrap grid system

### 4. Static Assets
- **CSS**: Custom styling for enhanced user experience
- **JavaScript**: Client-side functionality for dynamic interactions

### 5. Google Apps Script Integration
- Server-side JavaScript code running on Google's infrastructure
- Acts as API gateway between Flask app and Google Sheets
- Handles sheet-specific CRUD operations
- Manages image uploads and URL generation

## Data Flow

### Read Operations
1. User selects a tab in the web interface
2. Frontend JavaScript makes GET request to Flask API
3. Flask routes request to Google Sheets service
4. Service makes HTTP request to Google Apps Script
5. Apps Script reads data from specific Google Sheet
6. Data flows back through the chain and renders in the UI

### Write Operations
1. User submits form data (create/update)
2. Frontend processes any image uploads (Base64 conversion)
3. JavaScript makes POST request to Flask API with JSON payload
4. Flask validates and routes to Google Sheets service
5. Service forwards request to Google Apps Script
6. Apps Script performs write operation on Google Sheet
7. Success/error response flows back to update UI

### Image Upload Flow
1. User selects image file in form
2. Frontend converts file to Base64 format
3. Base64 data included in JSON payload
4. Google Apps Script processes image upload
5. Returns URL for stored image
6. URL saved in appropriate sheet column

## External Dependencies

### Python Packages
- **Flask**: Web framework for HTTP handling
- **Requests**: HTTP client for external API communication
- **Werkzeug**: WSGI utilities and middleware

### Frontend Libraries
- **Bootstrap 5.3.0**: UI framework and components
- **Font Awesome 6.0.0**: Icon library
- **Bootstrap Bundle**: JavaScript components

### Google Services
- **Google Sheets**: Primary data storage
- **Google Apps Script**: Server-side integration layer
- **Google Drive**: Image storage (implied)

## Deployment Strategy

### Development Environment
- Flask development server with debug mode enabled
- Hot reload for code changes
- Detailed logging for troubleshooting

### Production Considerations
- ProxyFix middleware configured for reverse proxy deployment
- Environment-based secret key configuration
- Structured logging for monitoring
- CORS handling through Google Apps Script

### Configuration Management
- Secret key sourced from environment variables
- Google Apps Script endpoint URL hardcoded in service layer
- Debug mode controlled by execution context

## Changelog

- July 05, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.