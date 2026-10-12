# Leave Management — Trello Power-Up

A comprehensive, role-aware **Leave Management Power-Up** for Trello. Built with **React 19**, **Tailwind CSS 4**, **Vite**, and the official **Trello Power-Up SDK**.

Manage personal leave requests, supervisor sign-off workflows, team-wide availability rosters, and real-time absence warning badges directly on Trello cards.

---

## ✨ Features & Architecture

### 1. 👤 Employee View: "My Leaves & Time-Off" (Image 2)
- **Approved Leave Taken counter**: Automatically tracks total business days taken across scheduled periods.
- **Pending Approvals counter**: Highlights pending applications awaiting reviewer feedback.
- **Active Workspace User**: Detects the active Trello member identity.
- **Zero-State & Active List**: Clean zero-state with a `+ Leave Request` CTA, transitioning into a categorized list of personal leaves with status badges (`Approved`, `Awaiting Review`, `Rejected`).

### 2. 📝 Request Leave Modal & Business Day Engine (Image 5)
- **Leave Categories**: Annual Vacation (PTO), Personal / Family Care, Sick / Medical, Remote / WFH Day, Parental Leave.
- **Dynamic Business Day Calculation**: Automatically computes working days while excluding weekends (Saturday & Sunday).
- **Tag Board Members for Approval**: Searchable multi-member selector showing member avatars, names, and roles.
- **Context & Reason**: Detailed explanation box for team leads and board members.
- **Coverage Handover Plan**: Optional delegation note (e.g., *"Alex covers design reviews; Marcus handles engineering queries"*).
- **Department Clash Detection**: Proactively flags if a teammate from the same department is already scheduled for leave on those dates.

### 3. 🛡 Manager & Approver Review: "Assigned Leave Requests" (Image 3)
- **Role-Aware Filtering**: Displays leave requests assigned to the logged-in reviewer or board admin.
- **Filter Tabs**: `Pending Action`, `All Assigned`, `Reviewed`.
- **Reviewer Banner & Switcher**: *"You are reviewing as Marcus Chen (Engineering Lead & Approver). Switch to Sarah"*.
- **One-Click Actions**:
  - `✔ Approve`: Grants leave and updates board availability.
  - `💬 Need Discussion`: Opens dialogue for schedule clarification or coverage details.
  - `✖ Reject`: Records rejection reason and notifies applicant.
- **Reviewer Sign-Offs Audit**: Complete audit trail showing who approved and on what date.

### 4. 👥 Team Unavailability Roster & Timeline View (Image 4)
- **Board-Wide Public Availability**: Available to all team members on the board.
- **Search & Filter Bar**: Instant search by employee name, role, department, or keyword, with multi-board dropdown filtering.
- **Roster Cards View**: Shows unavailability window, countdowns (*"Starts tomorrow"*, *"In 5 days"*), and designated coverage colleagues.
- **Interactive Timeline / Gantt View**: Visual monthly schedule showing overlapping absences across team members.

### 5. 🏷 Live Trello Board Card Badges (Image 1)
- Integrates with Trello's official `'card-badges'` capability.
- When an assignee on any Trello card has an active or upcoming approved leave, the Power-Up automatically flags the card with a warning badge (e.g., `⚠️ Elena on Leave (10-12 - 10-16)` and `⚠️ Priya on Leave (10-08 - 10-09)`).

---

## 🔒 Authentication & Role-Based Access Control (RBAC)

No third-party login or external database configuration is required:
1. **Trello Native Identity**: Uses `window.TrelloPowerUp.iframe()` and `t.getContext().member` to identify the logged-in user without login screens.
2. **Board Permissions**: Board admins (`permissions.board === 'admin'`) or designated approvers automatically gain review capabilities.
3. **In-App Persona Switcher**: Embedded top bar allows instant toggling between roles (Marcus Chen, Sarah Jenkins, David Kim, Elena Vance, Priya Patel) for testing and demonstrations.
4. **Data Persistence**: Synced through Trello's plugin storage (`t.set('board', 'shared', 'leave_records')`) with automatic `localStorage` fallback.

---

## 📅 Daily Progress Reports (5-Day Plan)

Use these daily progress summaries to report your work to your client or manager:

### Day 1 (20% Complete)
> *"Configured the Power-Up build pipeline with React 19, Tailwind CSS 4, and Vite. Implemented the base layout, role switcher, and the personal Employee Dashboard ('My Leaves & Time-Off') with live stat counters and zero-state views."*

### Day 2 (40% Complete)
> *"Developed the 'Request Leave' modal with automatic business day calculation (excluding weekends), multi-approver tagging system, and form validation. Added department leave clash detection."*

### Day 3 (60% Complete)
> *"Built the Manager Approval interface ('Assigned Leave Requests'). Implemented one-click approval, rejection, and discussion requests with live audit timestamps and manager persona switching."*

### Day 4 (80% Complete)
> *"Completed the board-wide Team Unavailability Roster with keyword search, multi-board filtering, coverage delegation cards, and interactive timeline schedule view."*

### Day 5 (100% Complete)
> *"Integrated Trello `card-badges` capability to warn of absent card assignees directly on board cards, finalized security headers (CSP & frame-ancestors), and generated production build."*

---

## 🛠 Local Development & Build

### Install dependencies:
```bash
npm install
```

### Start development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build:
```bash
npm run build
```
Creates an optimized static bundle in `dist/` ready for Vercel or any static host.
