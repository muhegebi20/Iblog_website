# iBlog

## Description

iBlog is a personal blogging platform designed to empower users to share their thoughts, ideas, and experiences with the world. This project is built to provide a clean and user-friendly interface for creating and managing blog posts.

## Features

- User authentication and authorization (registration, login, logout).
- Create, edit, and delete blog posts.
- Responsive design for a seamless experience across devices.
- Markdown support for writing posts.
- Commenting system for readers to engage.
- Search functionality to find posts quickly.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Version Control**: Git and GitHub

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/<your-username>/iblog.git
   ```

2. Navigate to the project directory:

   ```bash
   cd iblog
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   Create a `.env` file in the root directory and configure the following variables:

   ```env
   PORT=3000
   NODE_ENV=
   SESSION_SECRET=<your-secret-key>
   ```

5. Start the application:

   ```bash
   nodemon server.js
   ```

6. Open your browser and visit `http://localhost:3000`.

## Usage

- Register or log in to your account.
- Create a new blog post using the editor.
- Manage your posts through the dashboard.
- Readers can browse and comment on published posts.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Create a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any inquiries or feedback, feel free to reach out to me via [your-email@example.com].
