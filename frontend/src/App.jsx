// src/App.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import * as THREE from 'three';
import MainContent from './components/MainContent';
import LandingPage from "./components/LandingPage";
import './App.css';

// ── Existing Application Workspace ────────────────────────────
function MainDashboard() {
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [activeMode, setActiveMode] = useState('study');
  const [documentId, setDocumentId] = useState(null);
  const vantaRef = useRef(null);

  const [theme, setTheme] = useState(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (stored === 'light' || stored === 'dark') return stored;
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // ── Apply body class for dark/light ──────────────────────────
  useEffect(() => {
    document.body.classList.toggle('theme-dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // ── Vanta DOTS background ─────────────────────────────────────
  useEffect(() => {
    const initVanta = () => {
      if (!window.VANTA || !window.THREE) return;

      if (vantaRef.current) {
        vantaRef.current.destroy();
      }

      const isDark = theme === 'dark';

      vantaRef.current = window.VANTA.DOTS({
        el: '#vanta-bg',
        THREE: window.THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0xffaf2f,
        backgroundColor: isDark ? 0x060b14 : 0xf0f4ff,
        size: 4.10,
        spacing: 35,
      });
    };

    if (window.VANTA && window.THREE) {
      initVanta();
    } else {
      const interval = setInterval(() => {
        if (window.VANTA && window.THREE) {
          clearInterval(interval);
          initVanta();
        }
      }, 100);
      return () => clearInterval(interval);
    }

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, [theme]);

  const handleUploadSuccess = (docId) => {
    setIsFileUploaded(true);
    setDocumentId(docId);
  };

  const handleNewDocument = () => {
    setIsFileUploaded(false);
  };

  return (
    <div className="App">
      <Navbar
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        theme={theme}
        setTheme={setTheme}
      />
      <MainContent
        isFileUploaded={isFileUploaded}
        handleUploadSuccess={handleUploadSuccess}
        onUploadNewDocument={handleNewDocument}
        activeMode={activeMode}
        documentId={documentId}
      />
      <footer className="App-footer">
        <span>Built for focused learning • Stay curious ✨</span>
      </footer>
    </div>
  );
}

// ── Main Traffic Controller ────────────────────────────────────
export default function App() {
  return (
    // We removed <BrowserRouter> from here!
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/upload" element={<MainDashboard />} />
    </Routes>
  );
}