#!/bin/bash
set -e

# Test script to simulate Homebrew formula update workflow
# This validates the template replacement logic locally

echo "🧪 Testing Homebrew Formula Update Workflow"
echo "============================================"
echo ""

# Test version and fake SHA values
VERSION="0.1.5"
ARM64_SHA="aabbccdd11223344556677889900aabbccdd11223344556677889900aabbccdd"
X64_SHA="11223344556677889900aabbccdd11223344556677889900aabbccdd11223344"
LINUX_SHA="556677889900aabbccdd11223344556677889900aabbccdd1122334455667788"

echo "📦 Test version: $VERSION"
echo "🔐 Test SHA256 checksums:"
echo "  ARM64:  $ARM64_SHA"
echo "  x64:    $X64_SHA"
echo "  Linux:  $LINUX_SHA"
echo ""

# Create temp directory
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

echo "📁 Working in: $TEMP_DIR"
echo ""

# Find template - try multiple possible locations
TEMPLATE_PATH=""
for path in "/Users/oskardragon-work/workspaces/oskar-dragon/homebrew-tools/Formula/claude-code-flow.rb.template" \
            "../../homebrew-tools/Formula/claude-code-flow.rb.template" \
            "../homebrew-tools/Formula/claude-code-flow.rb.template"; do
  if [ -f "$path" ]; then
    TEMPLATE_PATH="$path"
    break
  fi
done

if [ -z "$TEMPLATE_PATH" ]; then
  echo "❌ Error: Template not found"
  echo "   Tried:"
  echo "   - /Users/oskardragon-work/workspaces/oskar-dragon/homebrew-tools/Formula/claude-code-flow.rb.template"
  echo "   - ../../homebrew-tools/Formula/claude-code-flow.rb.template"
  echo "   - ../homebrew-tools/Formula/claude-code-flow.rb.template"
  exit 1
fi

echo "✅ Template file found at: $TEMPLATE_PATH"

# Copy template to temp location
cp "$TEMPLATE_PATH" "$TEMP_DIR/test-formula.rb"

# Perform replacements
sed -i.bak "s/VERSION_PLACEHOLDER/$VERSION/g" "$TEMP_DIR/test-formula.rb"
sed -i.bak "s/ARM64_SHA_PLACEHOLDER/$ARM64_SHA/" "$TEMP_DIR/test-formula.rb"
sed -i.bak "s/X64_SHA_PLACEHOLDER/$X64_SHA/" "$TEMP_DIR/test-formula.rb"
sed -i.bak "s/LINUX_SHA_PLACEHOLDER/$LINUX_SHA/" "$TEMP_DIR/test-formula.rb"

# Verify no placeholders remain
if grep -q "PLACEHOLDER" "$TEMP_DIR/test-formula.rb"; then
  echo "❌ Error: Some placeholders were not replaced:"
  grep "PLACEHOLDER" "$TEMP_DIR/test-formula.rb"
  exit 1
fi

echo "✅ All placeholders replaced successfully"
echo ""

# Show version line
echo "📝 Version line:"
grep "version" "$TEMP_DIR/test-formula.rb" | head -1
echo ""

# Show SHA lines
echo "📝 SHA256 lines:"
grep "sha256" "$TEMP_DIR/test-formula.rb"
echo ""

# Show URL lines
echo "📝 URL lines:"
grep "url" "$TEMP_DIR/test-formula.rb"
echo ""

echo "✅ Test successful! Formula update logic works correctly."
echo ""
echo "📄 Generated formula saved to: $TEMP_DIR/test-formula.rb"
echo "   (will be deleted on exit)"
