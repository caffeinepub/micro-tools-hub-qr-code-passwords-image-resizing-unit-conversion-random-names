#!/bin/bash

# Post-Deploy Verification Script for Micro Tools Hub
# This script helps verify that the mainnet deployment is working correctly

set -e

echo "=========================================="
echo "Micro Tools Hub - Post-Deploy Verification"
echo "=========================================="
echo ""

# Prompt for the deployed URL
read -p "Enter your deployed mainnet URL (e.g., https://xxxxx-xxxxx.ic0.app): " DEPLOYED_URL

# Remove trailing slash if present
DEPLOYED_URL=${DEPLOYED_URL%/}

echo ""
echo "Verifying deployment at: $DEPLOYED_URL"
echo ""

# Check if ads.txt is accessible
echo "1. Checking ads.txt accessibility..."
ADS_TXT_URL="${DEPLOYED_URL}/ads.txt"
ADS_TXT_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$ADS_TXT_URL")

if [ "$ADS_TXT_RESPONSE" = "200" ]; then
    echo "   ✓ ads.txt is accessible (HTTP 200)"
    
    # Fetch and verify content
    echo "   Checking ads.txt content..."
    ADS_TXT_CONTENT=$(curl -s "$ADS_TXT_URL")
    EXPECTED_LINE="google.com, pub-9284074903614668, DIRECT, f08c47fec0942fa0"
    
    if echo "$ADS_TXT_CONTENT" | grep -q "$EXPECTED_LINE"; then
        echo "   ✓ ads.txt contains the expected AdSense line"
    else
        echo "   ✗ WARNING: ads.txt content does not match expected AdSense line"
        echo "   Expected: $EXPECTED_LINE"
        echo "   Found: $ADS_TXT_CONTENT"
    fi
else
    echo "   ✗ ERROR: ads.txt is not accessible (HTTP $ADS_TXT_RESPONSE)"
    echo "   Please verify the file exists at frontend/public/ads.txt and redeploy"
fi

echo ""
echo "2. Manual Verification Steps"
echo "   Please complete the following checks in your browser:"
echo ""
echo "   Navigation & Core Functionality:"
echo "   --------------------------------"
echo "   [ ] Visit: $DEPLOYED_URL"
echo "   [ ] Verify Hub page loads with all tool category cards"
echo "   [ ] Click 'Popular Tools' - verify page loads with 5 tools"
echo "   [ ] Click 'Text & Writing Tools' - verify page loads with 9 tools"
echo "   [ ] Click 'Number & Conversion Tools' - verify page loads with 10 tools"
echo "   [ ] Click 'Daily Utilities' - verify page loads with 7 tools"
echo "   [ ] Test back navigation from each tool page to Hub"
echo ""
echo "   Ad Placeholder Verification:"
echo "   ----------------------------"
echo "   [ ] Verify top banner area displays 'Advertisement' label below header"
echo "   [ ] Verify bottom banner area displays 'Advertisement' label above footer"
echo "   [ ] Test on mobile and desktop - ad areas visible and properly positioned"
echo ""
echo "   AdSense Integration:"
echo "   -------------------"
echo "   [ ] Visit: $ADS_TXT_URL"
echo "   [ ] Verify ads.txt contains: google.com, pub-9284074903614668, DIRECT, f08c47fec0942fa0"
echo "   [ ] Open DevTools → Network tab"
echo "   [ ] Verify AdSense script loads from pagead2.googlesyndication.com"
echo ""
echo "   Tool Functionality Spot Check:"
echo "   ------------------------------"
echo "   [ ] QR Code Generator - enter text, verify QR renders and downloads"
echo "   [ ] Password Generator - generate password, copy to clipboard"
echo "   [ ] Unit Converter - convert between units, verify calculations"
echo "   [ ] Countdown Timer - start countdown, verify real-time updates"
echo ""
echo "=========================================="
echo "Verification Complete!"
echo "=========================================="
echo ""
echo "If all checks pass, your deployment is successful! 🎉"
echo ""
echo "Next steps:"
echo "  - Submit your site to Google AdSense for review"
echo "  - Monitor your canister cycles balance"
echo "  - Share your app: $DEPLOYED_URL"
echo ""
