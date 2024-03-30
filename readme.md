# BlogBurst Backend

Welcome to BlogBurst Backend - Your Platform for Building Blogs!

BlogBurst Backend is a straightforward solution for building and managing blogs. It provides the essential tools you need to create and share your stories effectively.

## API Documentation

Explore the API documentation for BlogBurst Backend: (will be added soon)

## Model

Get insights into the data model used in BlogBurst Backend: [Model](https://app.eraser.io/workspace/FzhLU69VMqRXOSE2gY29?origin=share)

## Features

### User Management

- **Registration:** Users can register for an account with their email and password.
- **Login:** Registered users can log in to their accounts using their credentials.

### Post Management

- **Create Post:** Users can create new posts, providing a title, slug, featured image, status, and content.
- **Edit Post:** Users can edit their existing posts, modifying the title, slug, featured image, status, and content.
- **Delete Post:** Users can delete their posts.
- **View Posts:** Users can view all posts, including their own and posts by other users.

### Relationship Management

- **Post Ownership:** Each post is associated with a user, indicating the owner of the post.
- **User Posts:** Users can view all posts associated with their account.

### Additional Features

- **Authentication:** User authentication is implemented to ensure secure access to the platform.
- **Authorization:** Users have appropriate permissions to perform actions on their posts.
- **Slug Generation:** Slugs are automatically generated based on the post title to create SEO-friendly URLs.
- **Image Upload:** Users can upload featured images for their posts.

## Technologies Used

BlogBurst Backend leverages the following technologies to provide robust functionality:

- **Node.js:**

  - Powers the backend logic with its efficient event-driven architecture.

- **Express.js:**

  - Provides a minimalist and flexible web application framework for building RESTful APIs.

- **MongoDB:**

  - Offers a scalable and flexible NoSQL database solution for storing and managing application data.

- **Cloudinary:**
  - Simplifies image management and storage for seamless integration of media content. _(Note: You must have a Cloudinary account for usage.)_

## Installation and Setup

1. **Clone the Repository:**

   - git clone https://github.com/Kamlesh-Chowdary/BlogBurst_Backend

2. **Navigate to the Project Directory:**

   - cd [Your Project Directory]

3. **Install Dependencies:**

   - npm install

4. **Set up environment variables:**

   - Create a .env in root of project and fill in the required values in the .env file using .env.sample file

5. **Run the Project:**

   - npm run dev

## Contributing

If you wish to contribute to this project, please feel free to contribute.
