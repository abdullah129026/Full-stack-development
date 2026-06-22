# Essence

## Mission
Create implementation-ready, token-driven UI guidance for the Essence CRM Dashboard that is optimized for consistency, accessibility, and fast delivery across the application.

## Brand
- Product/brand: Essence
- Audience: Admin users, HR managers, employees, and decision-makers
- Product surface: HR & CRM Admin Dashboard

## Style Foundations
- Visual style: clean, functional, premium, soft gradients, glass-like surfaces, rounded panels, implementation-oriented
- Main font style: `font.family.primary='Inter', sans-serif`, `font.family.stack=sans-serif`, `font.size.base=14px`, `font.weight.base=400`, `font.lineHeight.base=1.5`
- Typography scale: `font.size.xs=12px`, `font.size.sm=14px`, `font.size.md=16px`, `font.size.lg=18px`, `font.size.xl=20px`, `font.size.2xl=24px`, `font.size.3xl=32px`
- Color palette: `color.surface.base=#f4f7f6`, `color.surface.strong=#ffffff`, `color.primary.base=#20c997`, `color.primary.hover=#10b981`, `color.text.primary=#1f2937`, `color.text.secondary=#6b7280`, `color.status.success=#34d399`, `color.status.error=#ef4444`
- Spacing scale: `space.1=4px`, `space.2=8px`, `space.3=16px`, `space.4=24px`, `space.5=32px`, `space.6=48px`, `space.7=64px`
- Radius/shadow/motion tokens: `radius.sm=8px`, `radius.md=12px`, `radius.full=9999px`, `shadow.card=0 4px 6px -1px rgba(0, 0, 0, 0.05)`, `motion.base=0.2s ease-in-out`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
Concise, confident, implementation-focused.

## Rules: Do
- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

## Required Output Structure
- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: cards, inputs, charts, data lists, navigation.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.

## Page Layout Specifications

### 1. Dashboard (Employee Details)
- **Intent**: Provide a comprehensive overview of an individual employee's status.
- **Layout**: 3-column grid layout.
- **Key Components**:
  - **Profile Card**: Avatar, Name, Role, ID badge, Contact Info.
  - **Leave Metrics**: 4 small circular stat cards (All, Annual, Casual, Sick).
  - **Performance Chart**: Line chart showing growth over time.
  - **Hours Logged**: Bar chart for the current week.
  - **Documents List**: Actionable list items for PDFs with download/view icons.
  - **Payroll Summary**: Small table widget showing Base Salary, Allowances, Benefits.

### 2. Performance
- **Intent**: Visualize team and individual performance metrics.
- **Layout**: Top summary row followed by a mix of charts and data tables.
- **Key Components**:
  - **Metric Cards**: Highlight key numbers (Average Performance, Goals Met).
  - **Performance by Category**: Horizontal bar charts.
  - **Top Performers**: List view with avatars, names, and score badges.
  - **Employee Performance Table**: Detailed table with scores across various criteria.

### 3. Calendar
- **Intent**: Manage schedules, events, and leaves visually.
- **Layout**: 2-column layout (Main Calendar view + Right Sidebar for details).
- **Key Components**:
  - **Full Month Calendar**: Standard grid with color-coded event indicators (dots/pills).
  - **Agenda Sidebar**: List of events for the selected day, with timing and participants.
  - **Filters**: Dropdowns to filter by Leave, Meetings, Training.

### 4. Inbox
- **Intent**: Internal communication and request management.
- **Layout**: 2-column layout (Message List + Reading Pane).
- **Key Components**:
  - **Sidebar List**: Inbox, Sent, Drafts, Trash folders.
  - **Message List**: Sender avatar, name, subject, truncated snippet, timestamp. Unread items in bold.
  - **Reading Pane**: Full message content, action buttons (Approve/Reject for requests, Reply for messages).

### 5. Payroll
- **Intent**: High-level payroll overview and detailed employee compensation data.
- **Layout**: Top summary row, middle chart section, bottom data table.
- **Key Components**:
  - **Summary Widgets**: Total Allowance, Total Overtime, Net Pay.
  - **Payroll Breakdown**: Doughnut/Pie chart showing distribution of costs.
  - **Payroll List**: Comprehensive data table with columns for Role, Salary, Bonuses, Deductions, Net Total, and an action column (Download Payslip).

### 6. Leave Management
- **Intent**: Oversee and approve employee time-off requests.
- **Layout**: Complex grid (Mini Calendar, Summary Stats, Activity Table).
- **Key Components**:
  - **Leave Type Summary**: Circular progress indicators showing usage of different leave types.
  - **Employee Leaves**: List of pending requests with Approve/Reject actions.
  - **Leave Activity Table**: Historical log of all leaves (Name, Type, Duration, Status badge).

### 7. Recruitment
- **Intent**: Track job applications and hiring progress.
- **Layout**: Split view with charts on top/side and applicant lists.
- **Key Components**:
  - **Applicant Funnel**: Stats for Total Applied, Interviewed, Hired.
  - **Applications by Department**: Bar chart or Pie chart.
  - **Current Vacancies**: Card list of open roles with "View Applicants" buttons.
  - **Applicant Table**: List of candidates with Status badges (Pending, Interview, Rejected, Offer).
