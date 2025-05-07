# CelerServus

A real-time restaurant management system for efficient order processing and communication.

## Features

- **Order Management**: Track table numbers, menu items, quantities, and special requests
- **Real-time Notifications**:
  - New order alerts for kitchen/weinauschank
  - Ready order notifications for waiters
  - Kitchen-to-waiter call system
  - System-wide inventory alerts

## Technical Architecture

- **Frontend**: Web application with real-time updates
- **Backend**: Server with WebSocket support for real-time communication
- **Database**: PostgreSQL for orders, inventory, and user management
- **Authentication**: Multi-user login system

## Getting Started

1. Install PostgreSQL
2. Set up the database schema (see documentation)
3. Configure the backend server
4. Launch the web interface

## Development

This project requires real-time data handling across multiple concurrent users, implemented using WebSockets for instant notifications and updates.# CelerServus
