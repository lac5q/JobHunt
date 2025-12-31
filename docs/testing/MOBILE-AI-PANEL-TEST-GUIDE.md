# Mobile AI Panel - Quick Test Guide

This guide helps you quickly test the mobile responsive AI panel on your device.

---

## Quick Visual Test (Desktop Browser)

### Step 1: Open Browser DevTools
1. Open `job-search-dashboard.html` in Chrome/Firefox
2. Press `F12` or `Cmd+Opt+I` (Mac) / `Ctrl+Shift+I` (Windows)
3. Click "Toggle Device Toolbar" icon (or press `Cmd+Shift+M`)

### Step 2: Test Different Screen Sizes
Test these common mobile widths:
- **375px** - iPhone SE, iPhone 12 Mini
- **390px** - iPhone 12, iPhone 13, iPhone 14
- **414px** - iPhone Plus models
- **768px** - iPad portrait (breakpoint)

### Step 3: Verify Mobile Behavior
Open AI panel and check:
- [ ] Panel slides from **bottom** (not right)
- [ ] Panel fills **entire screen**
- [ ] **Dark backdrop** appears behind panel
- [ ] Close button is **large and tappable**
- [ ] Clicking backdrop **closes panel**

### Step 4: Test Desktop Behavior
Set width to 1024px or wider:
- [ ] Panel slides from **right** (not bottom)
- [ ] Panel is **35% width** (not full screen)
- [ ] **No backdrop** appears
- [ ] Close button works normally

---

## Physical Device Testing

### iOS (iPhone/iPad)

#### Step 1: Open on Your iPhone
1. Deploy to Vercel: `vercel --prod`
2. Open URL on your iPhone in Safari
3. Scroll to "Network & Contacts" section

#### Step 2: Test Panel Opening
1. Tap any "Compose" button
2. **Expected**: Panel slides up from bottom smoothly
3. **Expected**: Dark backdrop appears behind panel
4. **Expected**: Background page doesn't scroll

#### Step 3: Test Form Inputs
1. Tap in the "Additional Context" textarea
2. **Expected**: Keyboard appears
3. **Expected**: No zoom-in on the input field
4. **Expected**: You can scroll panel content
5. **Expected**: Panel layout doesn't break

#### Step 4: Test Closing
Try all three methods:
1. Tap the **backdrop** (dark area) → Panel should close
2. Tap the **✕ button** → Panel should close
3. Use **Escape key** (if external keyboard) → Panel should close

### Android (Chrome)

#### Step 1: Open on Android
1. Open deployed URL in Chrome
2. Navigate to contacts section

#### Step 2: Test Touch Targets
1. Tap "Compose" button
2. **Expected**: Button feels responsive (no delay)
3. **Expected**: Panel slides up smoothly

#### Step 3: Test Form Interactions
1. Tap email/text fields
2. **Expected**: Appropriate keyboard appears
3. **Expected**: Panel remains stable with keyboard open

---

## Browser Console Testing

### Test 1: Verify Touch Target Sizes
```javascript
// Open panel first, then run in console:
const closeBtn = document.querySelector('#ai-panel-close');
const rect = closeBtn.getBoundingClientRect();
console.log('Close button size:', {
  width: rect.width,
  height: rect.height,
  meetsStandard: rect.width >= 44 && rect.height >= 44
});
// Expected: width/height should be 48px on mobile
```

### Test 2: Verify Mobile Transforms
```javascript
// At 375px width, run:
const panel = document.getElementById('ai-panel');
const style = window.getComputedStyle(panel);
console.log('Panel transform:', style.transform);
// Closed: Should include translateY (not translateX)
// Open: Should be translateY(0px)
```

### Test 3: Verify Backdrop Visibility
```javascript
// At 375px width:
const backdrop = document.getElementById('ai-panel-backdrop');
const style = window.getComputedStyle(backdrop);
console.log('Backdrop display:', style.display);
// Expected on mobile: 'block'

// At 1024px width:
console.log('Backdrop display:', style.display);
// Expected on desktop: 'none'
```

### Test 4: Verify Scroll Lock
```javascript
// Before opening panel:
console.log('Body overflow (before):', document.body.style.overflow);
// Expected: '' (empty)

// Open panel (at <768px width):
const contacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
if (contacts.length > 0) openAIPanel(contacts[0].id);

// After opening:
setTimeout(() => {
  console.log('Body overflow (after):', document.body.style.overflow);
  // Expected on mobile: 'hidden'
}, 500);
```

---

## Common Issues & Solutions

### Issue: Panel doesn't slide from bottom on mobile
**Check**: Is viewport width actually <768px?
```javascript
console.log('Viewport width:', window.innerWidth);
```

### Issue: Backdrop doesn't appear
**Check**: Backdrop element exists and has 'open' class
```javascript
const backdrop = document.getElementById('ai-panel-backdrop');
console.log('Exists?', !!backdrop);
console.log('Classes:', backdrop.className);
```

### Issue: Touch targets feel too small
**Measure**: Check actual rendered size
```javascript
document.querySelectorAll('button').forEach(btn => {
  const rect = btn.getBoundingClientRect();
  if (rect.height < 44) {
    console.warn('Small button:', btn.textContent, rect.height);
  }
});
```

### Issue: iOS auto-zoom on input focus
**Check**: Font size should be 16px
```javascript
const input = document.querySelector('.ai-panel input');
const fontSize = window.getComputedStyle(input).fontSize;
console.log('Input font size:', fontSize);
// Expected: '16px'
```

---

## Visual Inspection Checklist

### Mobile (<768px)
- [ ] Panel covers entire screen
- [ ] Panel slides from bottom (not right or left)
- [ ] Backdrop is semi-transparent black
- [ ] Close button is large (visually ~48px)
- [ ] All buttons are easy to tap
- [ ] Text is readable (no tiny fonts)
- [ ] Form inputs don't cause zoom
- [ ] Scrolling feels smooth

### Desktop (>768px)
- [ ] Panel slides from right side
- [ ] Panel is ~35% of screen width
- [ ] No backdrop appears
- [ ] Panel doesn't cover entire screen
- [ ] Layout matches original design

---

## Performance Testing

### Animation Smoothness
1. Open panel on mobile
2. Watch the slide-up animation
3. **Expected**: Smooth 60fps (no stuttering)

### Scroll Performance
1. Open panel with long content
2. Scroll up and down quickly
3. **Expected**: Smooth scrolling (no lag)

### Rapid Open/Close
1. Quickly open and close panel 5 times
2. **Expected**: No visual glitches
3. **Expected**: No stuck states

---

## Automated Test Script

Run this comprehensive test in browser console:

```javascript
const runMobileTests = async () => {
  console.log('🧪 Running Mobile AI Panel Tests...\n');

  // Test 1: Element existence
  console.log('Test 1: Elements exist');
  const panel = document.getElementById('ai-panel');
  const backdrop = document.getElementById('ai-panel-backdrop');
  console.log('✓ Panel exists:', !!panel);
  console.log('✓ Backdrop exists:', !!backdrop);

  // Test 2: Open panel
  console.log('\nTest 2: Open panel');
  const contacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
  if (contacts.length === 0) {
    console.error('✗ No contacts found. Add a contact first.');
    return;
  }
  openAIPanel(contacts[0].id);

  await new Promise(r => setTimeout(r, 500));

  console.log('✓ Panel has "open" class:', panel.classList.contains('open'));
  console.log('✓ Backdrop has "open" class:', backdrop.classList.contains('open'));

  // Test 3: Mobile-specific styles
  console.log('\nTest 3: Mobile styles (at current viewport width)');
  const isMobile = window.innerWidth <= 768;
  console.log('Current width:', window.innerWidth + 'px');
  console.log('Is mobile breakpoint:', isMobile);

  const panelStyle = window.getComputedStyle(panel);
  console.log('Panel width:', panelStyle.width);
  console.log('Panel height:', panelStyle.height);
  console.log('Panel transform:', panelStyle.transform);

  if (isMobile) {
    console.log('✓ Expected: Full screen (100vw x 100vh)');
    console.log('✓ Expected: translateY in transform');
  }

  // Test 4: Touch targets
  console.log('\nTest 4: Touch target sizes');
  const closeBtn = document.querySelector('#ai-panel-close');
  const closeBtnRect = closeBtn.getBoundingClientRect();
  const meetsStandard = closeBtnRect.width >= 44 && closeBtnRect.height >= 44;
  console.log('Close button:', {
    width: Math.round(closeBtnRect.width) + 'px',
    height: Math.round(closeBtnRect.height) + 'px',
    meetsAppleStandard: meetsStandard ? '✓' : '✗'
  });

  // Test 5: Scroll lock
  console.log('\nTest 5: Scroll lock');
  console.log('Body overflow:', document.body.style.overflow);
  if (isMobile) {
    console.log('Expected: "hidden" on mobile');
  }

  // Test 6: Close panel
  console.log('\nTest 6: Close panel');
  closeAIPanel();
  await new Promise(r => setTimeout(r, 500));
  console.log('✓ Panel closed:', !panel.classList.contains('open'));
  console.log('✓ Backdrop closed:', !backdrop.classList.contains('open'));
  console.log('✓ Body overflow restored:', document.body.style.overflow === '');

  console.log('\n✅ All tests complete!');
};

runMobileTests();
```

---

## Success Criteria

Your mobile AI panel is working correctly if:

✅ Panel slides from bottom on mobile (<768px)
✅ Panel slides from right on desktop (>768px)
✅ Backdrop appears on mobile only
✅ All buttons are easily tappable (44px+)
✅ Form inputs don't zoom on iOS
✅ Body scroll is locked when panel is open
✅ Animations are smooth (60fps)
✅ Keyboard doesn't break layout

---

## Report Issues

If you find any issues, note:
1. Device/browser (e.g., "iPhone 13, Safari 17")
2. Viewport width (e.g., "390px")
3. What you did (e.g., "Opened panel, tapped input field")
4. What happened vs expected

---

**Last Updated**: 2025-12-12
**Status**: Ready for Testing
