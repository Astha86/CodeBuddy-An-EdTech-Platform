<img src='https://github.com/Astha86/CodeBuddy-An-EdTech-Platform/blob/main/src/assets/Logo/buddyLogo.png' />

# CodeBuddy - An EdTech Platform

CodeBuddy is an intuitive EdTech platform built with the MERN stack, enabling users to create, consume, and rate educational content. It delivers a seamless, interactive learning experience for students while allowing instructors to showcase expertise and connect with learners worldwide, fostering a global community of educators and students.

## Table of Contents

- [System Architecture](#system-architecture)
- [Front-end](#front-end)
- [Back-end](#back-end)
- [Schema](#schema)

---

## System Architecture

The CodeBuddy ed-tech platform follows a client-server architecture with the following main components:

- **Front-end**: Built with ReactJS, it communicates with the back end using RESTful API calls.
- **Back-end**: Developed with NodeJS and ExpressJS, it handles user authentication, course management, and more.
- **Database**: Utilizes MongoDB as a NoSQL database to store course content, user data, and other relevant information.

![System Architecture Diagram](https://github.com/Astha86/CodeBuddy-An-EdTech-Platform/blob/main/src/assets/Images/architecture.png)

---

## Front-end

The front end of CodeBuddy is built with ReactJS, offering a dynamic and responsive user interface for students and instructors. Here are some key pages and functionalities:

**For Students:**

- **Homepage**: Introduction to the platform.
- **Course List**: List of available courses with descriptions and ratings.
- **Wishlist**: Display added courses.
- **Cart Checkout**: Complete course purchase using Razorpay.
- **Course Content**: Access course material, including videos.
- **Enrolled Courses**: Progress and list of enrolled courses.
- **User Details**: Account information.
- **User Edit Details**: Edit account information.

**For Instructors:**

- **Dashboard**: Overview of instructor's courses and ratings.
- **Insights**: Detailed course including the number of views, clicks, and other relevant metrics.
- **Course Management Pages**: Create, update, delete courses.
- **View and Edit Profile Details**: Account management.

Front-end tools and technologies include ReactJS, CSS, Tailwind CSS, Redux for state management, and VSCode for development.
Additionally, we use some npm packages to add extra functionality to the front end.

[View Live Demo](https://codebuddy-liart.vercel.app/)
![CodeBuddy1](https://github.com/Astha86/CodeBuddy-An-EdTech-Platform/blob/main/src/assets/Images/look.png)


---

## Back-end

The back end of CodeBuddy is built with NodeJS and ExpressJS and uses MongoDB as its primary database. Key features and functionalities include:

- **User Authentication and Authorization**: Secure login, OTP verification, and forgot password functionality.
- **Course Management**: Instructors can create, update, delete courses, and students can view and rate them.
- **Payment Integration**: Razorpay integration for course purchases.
- **Cloud-based Media Management**: Cloudinary for storing and managing media content.
- **Markdown Formatting**: Course content is stored in Markdown format for rendering.

**Frameworks, libraries, and tools used**: Node.js, MongoDB, Express.js, JWT for authentication and authorization, Bcrypt for password hashing, and Mongoose for database interaction.

### Data Models and Database Schema

- **Student Schema**: Includes name, email, password, and course details.
- **Instructor Schema**: Includes name, email, password, and course details.
- **Course Schema**: Includes course name, description, instructor details, and media content.

### Database

The database for the platform is built using MongoDB, a NoSQL database that provides a flexible and scalable data storage solution. MongoDB allows for the storage of unstructured and semi-structured data. The database stores the course content, user data, and other relevant information related to the platform.
  
---

## Schema
![CodeBuddy Schema](https://github.com/Astha86/CodeBuddy-An-EdTech-Platform/blob/main/src/assets/Images/Schema.png)

---
Thank you for using CodeBuddy!

