# VideoSDK JS App

This project is a JavaScript application that utilizes the VideoSDK to create video conferencing functionality.

## Table of Contents

- [VideoSDK JS App](#videosdk-js-app)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Using ngrok for External Access](#using-ngrok-for-external-access)
  - [Configuration](#configuration)
  - [API Reference](#api-reference)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- Real-time video conferencing

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (version X.X.X or higher)
- npm (version X.X.X or higher)
- A VideoSDK account and API key

## Installation

1. Clone the repository:

`git clone https://github.com/yourusername/videosdk-js-app.git
`

2. Navigate to the project directory:


`cd videosdk-js-app
`

3. Install the dependencies:

`npm install
`

## Usage

1. Set up your environment variables (see [Configuration](#configuration) section).

2. Start the development server:



npm start


3. Open your browser and navigate to `http://localhost:3000` (or the port you've configured).

## Using ngrok for External Access

If you need to make your local development server accessible from the internet (e.g., for testing on different devices or sharing with others), you can use ngrok. Here's how to set it up:

1. Install ngrok:
- Visit [ngrok.com](https://ngrok.com/) and sign up for a free account.
- Download and install ngrok for your operating system.

2. Authenticate ngrok (you only need to do this once):



ngrok authtoken YOUR_AUTH_TOKEN

Replace `YOUR_AUTH_TOKEN` with the token provided in your ngrok dashboard.

3. Start your local development server as usual:



npm start


4. In a new terminal window, start ngrok:



ngrok http 3000

Replace `3000` with the port your app is running on if it's different.

5. ngrok will provide a public URL (e.g., `https://1234abcd.ngrok.io`). You can use this URL to access your app from any device with internet access.

Note: The free version of ngrok will generate a new URL each time you restart it. If you need a consistent URL, consider upgrading to a paid plan.

## Configuration

Create a `.env` file in the root directory and add the following:

`VIDEOSDK_API_KEY=your_api_key_here VIDEOSDK_API_SECRET=your_api_secret_here
`

Replace `your_api_key_here` and `your_api_secret_here` with your actual VideoSDK API key and secret.

## API Reference

For detailed information about the VideoSDK API, please refer to the [official documentation](https://docs.videosdk.live/).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).