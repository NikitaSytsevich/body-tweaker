#!/usr/bin/env node

/**
 * Script to generate code audit files for sharing with AI tools
 * Splits codebase into chunks of ~5000 lines for easy processing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Files to include in audit (in order of importance)
const FILES_TO_AUDIT = [
  // Entry point
  'src/main.tsx',
  'src/App.tsx',

  // App structure
  'src/app/Layout.tsx',
  'src/app/WelcomeScreen.tsx',
  'src/app/modals/SettingsModal.tsx',
  'src/app/modals/InfoModal.tsx',
  'src/app/modals/InstallGuideModal.tsx',

  // Contexts
  'src/contexts/ThemeContext.tsx',

  // Fasting feature (core feature)
  'src/features/fasting/context/TimerContext.tsx',
  'src/features/fasting/hooks/useFastingTimer.ts',
  'src/features/fasting/FastingPage.tsx',
  'src/features/fasting/MetabolismMapPage.tsx',
  'src/features/fasting/components/TimerRing.tsx',
  'src/features/fasting/components/ProtocolSelector.tsx',
  'src/features/fasting/components/FastingStartModal.tsx',
  'src/features/fasting/components/PhaseSheet.tsx',
  'src/features/fasting/components/PhasesList.tsx',
  'src/features/fasting/components/SovietProtocolSheet.tsx',
  'src/features/fasting/components/AnabolicState.tsx',
  'src/features/fasting/data/schemes.ts',
  'src/features/fasting/data/stages.ts',
  'src/features/fasting/data/preparationSteps.ts',

  // Breathing feature
  'src/features/breathing/hooks/useBreathingSession.ts',
  'src/features/breathing/BreathingPage.tsx',
  'src/features/breathing/components/BreathingCircle.tsx',
  'src/features/breathing/components/BreathingStartModal.tsx',
  'src/features/breathing/components/SoundMixer.tsx',
  'src/features/breathing/data/patterns.ts',

  // Biorhythm feature
  'src/features/biorhythm/hooks/useBiorhythms.ts',
  'src/features/biorhythm/BiorhythmPage.tsx',
  'src/features/biorhythm/components/BiorhythmChart.tsx',
  'src/features/biorhythm/components/StatsGrid.tsx',

  // History feature
  'src/features/history/HistoryPage.tsx',
  'src/features/history/components/RecordDetails.tsx',

  // Articles feature
  'src/features/articles/pages/ArticlesPage.tsx',
  'src/features/articles/pages/ArticleDetailPage.tsx',
  'src/features/articles/components/ArticleCard.tsx',
  'src/features/articles/types.ts',

  // UI Components
  'src/components/ui/Modal.tsx',
  'src/components/ui/ConfirmModal.tsx',
  'src/components/ui/ToastNotification.tsx',
  'src/components/ui/DatePicker.tsx',
  'src/components/ui/SegmentedControl.tsx',

  // Hooks
  'src/hooks/useStorage.ts',
  'src/hooks/useAddToHomeScreen.ts',

  // Utils
  'src/utils/storage.ts',
  'src/utils/sounds.ts',
  'src/utils/cn.ts',
  'src/utils/types.ts',

  // Config files
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'tailwind.config.js',
  'CLAUDE.md',
];

const MAX_LINES_PER_FILE = 5000;
const OUTPUT_DIR = path.join(rootDir, 'audit-output');

/**
 * Read file content with line count
 */
function readFileWithLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    return { content, lines, lineCount: lines.length };
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Format file header
 */
function formatFileHeader(relativePath, lineCount) {
  const separator = '='.repeat(80);
  return `\n${separator}\nFILE: ${relativePath} (${lineCount} lines)\n${separator}\n\n`;
}

/**
 * Generate audit files
 */
function generateAudit() {
  console.log('🔍 Generating code audit...\n');

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let currentFileNumber = 1;
  let currentLines = 0;
  let currentContent = '';
  let totalFiles = 0;
  let totalLines = 0;

  // Add header to first file
  currentContent += `CODE AUDIT FOR BODY TWEAKER PROJECT\n`;
  currentContent += `Generated: ${new Date().toISOString()}\n`;
  currentContent += `${'='.repeat(80)}\n\n`;

  for (const relativePath of FILES_TO_AUDIT) {
    const fullPath = path.join(rootDir, relativePath);
    const fileData = readFileWithLines(fullPath);

    if (!fileData) continue;

    totalFiles++;
    totalLines += fileData.lineCount;

    const fileHeader = formatFileHeader(relativePath, fileData.lineCount);
    const fileContent = fileData.content;
    const totalFileSize = fileHeader.split('\n').length + fileData.lineCount;

    // Check if we need to start a new file
    if (currentLines + totalFileSize > MAX_LINES_PER_FILE && currentLines > 0) {
      // Write current file
      const outputPath = path.join(OUTPUT_DIR, `audit-part-${currentFileNumber}.txt`);
      fs.writeFileSync(outputPath, currentContent, 'utf-8');
      console.log(`✅ Created ${path.basename(outputPath)} (${currentLines} lines, ${totalFiles} files)`);

      // Start new file
      currentFileNumber++;
      currentLines = 0;
      currentContent = '';
      totalFiles = 0;

      // Add header to new file
      currentContent += `CODE AUDIT FOR BODY TWEAKER PROJECT - PART ${currentFileNumber}\n`;
      currentContent += `Generated: ${new Date().toISOString()}\n`;
      currentContent += `${'='.repeat(80)}\n\n`;
    }

    // Add file to current content
    currentContent += fileHeader + fileContent + '\n\n';
    currentLines += totalFileSize;

    console.log(`  ➜ Added: ${relativePath} (${fileData.lineCount} lines)`);
  }

  // Write last file
  if (currentLines > 0) {
    const outputPath = path.join(OUTPUT_DIR, `audit-part-${currentFileNumber}.txt`);
    fs.writeFileSync(outputPath, currentContent, 'utf-8');
    console.log(`✅ Created ${path.basename(outputPath)} (${currentLines} lines)`);
  }

  // Generate summary
  const summaryPath = path.join(OUTPUT_DIR, 'audit-summary.txt');
  const summary = generateSummary(currentFileNumber, totalLines);
  fs.writeFileSync(summaryPath, summary, 'utf-8');

  console.log(`\n${'='.repeat(80)}`);
  console.log(`✨ Audit complete!`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`📄 Files created: ${currentFileNumber}`);
  console.log(`📊 Total lines: ${totalLines}`);
  console.log(`${'='.repeat(80)}\n`);
}

/**
 * Generate audit summary
 */
function generateSummary(numFiles, totalLines) {
  return `
CODE AUDIT SUMMARY
==================

Project: Body Tweaker
Generated: ${new Date().toISOString()}

Files Created: ${numFiles}
- Each file contains ~${MAX_LINES_PER_FILE} lines or less
- File naming: audit-part-1.txt, audit-part-2.txt, etc.

Total Lines of Code: ${totalLines}

Usage:
------
1. Share these files with an AI tool for code review
2. Start with audit-part-1.txt and proceed sequentially
3. Reference the file name when asking questions

Contents:
---------
- Entry point (main.tsx, App.tsx)
- App structure (Layout, WelcomeScreen, Modals)
- Contexts (Theme, Timer)
- Fasting feature (Timer, Protocol, Metabolism Map)
- Breathing feature (Exercises, Sound)
- Biorhythm feature (Charts, Calculations)
- History feature
- Articles feature
- UI Components
- Utilities (Storage, Sounds)
- Configuration files

Note: This audit focuses on source code. Generated files, node_modules,
and build artifacts are excluded.
`;
}

// Run the audit
generateAudit();
