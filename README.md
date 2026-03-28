# Story Arc Tracker

**Story Arc Tracker** is an elegant, AI-native intelligence dashboard that transforms static news articles into high-fidelity investigative boards. 

Rather than parsing through thousands of words across multiple sources, simply paste a news URL and let the tracker instantly extract the narrative chronology, map out corporate/political entities, and calculate the overall market sentiment.

## ✨ Features

- **Automated Summary:** Generates concise, high-level intelligence briefs from raw article data.
- **Narrative Scroll (Interactive Timeline):** Chronological extraction of key events. Watch as the UI's localized energy pulse tracks your cursor down the timeline.
- **Entity Web:** A pristine, hover-reactive Global Radial Network Map (powered by Mermaid.js) mapping relationships between companies, individuals, and institutions. Includes an interactive full-screen zoom feature.
- **Market Sentiment Pulse:** Bi-directional impact graph that visualizes the positive, negative, or controversial nature of the news over time.
- **Future Horizon Predictions:** Active predictive modeling of subsequent market or corporate moves natively derived from the generated narrative arc.
- **Devil's Advocate Protocol:** Explicitly surfaces contrarian perspectives, identifying blind spots or counter-narratives not immediately obvious in the source material.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router, React 18)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Dark/Glassmorphic Themes)
- **Animations:** Framer Motion
- **Visualizations:** Recharts, Mermaid.js
- **AI Engine:** Google Gemini 2.5 Flash API (Structured JSON Extraction)
- **Data Scraping:** Cheerio (Serverless API extraction)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/story-arc-tracker.git
   cd story-arc-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your API credentials:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🕹️ Usage

1. Paste any supported news URL (e.g., Economic Times, Reuters, Bloomberg public articles) into the main input bar.
2. Click **Analyze Article →**.
3. The platform will securely fetch the HTML, strip out the noise, pass it through the specialized Gemini System Prompt, and instantly dynamically render your interactive intelligence dashboard.

## 🤝 Contributing

Contributions are always welcome. Please feel free to open an issue or submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
