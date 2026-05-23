#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

CORE_DIR="$PROJECT_ROOT/turing-machine-core"
FRONTEND_DIR="$PROJECT_ROOT/TuringLoom"
DESKTOP_DIR="$PROJECT_ROOT/turing-machine-desktop"
STATIC_DIR="$DESKTOP_DIR/src/main/resources/static"

echo "=========================================="
echo "  TuringLoom Desktop Build Script"
echo "=========================================="
echo ""

echo "[1/4] Building turing-machine-core..."
cd "$CORE_DIR"
mvn clean install -DskipTests
echo "✓ Core module built and installed to local Maven repository"
echo ""

echo "[2/4] Building frontend (TuringLoom)..."
cd "$FRONTEND_DIR"
pnpm build
echo "✓ Frontend built successfully"
echo ""

echo "[3/4] Copying frontend assets to desktop module..."
rm -rf "$STATIC_DIR/assets"/*
rm -rf "$STATIC_DIR/fonts"/*
rm -f "$STATIC_DIR/index.html"

cp -r "$FRONTEND_DIR/dist/"* "$STATIC_DIR/"
echo "✓ Frontend assets copied to $STATIC_DIR"
echo ""

echo "[4/4] Building desktop module and generating JAR..."
cd "$DESKTOP_DIR"
mvn clean package -DskipTests
echo "✓ Desktop JAR generated successfully"
echo ""

JAR_FILE="$DESKTOP_DIR/target/turing-machine-desktop-1.0.0.jar"
ROOT_JAR_FILE="$PROJECT_ROOT/turing-machine-desktop-1.0.0.jar"

if [ -f "$JAR_FILE" ]; then
    echo "[5/5] Copying JAR to project root..."
    cp "$JAR_FILE" "$ROOT_JAR_FILE"
    echo "✓ JAR copied to $ROOT_JAR_FILE"
    echo ""
    
    echo "=========================================="
    echo "  Build Complete!"
    echo "=========================================="
    echo ""
    echo "JAR file location:"
    echo "  $ROOT_JAR_FILE"
    echo ""
    echo "To run the application:"
    echo "  java -jar $ROOT_JAR_FILE"
    echo ""
else
    echo "ERROR: JAR file not found at $JAR_FILE"
    exit 1
fi
