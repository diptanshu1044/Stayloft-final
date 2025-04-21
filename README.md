# StayLoft - Hostel/PG/Flat Listing Web Application

StayLoft is a student housing platform designed to simplify the process of finding hostels, PGs, and flats around university areas. It centralizes property listings and enables seamless interaction between students and property owners — from browsing and filtering to booking and reviewing.

## Key Features

- **User Authentication**: Role-based sign-up/login system using Clerk (Tenant, Owner).
- **Property Listings**: Owners can post, update, and manage listings with images and details.
- **Search & Filtering**: Real-time filters by price, location, amenities, and property type.
- **Booking & Payments**: Secure booking system with Razorpay integration (under development).
- **Chat System**: Real-time messaging using Socket.io for tenant-owner communication.
- **Ratings & Reviews**: Tenants can share experiences and rate properties.
- **Notifications**: Email/SMS alerts for booking confirmations and property updates.

## Problem Statement

Finding affordable and trustworthy accommodation near universities is often time-consuming, fragmented, and vulnerable to fraud. StayLoft addresses this by offering a transparent, secure, and centralized platform that streamlines the rental process end-to-end.

## Tech Stack

### Frontend

- **Next.js 15**
- **Tailwind CSS + ShadCN**
- **Zustand, TanStack Query**
- **Axios**

### Backend

- **Next.js Server Actions**
- **Socket.io** for real-time features

### Database

- **MongoDB with Prisma ORM**

## Integrations

- **Clerk** for authentication
- **Razorpay** for payment processing
- **Google Maps API**

## System Design

- **RESTful APIs** connecting frontend and backend
- **JWT-secured authentication**
- **Modular, scalable structure** with real-time communication
- **Architecture Diagrams and DFDs** (link if hosted externally)

## Project Status

### Completed

1. UI/UX Design
2. Authentication
3. Initial property management features
4. System architecture setup

### In Progress

1. Database schema implementation
2. Chat system
3. API development and frontend-backend integration

### Upcoming

1. Secure payment gateway
2. Deployment and scalability optimization

## Testing

- Black-box and white-box testing
- Unit and integration tests
- Load and performance testing
- Security testing for user data and payment flows

## Team and Contributions

- **Diptanshu Banerjee** – Backend (APIs, authentication, database)
- **Vansh Bhatia** – Frontend (UI, property features, chat system)
- **Mihika** – Project Management and Testing (SDLC coordination, QA)
- **Mansi Naidu and Yash Parmar** – Database design and query optimization
- **Mansi Naidu and Vansh Bhatia** – UI/UX (Design system and responsive layouts)

## Future Enhancements

- Virtual property tours (360° view)
- AI-powered property recommendations
- In-app chatbot for instant support
- Advanced search algorithms and filters

## Repository

StayLoft GitHub Repository: [GitHub Link]

