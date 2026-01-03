#!/usr/bin/env node

/**
 * Development Environment Health Check
 *
 * Proactively detects common issues that can break Metro bundler:
 * - Corrupted node_modules (duplicate folders)
 * - Stale caches
 * - Port conflicts
 * - TypeScript errors
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkDuplicateFolders() {
  log('\n📦 Checking for corrupted node_modules...', colors.cyan);

  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');

  if (!fs.existsSync(nodeModulesPath)) {
    log('❌ node_modules not found. Run: npm install', colors.red);
    return false;
  }

  const folders = fs.readdirSync(nodeModulesPath);
  const duplicates = folders.filter(folder => / \d+$/.test(folder));

  if (duplicates.length > 0) {
    log('❌ CRITICAL: Corrupted node_modules detected!', colors.red);
    log('   Found duplicate folders:', colors.red);
    duplicates.forEach(dup => log(`   - ${dup}`, colors.yellow));
    log('\n   Fix: npm run clean:all && npm install', colors.yellow);
    return false;
  }

  log('✅ node_modules is healthy (no duplicates)', colors.green);
  return true;
}

function checkPortConflict() {
  log('\n🔌 Checking port 8081...', colors.cyan);

  try {
    const output = execSync('lsof -i :8081 2>/dev/null || echo "PORT_FREE"', { encoding: 'utf8' });

    if (output.includes('PORT_FREE')) {
      log('✅ Port 8081 is available', colors.green);
      return true;
    }

    log('⚠️  Port 8081 is in use (Metro may already be running)', colors.yellow);
    log(output.trim());
    return true; // Not necessarily an error
  } catch (error) {
    log('✅ Port 8081 is available', colors.green);
    return true;
  }
}

function checkStaleCaches() {
  log('\n🗑️  Checking for stale caches...', colors.cyan);

  const cacheLocations = [
    path.join(__dirname, '..', 'node_modules', '.cache'),
    path.join(__dirname, '..', '.expo'),
  ];

  let staleCaches = [];

  cacheLocations.forEach(cachePath => {
    if (fs.existsSync(cachePath)) {
      const stats = fs.statSync(cachePath);
      const ageInDays = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

      if (ageInDays > 7) {
        staleCaches.push({ path: cachePath, age: Math.round(ageInDays) });
      }
    }
  });

  if (staleCaches.length > 0) {
    log('⚠️  Stale caches detected (older than 7 days):', colors.yellow);
    staleCaches.forEach(cache => {
      log(`   - ${path.basename(cache.path)} (${cache.age} days old)`, colors.yellow);
    });
    log('   Consider running: npm run clean', colors.yellow);
    return true; // Warning, not error
  }

  log('✅ No stale caches found', colors.green);
  return true;
}

function checkTypeScript() {
  log('\n📘 Running TypeScript check...', colors.cyan);

  try {
    execSync('npx tsc --noEmit 2>&1', { encoding: 'utf8', stdio: 'pipe' });
    log('✅ No TypeScript errors', colors.green);
    return true;
  } catch (error) {
    const output = error.stdout || error.message;
    const errorCount = (output.match(/error TS\d+:/g) || []).length;

    log(`⚠️  Found ${errorCount} TypeScript error(s)`, colors.yellow);
    log('   Run: npm run typecheck (for details)', colors.yellow);
    return true; // Warning, not critical for Metro
  }
}

function checkExpoDoctor() {
  log('\n🩺 Running Expo Doctor...', colors.cyan);

  try {
    const output = execSync('npx expo-doctor 2>&1', { encoding: 'utf8', stdio: 'pipe' });

    if (output.includes('✔') || output.includes('No issues')) {
      log('✅ Expo Doctor: No issues found', colors.green);
      return true;
    }

    if (output.includes('✖') || output.includes('error')) {
      log('⚠️  Expo Doctor found issues:', colors.yellow);
      console.log(output);
      return true; // Warning
    }

    log('✅ Expo Doctor: Looks good', colors.green);
    return true;
  } catch (error) {
    log('⚠️  Could not run expo-doctor (non-critical)', colors.yellow);
    return true;
  }
}

// Main health check
async function runHealthCheck() {
  log('\n╔════════════════════════════════════════╗', colors.blue);
  log('║   🏥 Development Health Check          ║', colors.blue);
  log('╚════════════════════════════════════════╝', colors.blue);

  const checks = [
    checkDuplicateFolders(),
    checkPortConflict(),
    checkStaleCaches(),
    checkTypeScript(),
    checkExpoDoctor(),
  ];

  const allPassed = checks.every(check => check !== false);

  log('\n' + '='.repeat(42), colors.blue);

  if (allPassed) {
    log('✅ All checks passed! Environment is healthy.', colors.green);
    log('\n💡 Ready to run: npm start', colors.cyan);
  } else {
    log('❌ Some checks failed. See recommendations above.', colors.red);
    log('\n💡 Quick fix: npm run reset', colors.yellow);
  }

  log('='.repeat(42) + '\n', colors.blue);

  process.exit(allPassed ? 0 : 1);
}

runHealthCheck();
