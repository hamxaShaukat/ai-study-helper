# AI Study Helper - User Manual

## Table of Contents
1. [Introduction](#introduction)
2. [System Requirements](#system-requirements)
3. [Installation Guide](#installation-guide)
4. [Getting Started](#getting-started)
5. [Features Overview](#features-overview)
6. [Troubleshooting](#troubleshooting)
7. [Support](#support)

---

## Introduction

**AI Study Helper** is an intelligent web application designed to enhance your learning experience by transforming PDF documents into interactive study materials. Whether you're a student preparing for exams or a lifelong learner exploring new topics, this tool helps you master content through summaries, flashcards, quizzes, and interactive chat.

### Key Benefits
- Generate comprehensive summaries from lengthy PDFs
- Create custom flashcards for quick revision
- Test your knowledge with AI-generated quizzes
- Track your mastery level for each document
- Ask questions and chat with your PDFs for deeper understanding

---

## System Requirements

Before installing the application, ensure your system meets the following requirements:

- **Node.js**: Version 14.0 or higher
- **npm**: Version 6.0 or higher
- **Web Browser**: Latest version of Chrome, Firefox, Safari, or Edge
- **Internet Connection**: Required for API calls and Firebase services
- **Git**: For cloning the repository

---

## Installation Guide

Follow these steps to set up the AI Study Helper on your local machine:

### Step 1: Clone the Repository

Open your terminal or command prompt and run:

```bash
git clone https://github.com/hamxaShaukat/ai-study-helper
```

### Step 2: Navigate to Project Directory

```bash
cd ai-study-helper
```

### Step 3: Install Dependencies

Install all required packages by running:

```bash
npm install
```

This process may take a few minutes depending on your internet connection.

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory of the project and add the following variables:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_firebase_app_id_here
```

**Note**: Replace the placeholder values with your actual API keys and Firebase configuration details. These credentials are essential for the application to function properly.

### Step 5: Run the Application

Start the development server:

```bash
npm run dev
```

The application will typically run on `http://localhost:5173` (or another port if specified). Open this URL in your web browser to access the application.

---

## Getting Started

### First Time Setup

1. **Launch the Application**: Open your web browser and navigate to the local development URL (displayed in your terminal after running `npm run dev`).

2. **Create an Account** (if authentication is required): Sign up using your email address or preferred authentication method.

3. **Explore the Interface**: Familiarize yourself with the main dashboard and navigation menu.

### Uploading Your First PDF

1. Click on the **"Upload PDF"** button on the main dashboard.
2. Select a PDF file from your device (ensure it's a text-based PDF for best results).
3. Wait for the upload to complete. The system will process your document automatically.
4. Once uploaded, your PDF will appear in your document library.

---

## Features Overview

### 1. PDF Upload

**Purpose**: Import study materials into the application.

**How to Use**:
- Click the **Upload PDF** button
- Select one or multiple PDF files from your device
- The system supports multiple PDF uploads, allowing you to build a comprehensive study library
- Each PDF is stored securely and can be accessed anytime

**Best Practices**:
- Upload clear, text-based PDFs for optimal results
- Use descriptive file names to easily identify your documents
- Organize related PDFs by subject or topic

---

### 2. Summary Generation

**Purpose**: Get concise overviews of lengthy documents to understand key concepts quickly.

**How to Use**:
1. Select a PDF from your library
2. Click on the **"Generate Summary"** button
3. Wait a few moments while the AI processes the document
4. Review the generated summary, which highlights main points and key takeaways

**Use Cases**:
- Quick review before exams
- Understanding the main thesis of research papers
- Getting an overview before deep reading

---

### 3. Flashcard Generation

**Purpose**: Create study flashcards automatically for active recall practice.

**How to Use**:
1. Open a PDF from your library
2. Select the **"Generate Flashcards"** option
3. The AI will create question-answer pairs based on the content
4. Review flashcards one by one
5. Mark cards as "Known" or "Need Review" to track your progress

**Tips**:
- Use flashcards for memorization of key terms and concepts
- Review regularly using spaced repetition techniques
- Focus on cards marked as "Need Review" during study sessions

---

### 4. Quiz Generation

**Purpose**: Test your understanding with AI-generated questions.

**How to Use**:
1. Select a PDF document
2. Click **"Generate Quiz"**
3. Choose quiz parameters (if available, such as number of questions or difficulty level)
4. Answer the questions presented
5. Submit your quiz to see your score and review correct answers

**Benefits**:
- Identify knowledge gaps
- Practice for real exams
- Reinforce learning through active testing

---

### 5. Mastery Mode

**Purpose**: Track and achieve mastery of your study materials through progressive testing.

**How to Use**:
1. Select a document (e.g., "Mr. Chips" novel)
2. Enter **Mastery Mode**
3. Complete a series of quizzes on the material
4. Achieve a score of **90% or higher** to mark the document as "Mastered"
5. Track your mastery progress across all uploaded PDFs

**Mastery Levels**:
- **Not Started**: You haven't attempted any quizzes yet
- **In Progress**: You're working toward mastery (score below 90%)
- **Mastered**: You've achieved 90% or higher and demonstrated proficiency

**Strategy**:
- Start with easier materials to build confidence
- Review summaries and flashcards before attempting mastery quizzes
- Retake quizzes to improve your understanding

---

### 6. Chat with PDF

**Purpose**: Ask questions and have interactive conversations about your document content.

**How to Use**:
1. Open a PDF from your library
2. Click on the **"Chat with PDF"** feature
3. Type your question in the chat interface (e.g., "What is the main theme of Chapter 3?")
4. The AI will analyze the document and provide relevant answers
5. Continue the conversation with follow-up questions

**Example Questions**:
- "Summarize Chapter 5"
- "What are the key differences between X and Y mentioned in the document?"
- "Explain the concept of [specific term] in simpler terms"
- "What examples does the author provide for [topic]?"

**Tips**:
- Be specific with your questions for better answers
- Use this feature for clarification on difficult concepts
- Great for deepening understanding beyond surface-level reading

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Application Won't Start
**Problem**: Error messages appear when running `npm run dev`

**Solutions**:
- Ensure all dependencies are installed: run `npm install` again
- Check that Node.js and npm are properly installed: run `node --version` and `npm --version`
- Verify that all environment variables are correctly set in the `.env` file

#### Issue 2: PDF Upload Fails
**Problem**: PDF doesn't upload or shows an error

**Solutions**:
- Check your internet connection
- Ensure the PDF file is not corrupted
- Verify the file size is within acceptable limits
- Try uploading a different PDF to isolate the issue

#### Issue 3: Summary/Quiz Not Generating
**Problem**: Features don't generate content or take too long

**Solutions**:
- Verify that your Gemini API key is valid and has available quota
- Check your internet connection
- Try with a smaller PDF document first
- Refresh the page and try again

#### Issue 4: Environment Variables Not Working
**Problem**: Application shows API errors or Firebase connection issues

**Solutions**:
- Double-check that the `.env` file is in the root directory
- Ensure there are no extra spaces or quotes around the values
- Restart the development server after making changes to `.env`
- Verify all required variables are present

---

## Support

### Need Help?

If you encounter issues not covered in this manual:

1. **Check the Console**: Open your browser's developer console (F12) to see detailed error messages
2. **Review Documentation**: Refer to the project's README file for additional technical details
3. **Contact Support**: Reach out to your project team or instructor for assistance

### Feedback

We value your feedback! If you have suggestions for improving the AI Study Helper, please share them with the development team.

---

## Conclusion

Thank you for using **AI Study Helper**! This tool is designed to make your study sessions more efficient and effective. By leveraging AI technology, you can transform static PDF documents into dynamic, interactive learning experiences.

**Happy Studying!** 📚✨

---

*Version 1.0 | Last Updated: December 2025*
