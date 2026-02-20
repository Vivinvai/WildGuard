# 🧪 Admin System Test Guide

## Quick Verification Steps

### ✅ Step 1: Verify Services Running

Open browser and check:
```
http://localhost:5001         → Should load app
http://localhost:5003/health  → YOLO service
http://localhost:5004/health  → TensorFlow service
```

### ✅ Step 2: Test Poaching Detection

1. Navigate to: `http://localhost:5001/features/poaching-detection`
2. Upload any image
3. Click "Analyze for Threats"
4. Verify analysis completes
5. Check if alert is saved (if threat detected)

### ✅ Step 3: Access Admin Dashboard

1. Go to: `http://localhost:5001/admin/login`
2. Login with admin credentials
3. Should redirect to: `http://localhost:5001/admin/dashboard`
4. Verify dashboard loads with statistics

### ✅ Step 4: Check Poaching Stats

In Admin Dashboard:
1. Look for "Poaching Alerts" card (red gradient)
2. Should show unreviewed count
3. Should show "X Critical | Y High"
4. Click card → Should navigate to alerts page

### ✅ Step 5: View Poaching Threats Tab

In Admin Dashboard:
1. Click "Poaching Threats" tab
2. Verify 4 stat cards display:
   - Total Alerts
   - Critical Threats
   - High Priority
   - Needs Review
3. Check "View All Poaching Alerts" button works

### ✅ Step 6: Test Alert Management

1. Navigate to: `http://localhost:5001/admin/poaching-alerts`
2. View list of alerts
3. Try status filters: All, Pending, Investigating, Resolved
4. Click "Mark as Investigating" on an alert
5. Verify status updates
6. Click "Mark as Resolved"
7. Confirm alert moves to resolved

### ✅ Step 7: Verify Real-Time Updates

1. Open admin dashboard in one browser tab
2. Upload poaching detection image in another tab
3. Wait up to 6 seconds
4. Check if dashboard stats update automatically

### ✅ Step 8: Test Notifications

1. Login to admin dashboard
2. If critical alerts exist, verify red notification popup appears
3. Check header for pulsing red badge with alert count
4. Verify badge updates as you mark alerts as investigating/resolved

---

## Expected Behavior

### Dashboard Statistics:
- ✅ Poaching alerts count updates every 6 seconds
- ✅ Animal identification stats update every 8 seconds
- ✅ Emergency sightings update every 6 seconds
- ✅ Real-time "Live Sync" indicator pulsing

### Alert Notifications:
- ✅ Critical alerts trigger toast notification on dashboard load
- ✅ Red pulsing badge appears in header when alerts pending
- ✅ Badge count decreases as alerts are reviewed

### Alert Management:
- ✅ Can view all alerts with evidence images
- ✅ Can filter by status (pending/investigating/resolved)
- ✅ Can update alert status with button clicks
- ✅ Status updates reflect immediately with optimistic UI

### Data Flow:
- ✅ User uploads image → YOLO analyzes
- ✅ Threat detected → Database insert automatic
- ✅ Admin dashboard → Queries database
- ✅ Alert appears → Admin can review
- ✅ Status update → Database updates
- ✅ UI refreshes → Shows new status

---

## Troubleshooting

### If poaching stats don't show:
1. Check YOLO service is running on port 5003
2. Verify database connection
3. Try uploading a test image with threat
4. Check browser console for errors

### If alerts don't save:
1. Verify backend is running
2. Check database schema exists
3. Look at server console for errors
4. Test API endpoint directly: `POST /api/features/poaching-detection`

### If admin login fails:
1. Check admin credentials in database
2. Verify session middleware is working
3. Clear browser cookies and try again

### If real-time updates don't work:
1. Check browser network tab
2. Verify query refetchInterval is set
3. Ensure no console errors blocking queries

---

## Success Criteria

All these should be TRUE:

- [ ] Admin dashboard loads without errors
- [ ] Poaching stats card shows numbers (not "...")
- [ ] Can navigate to poaching alerts page
- [ ] Alerts list displays correctly
- [ ] Can filter alerts by status
- [ ] Can update alert status with buttons
- [ ] Status updates reflect in UI
- [ ] Real-time refresh working (see "Live Sync" badge)
- [ ] Critical alerts show notification popup
- [ ] Header badge appears when alerts pending
- [ ] All 3 services running (5001, 5003, 5004)

---

## Manual Test: Complete Workflow

### Test Scenario: Weapon Detection

**1. Upload Test Image**
```
Go to: http://localhost:5001/features/poaching-detection
Upload image (any image, even if no weapon - for testing)
Click "Analyze for Threats"
Wait for results
```

**2. Check Database**
```
If threat level is not "none":
→ Alert should be auto-saved to database
→ Should appear in admin alerts
```

**3. View in Admin**
```
Go to: http://localhost:5001/admin/dashboard
Check Poaching Alerts card:
→ Should show unreviewed count
→ Click to view details
```

**4. Review Alert**
```
In alerts page:
→ See alert with evidence image
→ Check threat level badge color
→ View detected objects count
→ See location (if provided)
→ Click "Mark as Investigating"
```

**5. Resolve Alert**
```
Status changes to "investigating"
→ Click "Mark as Resolved"
→ Alert moves to resolved filter
→ Unreviewed count decreases
```

**6. Verify Persistence**
```
Refresh browser
→ Stats still correct
→ Alert still in resolved state
→ Review timestamp preserved
```

---

## API Testing (Optional)

Test backend directly with curl or Postman:

### Get Poaching Stats
```bash
curl http://localhost:5001/api/admin/poaching-stats \
  -H "Cookie: connect.sid=YOUR_SESSION_ID"
```

Expected response:
```json
{
  "total": 10,
  "critical": 2,
  "high": 3,
  "unreviewed": 5,
  "today": 1
}
```

### Get All Alerts
```bash
curl http://localhost:5001/api/admin/poaching-alerts?status=pending \
  -H "Cookie: connect.sid=YOUR_SESSION_ID"
```

### Update Alert Status
```bash
curl -X PATCH http://localhost:5001/api/admin/poaching-alerts/ALERT_ID/status \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=YOUR_SESSION_ID" \
  -d '{"status": "investigating"}'
```

---

## System Health Check

Run this checklist every day:

### Daily Checks:
- [ ] All services running (5001, 5003, 5004)
- [ ] Database accessible
- [ ] Admin login working
- [ ] New alerts appearing when uploaded
- [ ] Statistics updating correctly
- [ ] No console errors in browser
- [ ] No server errors in terminal

### Weekly Checks:
- [ ] Review resolved alerts
- [ ] Check database size
- [ ] Verify all images stored correctly
- [ ] Test with different image types
- [ ] Confirm real-time updates still working

---

## 🎯 All Systems Go!

Your Wild Guard Admin System is fully operational. All poaching detection, alert storage, admin notifications, and management features are working seamlessly together!
