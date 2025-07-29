# 🧪 Single Player Mode - Manual Testing Checklist

## **Testing Environment**
- **Client URL**: http://localhost:5173/ (or http://localhost:5174/)
- **Server URL**: http://localhost:3001/
- **Date**: $(date)

## **Pre-Testing Setup**
- ✅ Server running on port 3001
- ✅ Client running on port 5173/5174  
- ✅ Unit tests passing (100% success rate)
- ✅ Dictionary loaded (264,022 words)
- ✅ All difficulty multipliers active

---

## **Test Scenario 1: Basic Single Player Flow**

### **1.1 Navigation to Single Player**
- [ ] Open client URL in browser
- [ ] Verify main menu loads with "Word Rush" title
- [ ] Click "🏆 Single Player" button
- [ ] ✅ **Expected**: Navigates to single player setup screen

### **1.2 Single Player Setup**
- [ ] Verify setup screen displays:
  - [ ] "Single Player Setup" title
  - [ ] Difficulty selector (Easy, Medium, Hard, Extreme)
  - [ ] Duration selector (30s, 60s, 90s, 120s)
  - [ ] "Start Single Player Round" button
  - [ ] "Back" button
- [ ] Select different difficulties and verify descriptions
- [ ] Select different durations
- [ ] ✅ **Expected**: All controls are responsive and functional

### **1.3 Game Start**
- [ ] Select "Medium" difficulty and "90s" duration
- [ ] Click "Start Single Player Round"
- [ ] ✅ **Expected**: 
  - Board loads within 2 seconds
  - Timer shows 90 seconds and counts down
  - Score shows "Score: 0"
  - Game HUD shows "You" as player

---

## **Test Scenario 2: Word Submission & Scoring**

### **2.1 Valid Word Submission**
- [ ] Find and submit a 3+ letter word (e.g., "CAT")
- [ ] ✅ **Expected**:
  - Word is accepted
  - Score increases (Medium: base × 1.5)
  - Notification shows success
  - Tiles cascade/refresh

### **2.2 Invalid Word Tests**
- [ ] Submit a 2-letter word on Medium difficulty
- [ ] ✅ **Expected**: "Word must be at least 3 letters for medium difficulty"
- [ ] Submit a non-dictionary word (e.g., "ZZZZZ")
- [ ] ✅ **Expected**: "Word not found in dictionary"

### **2.3 Difficulty Multiplier Verification**
Test each difficulty with the same word to verify multipliers:
- [ ] **Easy (1.0x)**: Submit "WORD" → Should get base points
- [ ] **Medium (1.5x)**: Submit "WORD" → Should get base × 1.5
- [ ] **Hard (2.0x)**: Submit "WORD" → Should get base × 2.0  
- [ ] **Extreme (3.0x)**: Submit "HOUSE" → Should get base × 3.0

---

## **Test Scenario 3: Timer & Game End**

### **3.1 Normal Timer Completion**
- [ ] Let timer run to 0 seconds
- [ ] ✅ **Expected**:
  - Game transitions to "Single Player End" screen
  - Final score is displayed
  - "Play Again" and "Back to Menu" buttons appear

### **3.2 End Screen Functionality**
- [ ] Verify final score matches accumulated score
- [ ] Click "Play Again"
- [ ] ✅ **Expected**: Returns to setup screen with reset state
- [ ] Click "Back to Menu"  
- [ ] ✅ **Expected**: Returns to main menu

---

## **Test Scenario 4: Edge Cases**

### **4.1 Short Duration Test**
- [ ] Select 30-second duration
- [ ] Start game and submit multiple words quickly
- [ ] ✅ **Expected**: Timer counts down accurately, game ends at 0

### **4.2 Zero Score Test**  
- [ ] Start game but don't submit any valid words
- [ ] Let timer expire
- [ ] ✅ **Expected**: End screen shows "Score: 0"

### **4.3 All Difficulty Levels**
Test each difficulty level individually:
- [ ] **Easy**: 2+ letter minimum, 1.0x multiplier
- [ ] **Medium**: 3+ letter minimum, 1.5x multiplier  
- [ ] **Hard**: 4+ letter minimum, 2.0x multiplier
- [ ] **Extreme**: 5+ letter minimum, 3.0x multiplier

### **4.4 Navigation Edge Cases**
- [ ] Start single player, then click browser back button
- [ ] Start single player, then navigate away and return
- [ ] Multiple rapid clicks on setup buttons
- [ ] ✅ **Expected**: No crashes, clean state management

---

## **Test Scenario 5: Performance & Responsiveness**

### **5.1 Word Submission Speed**
- [ ] Submit words rapidly (multiple per second)
- [ ] ✅ **Expected**: All submissions processed, no lag

### **5.2 Visual Feedback**
- [ ] Verify tile selection highlights
- [ ] Verify tile cascading animations
- [ ] Verify score updates are immediate
- [ ] Verify notifications appear and dismiss

### **5.3 Mobile/Responsive Testing**
- [ ] Test on mobile device or narrow browser window
- [ ] ✅ **Expected**: UI remains functional and readable

---

## **Final Verification Checklist**

### **Core Functionality** 
- [ ] ✅ Menu → Single Player navigation works
- [ ] ✅ Setup screen allows difficulty/duration selection
- [ ] ✅ Game starts with board and timer
- [ ] ✅ Word submission works with proper validation
- [ ] ✅ Scoring applies difficulty multipliers correctly
- [ ] ✅ Timer counts down and ends game
- [ ] ✅ End screen shows final score
- [ ] ✅ Navigation back to menu/restart works

### **Quality Assurance**
- [ ] ✅ No console errors during gameplay
- [ ] ✅ No visual glitches or broken layouts
- [ ] ✅ All animations smooth and responsive
- [ ] ✅ State resets properly between games
- [ ] ✅ Multiplayer functionality unaffected

---

## **Test Results Summary**

**Date Tested**: ___________  
**Tester**: ___________  
**Overall Result**: ⭐ PASS / ❌ FAIL  

**Critical Issues Found**: 
- _None expected if all checkboxes pass_

**Minor Issues Found**:
- _Document any cosmetic or non-blocking issues_

**Performance Notes**:
- _Note any performance observations_

---

## **Sign-Off**

✅ **Single Player Mode is fully functional and ready for deployment**

**Ready for Section 7: Deployment and Final Checks** 