# AI Playground - Where Creativity meets Learning

AI Playground is a web application built with React that allows users to engage in fun and interactive drawing activities. Users receive drawing prompts from an AI, draw the prompted object, and get their drawings evaluated for accuracy. The app provides various tools to assist users in creating their artwork.

## Features

1. **Generate Drawing Queue**: Users can click on the "Generate Queue" button to receive a drawing prompt from the AI.
2. **Drawing Tools**: The drawing board comes with adjustable brush size, a color picker, an eraser, and undo/redo tools.
3. **Submit Drawing**: Users can submit their drawing for AI evaluation.
4. **AI Evaluation**: The AI analyzes the drawing and assigns a score between 1 to 10 based on accuracy.

## Installation Guide

To set up and run the AI Playground web app locally, follow these steps:

1. **Clone the Repository**:
    ```sh
    git clone https://github.com/krish-panchani/ai-playground.git
    cd ai-playground
    ```

2. **Install Dependencies**:
    Ensure you have Node.js and npm installed. Then run:
    ```sh
    npm install
    ```

3. **Start the Development Server**:
    ```sh
    npm start
    ```

    The app will be available at `http://localhost:3000`.

## Build Guide

To create a production-ready build of the AI Playground app, follow these steps:

1. **Build the Application**:
    ```sh
    npm run build
    ```

    This will create an optimized build in the `build` directory.

2. **Serve the Build**:
    You can serve the build with any static site server or deploy it to your preferred hosting service. For example, using `serve`:
    ```sh
    npm install -g serve
    serve -s build
    ```

    The app will be available at `http://localhost:5000`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or issues, please contact [krish@thunderdevelops.in](mailto:krish@thunderdevelops.in).

