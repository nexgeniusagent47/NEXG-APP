import React, { useState } from 'react';
import { Database, Copy, Check, Download, X, Server, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface DatabaseSqlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DatabaseSqlModal({ isOpen, onClose }: DatabaseSqlModalProps) {
  const { isLight } = useTheme();
  const [activeTab, setActiveTab] = useState<'schema' | 'seed'>('schema');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schemaSnippet = `-- PostgreSQL Schema for NEXG App
-- Run on your local/cloud PostgreSQL server (PostgreSQL 14+)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TABLE categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(64),
    image_url TEXT,
    display_order INT DEFAULT 0
);

CREATE TABLE subcategories (
    id VARCHAR(64) PRIMARY KEY,
    category_id VARCHAR(64) REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0
);

CREATE TABLE merchants (
    id VARCHAR(64) PRIMARY KEY,
    primary_category_id VARCHAR(64) REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    hero_image_url TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    delivery_time_min INT DEFAULT 20,
    delivery_time_max INT DEFAULT 35,
    delivery_fee NUMERIC(10, 2) DEFAULT 0.00,
    is_open BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE items (
    id VARCHAR(64) PRIMARY KEY,
    merchant_id VARCHAR(64) REFERENCES merchants(id) ON DELETE CASCADE,
    subcategory_id VARCHAR(64) REFERENCES subcategories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE
);

-- Optimized Trigram Index for Sub-millisecond Fuzzy Search
CREATE INDEX idx_merchants_name_trgm ON merchants USING gin (name gin_trgm_ops);
CREATE INDEX idx_items_name_trgm ON items USING gin (name gin_trgm_ops);`;

  const seedSnippet = `-- Seed script for NEXG App
-- Run: psql -U postgres -d nexg_db -f schema.sql && psql -U postgres -d nexg_db -f seed.sql
-- Contains all 21 categories, verified merchants, and menu items with Unsplash image links.
-- (Full files located at /src/db/schema.sql and /src/db/seed.sql)`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#15191f] border-white/10'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <Database size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">PostgreSQL Database Scripts</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Optimized for speed &amp; efficiency with pg_trgm and full image links
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-4 flex items-center justify-between border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-4 py-2 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                activeTab === 'schema'
                  ? 'border-[#009DE0] text-[#009DE0]'
                  : 'border-transparent text-slate-600 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              schema.sql (DDL &amp; Trigram Indexes)
            </button>
            <button
              onClick={() => setActiveTab('seed')}
              className={`px-4 py-2 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                activeTab === 'seed'
                  ? 'border-[#009DE0] text-[#009DE0]'
                  : 'border-transparent text-slate-600 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              seed.sql (21 Categories &amp; Image URLs)
            </button>
          </div>

          <button
            onClick={() => handleCopy(activeTab === 'schema' ? schemaSnippet : seedSnippet)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#009DE0] text-white hover:bg-[#0088c4] cursor-pointer transition-colors shadow-2xs mb-2"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy SQL'}</span>
          </button>
        </div>

        {/* Code view */}
        <div className="p-6 flex-grow overflow-y-auto font-mono text-xs leading-relaxed bg-slate-950 text-emerald-400">
          <pre className="whitespace-pre-wrap select-all">
            {activeTab === 'schema' ? schemaSnippet : seedSnippet}
          </pre>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-100 dark:bg-[#0d1014] border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-600">
          <span>Files saved in your project at: <code>/src/db/schema.sql</code> and <code>/src/db/seed.sql</code></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-slate-800 text-white hover:bg-slate-700 font-bold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
