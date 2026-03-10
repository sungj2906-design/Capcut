export interface ThemeConfig {
  title: string;
  watermarkText: string;
  backgroundColor: string;
  cardColor: string;
  textColor: string;
  accentColor: string;
  layout: 'horizontal' | 'vertical';
}

export const defaultTheme: ThemeConfig = {
  title: "CapCut Editor Pro: The Neon Archive",
  watermarkText: "NeonZSenpai",
  backgroundColor: "#050505",
  cardColor: "#141414",
  textColor: "#f3f4f6",
  accentColor: "#00f3ff",
  layout: 'horizontal'
};

export interface PageData {
  pageNumber: number;
  title: string;
  content: string;
  imageUrls?: string[];
}

export const generateInitialPages = (): PageData[] => {
  const pages: PageData[] = [];
  for (let i = 1; i <= 500; i++) {
    let title = `Page ${i}`;
    let content = `Content for page ${i}...`;
    let imageUrls: string[] = [];

    if (i >= 1 && i <= 100) {
      title = `Phase 1: The Fast-Track Manual - Page ${i}`;
      content = `Zero fluff. Pure UI mapping and workflow.`;
    } else if (i >= 101 && i <= 250) {
      title = `Phase 2: The Pro Toolkit - Page ${i}`;
      content = `Physics-based movement, Shakes, and Transitions.`;
    } else if (i >= 251 && i <= 400) {
      title = `Phase 3: The Keyframe Grimoire - Page ${i}`;
      content = `The "Soul" of Pro Editing.`;
    } else {
      title = `Phase 4: Mastery - Page ${i}`;
      content = `Advanced techniques and final thoughts.`;
    }

    if (i === 10) {
      title = "The Timeline Anatomy";
      content = "Mastering the layers. Top layer = Foreground. Bottom layer = Background.";
      imageUrls = ["https://picsum.photos/seed/capcut10/800/1200"];
    } else if (i === 25) {
      title = "The Precision Cut";
      content = "Frame-perfect splitting for beat matching.";
      imageUrls = ["https://picsum.photos/seed/capcut25/800/1200"];
    } else if (i === 50) {
      title = "Audio Visualization";
      content = "Yellow dots are your sync points. Never miss a snare.";
      imageUrls = ["https://picsum.photos/seed/capcut50/800/1200"];
    } else if (i === 101) {
      title = "The \"Shake\" Methodology";
      content = "Hard Shake (The 'Impact' Shake):\nThe Secret: Combining Oblique Shake (Effect) with Camera Shake (Animation).\nGuide: Set Speed to 80, Intensity to 30. Use a Keyframe at the start (100% Intensity) and 0.2s later (0% Intensity).";
      imageUrls = ["https://picsum.photos/seed/capcut101/800/1200"];
    } else if (i === 102) {
      title = "The Velocity Transition";
      content = "Guide: Using \"Curve\" under Speed. The \"Bullet\" preset is the gold standard for AMVs.";
      imageUrls = ["https://picsum.photos/seed/capcut102/800/1200"];
    } else if (i === 251) {
      title = "The Smooth Zoom";
      content = "Don't just zoom. Use a Bezier Curve.";
      imageUrls = ["https://picsum.photos/seed/capcut251/800/1200"];
    } else if (i === 252) {
      title = "Fake 3D Parallax";
      content = "Keyframe the background moving 10% slower than the foreground subject (masked).";
      imageUrls = ["https://picsum.photos/seed/capcut252/800/1200"];
    } else if (i === 253) {
      title = "The \"Rubber Band\" Bounce";
      content = "Keyframe a scale from 100% -> 115% -> 98% -> 100% in a span of 0.5 seconds.";
      imageUrls = ["https://picsum.photos/seed/capcut253/800/1200"];
    } else if (i === 312) {
      title = "Trick: The Glow-Scan Impact";
      content = "Steps:\n1. Add keyframe to Exposure at -10.\n2. Move 3 frames forward, set Exposure to +50.\n3. Add Edge Glow effect, keyframe it to peak with the Exposure.\n4. Use the Ease-Out graph for the fade.";
      imageUrls = ["https://picsum.photos/seed/capcut312/800/1200"];
    }

    pages.push({
      pageNumber: i,
      title,
      content,
      imageUrls
    });
  }
  return pages;
};
