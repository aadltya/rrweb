# User Session Tracking and Analysis - Implementation Report

## Author: Aditya Swami

## Overview

This document outlines the implementation details of the user session tracking and analysis assignment. The goal was to record user sessions, replay them, and analyze them using an LLM for insights. The project was built using `rrweb` for session recording and playback, and an LLM model for analysis.

## Features Implemented

### 1. Session Recording

- Integrated `rrweb` to capture user interactions such as clicks, input events, and navigation.
- Recorded events are stored in memory (as S3 storage access was unavailable).
- Users can start and stop session recording with designated UI buttons.

### 2. Session Playback

- Implemented a session player using `rrweb-player`.
- After stopping the recording, users can replay their session in a structured manner.
- Ensured a smooth replay experience with proper event timing.

### 3. LLM-Powered Analysis

- Implemented an API endpoint to process session data.
- Sent recorded session data to an LLM for behavioral insights.
- Displayed AI-generated insights in the UI, formatted in Markdown for better readability.

## Technical Stack

- **Frontend:** Next.js, TypeScript, TailwindCSS
- **Session Recording & Playback:** rrweb, rrweb-player
- **LLM Integration:** Fetched AI-generated insights from a cloud-based LLM model

## Challenges & Workarounds

### 1. **LLM Response Formatting**

- The LLM returned insights in Markdown format.
- Used `react-markdown` with `remark-gfm` to properly render the insights in the UI.

### 2. **Sandboxing Issues in Browser**

- Initially faced script execution issues due to iframe sandboxing.
- Resolved by ensuring proper permissions and embedding constraints.

## Deployment

- **GitHub Repository:** https://github.com/aadltya/rrweb
- **Live Demo:** https://rrweb-rust.vercel.app/

## Next Steps

- Integrate S3 storage for session persistence.
- Optimize session data processing to handle large user bases efficiently.
- Enhance LLM model integration to provide more contextual insights.

## Conclusion

The project successfully records and replays user sessions while leveraging an LLM for behavioral insights. This implementation serves as a strong foundation for further improvements, particularly in cloud-based storage and scalability.