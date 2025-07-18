# Testing Guide: Tile Point Positioning Bug

## **Bug Description**
After cascade animations (when tiles fall down and new ones appear), the point text values sometimes snap to the center of tiles instead of staying in the bottom-right corner.

## **Setup Instructions**

1. **Development Servers**: Ensure both client and server are running with `npm run dev`
2. **Browser Setup**: Open Chrome/Firefox at `http://localhost:5173`
3. **DevTools**: Open browser DevTools (F12) → Console tab to see detailed logging
4. **Network Throttling** (for intermittency testing): DevTools → Network tab → Throttling dropdown → Slow 3G

## **Reproduction Steps**

### **Basic Reproduction**
1. Start a game (single-player mode works fine for testing)
2. Wait for the board to load (5x5 grid with letter tiles)
3. Look for words in the **bottom rows** of the board (easier to trigger cascades)
4. Submit a word that removes tiles from the bottom (this triggers cascading)
5. **Watch the console** for the detailed logging we added:
   - `[Cascade] Starting falling animation...`
   - `[Cascade] Post-fall point position...`
   - `[Cascade] New tile ... animation completed...`

### **Expected vs Actual Behavior**
- **Expected**: Point values stay in bottom-right corner of each tile
- **Actual Bug**: Some point values snap to the center of tiles after cascade animation

### **Testing Conditions to Try**

#### **High Success Rate Conditions**
- Remove tiles from bottom row (forces long cascade)
- Submit words rapidly (2-3 words in quick succession)
- Use slow network throttling
- Submit diagonal words (more complex tile removal patterns)

#### **Edge Cases to Test**
- Full column removals (submit vertical words)
- Multiple overlapping cascades
- During window resize
- On mobile-sized viewport (DevTools → Toggle device toolbar)

## **Data Collection**

### **Test Log Template**
For each test, record:
```
Test #: ___
Word submitted: _______
Tiles removed: (x,y) coordinates
Cascade length: ___ (number of tiles that fell)
Bug occurred: YES/NO
Point positions from console logs: _______
```

### **Target Metrics**
- **Goal**: Run 10-20 cascades manually
- **Current baseline**: Count how many fail (e.g., "7/20 failed")
- **Success criteria**: After fixes, aim for 0 failures

## **Console Log Analysis**

Look for these patterns in the console:

### **Normal Behavior**
```
[Cascade] Creating new tile tile-2-1 at position (1, 2). Initial point position: x=156.4, y=234.4
[Cascade] New tile tile-2-1 animation completed. Final point position: x=156.4, y=234.4
```

### **Bug Behavior (Points Snap to Center)**
```
[Cascade] Creating new tile tile-2-1 at position (1, 2). Initial point position: x=156.4, y=234.4
[Cascade] New tile tile-2-1 animation completed. Final point position: x=125, y=200  // <-- CENTER!
```

## **Quick Testing Commands**

Open browser console and run these for quick testing:
```javascript
// Force trigger a cascade test (if available)
window.testCascade && window.testCascade();

// Check current point positions
document.querySelectorAll('canvas').length; // Should be 1
```

## **When to Proceed to Fixes**

✅ **Ready for Fix 1** when you can:
- Reliably reproduce the bug (at least 3/10 attempts)
- See the detailed console logging 
- Identify specific patterns (e.g., "happens more with bottom-row removals")

Remember: The goal is to establish a reliable baseline before implementing fixes, so we can measure improvement! 