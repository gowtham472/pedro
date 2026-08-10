# PEDRO

## Career Exploration & Aptitude Profiling Platform

**Product Requirements Document (PRD)**\
**Version:** 1.0\
**Status:** Product Definition / MVP + V1\
**Product Type:** Web Application\
**Primary Audience:** College students and early-career learners who are
unsure which technology domain suits them\
**Primary Goal:** Help users explore multiple technology domains through
short guided learning experiences and practical tasks, then produce an
evidence-based career exploration report.

------------------------------------------------------------------------

# 1. Executive Summary

Pathfinder is a privacy-first web application designed to help students
discover which technology domains may fit their interests, learning
behaviour, problem-solving style, and current aptitude.

Instead of asking a student to select a career through a questionnaire,
Pathfinder places the student inside a seven-day guided exploration
journey. Each day introduces a different domain through a short learning
module followed by practical tasks.

The platform evaluates four major dimensions:

1.  **Performance** -- How accurately and successfully the user
    completes tasks.
2.  **Learning Velocity** -- How quickly the user improves after
    receiving instruction and feedback.
3.  **Engagement** -- How actively and persistently the user interacts
    with the task.
4.  **Preference** -- What the user reports enjoying, finding
    interesting, and wanting to explore further.

Optional behavioural telemetry such as mouse interactions, task
navigation, scrolling, and coarse attention signals may be collected
with explicit consent. Optional browser-based gaze estimation may be
supported as an experimental signal, but it must never be treated as a
definitive measure of interest, intelligence, attention, or career
suitability.

At the end of the journey, Pathfinder generates a Career Exploration
Report that explains the user's strongest domains, supporting evidence,
areas for improvement, and suggested next steps.

Pathfinder does **not** claim to scientifically determine a user's ideal
career. It provides a structured exploration and evidence-based
recommendation to help the user make a better-informed decision.

------------------------------------------------------------------------

# 2. Problem Statement

Many students choose technology careers based on:

-   social media trends
-   salary lists
-   peer pressure
-   college placement statistics
-   popular certifications
-   fear of missing out
-   incomplete understanding of what a job actually involves

A student may believe:

> "I am bad at coding, so software is not for me."

Another may believe:

> "DevOps pays well and does not require coding, so I should choose
> DevOps."

Both conclusions may be wrong.

A student can only meaningfully evaluate a domain after experiencing the
type of work involved.

Pathfinder solves this by turning career exploration into a practical
experiment.

------------------------------------------------------------------------

# 3. Product Vision

> **Let students experience technology careers before committing to
> one.**

Pathfinder should feel less like an exam and more like a seven-day
interactive career laboratory.

The experience should be:

-   practical
-   engaging
-   non-judgmental
-   evidence-based
-   transparent
-   privacy-conscious
-   beginner-friendly

------------------------------------------------------------------------

# 4. Product Principles

## 4.1 Experience before recommendation

The system should expose the student to actual activities from each
domain before making recommendations.

## 4.2 Performance is not preference

A student may perform poorly but enjoy a domain.

A student may perform well but dislike a domain.

Both signals matter.

## 4.3 Learning velocity matters

A beginner should not be penalized simply for starting with low
knowledge.

The platform should measure improvement.

## 4.4 Behaviour is supporting evidence

Telemetry can reveal useful interaction patterns, but behaviour must not
be interpreted as psychological certainty.

## 4.5 Explain every recommendation

Every recommendation must be traceable to observable evidence.

## 4.6 Privacy by design

Collect the minimum information necessary.

## 4.7 No deterministic career claims

The system should say:

> "This domain appears to be a strong fit based on your exploration."

It should never say:

> "You are definitely meant to become a DevOps engineer."

------------------------------------------------------------------------

# 5. Target Users

## Primary Persona: The Confused Student

Typical characteristics:

-   18--25 years old
-   studying CSE/IT/ECE or a related degree
-   has little practical exposure to technology domains
-   feels pressure to get placed
-   wants a stable career
-   may have weak confidence
-   does not know what different technology roles actually involve

## Secondary Persona: Career Switcher

A learner who wants to transition into technology but does not know
which domain to choose.

## Future Persona: Institution / Placement Cell

A college or training organization that wants structured career
exploration for students.

------------------------------------------------------------------------

# 6. Domains Covered in the Seven-Day Journey

The MVP should cover six exploratory domains and one choice-based final
day.

  -----------------------------------------------------------------------
  Day                     Domain                  Primary Skills Explored
  ----------------------- ----------------------- -----------------------
  1                       Software Development    Programming
                                                  fundamentals, debugging

  2                       Problem Solving / DSA   Logic, algorithms,
                                                  structured reasoning

  3                       UI/UX Design            Creativity, visual
                                                  hierarchy, iteration

  4                       Data & Analytics        SQL, data
                                                  interpretation,
                                                  visualization

  5                       Cloud & DevOps          Linux, systems,
                                                  automation,
                                                  troubleshooting

  6                       Cybersecurity           Investigation,
                                                  attention to detail,
                                                  security reasoning

  7                       Free Choice / Build     User-selected domain,
                                                  independent execution
  -----------------------------------------------------------------------

The domain list should be configurable so future versions can add:

-   AI/ML
-   Data Engineering
-   Embedded Systems
-   Mobile Development
-   Product Management
-   Technical Writing
-   QA Automation
-   Networking
-   Game Development

------------------------------------------------------------------------

# 7. Seven-Day User Journey

## Day 0: Onboarding

The user:

1.  creates an account
2.  reads the purpose of Pathfinder
3.  provides consent for telemetry
4.  optionally enables webcam-based gaze estimation
5.  completes a short baseline questionnaire
6.  receives an explanation of the seven-day process

### Baseline questions

Examples:

-   What technology areas have you tried before?
-   How confident are you with programming?
-   How confident are you with logical reasoning?
-   How confident are you with design?
-   How confident are you with data?
-   How curious are you about cloud technologies?
-   How interested are you in cybersecurity?

The baseline should be used as context, not as the primary
recommendation mechanism.

------------------------------------------------------------------------

# 8. Day 1: Software Development

## Objective

Evaluate the user's ability to learn basic programming concepts and
their response to debugging and coding.

## Learning Module

Topics:

-   variables
-   data types
-   conditions
-   loops
-   functions
-   arrays
-   basic debugging

Estimated learning time:

**30--45 minutes**

## Tasks

### Task 1: Beginner

Write a program that prints numbers according to a condition.

### Task 2: Intermediate

Find the largest value in an array.

### Task 3: Challenge

Solve a simple string or array problem.

## Metrics

-   compilation success
-   correctness
-   number of attempts
-   time to first submission
-   time spent debugging
-   hint usage
-   number of successful retries
-   final solution quality
-   self-reported enjoyment

------------------------------------------------------------------------

# 9. Day 2: Problem Solving / DSA

## Objective

Separate programming syntax from logical reasoning.

## Learning Module

Topics:

-   algorithmic thinking
-   breaking a problem into steps
-   arrays
-   searching
-   sorting concepts
-   complexity intuition

## Tasks

Provide three progressively difficult problems.

Example:

1.  Find duplicates.
2.  Find the second-largest value.
3.  Optimize a simple brute-force solution.

## Behavioural Signals

-   whether the user reads the entire problem
-   time before first action
-   number of approaches attempted
-   use of hints
-   retry behaviour
-   improvement after hints
-   abandonment rate

------------------------------------------------------------------------

# 10. Day 3: UI/UX Design

## Objective

Evaluate creativity, visual reasoning, iteration, and design engagement.

## Learning Module

Topics:

-   layout
-   spacing
-   typography
-   color
-   hierarchy
-   components
-   basic user experience

## Tool

MVP may provide an embedded simplified design canvas.

Future versions may integrate a third-party design platform.

## Challenge

> Design a login screen for a college application.

Optional advanced task:

> Create a simple dashboard for the same application.

## Metrics

-   number of design elements
-   layout consistency
-   iteration count
-   time spent designing
-   visual hierarchy
-   completion
-   self-reported enjoyment
-   voluntary exploration

Automated visual scoring should be advisory, not authoritative.

------------------------------------------------------------------------

# 11. Day 4: Data & Analytics

## Objective

Evaluate analytical reasoning and comfort with structured information.

## Learning Module

Topics:

-   tables
-   SQL SELECT
-   filtering
-   sorting
-   aggregation
-   GROUP BY
-   basic JOIN concepts
-   charts

## Dataset

Example:

A simulated food-delivery dataset containing:

-   order ID
-   customer
-   city
-   restaurant
-   order value
-   date
-   delivery time
-   rating

## Tasks

1.  Find the highest-revenue city.
2.  Find the highest-selling category.
3.  Calculate average order value.
4.  Identify an unusual pattern.
5.  Create a simple visualization.

## Metrics

-   query correctness
-   analytical accuracy
-   exploration
-   visualization quality
-   number of queries
-   time spent
-   improvement
-   curiosity signals

------------------------------------------------------------------------

# 12. Day 5: Cloud & DevOps

## Objective

Expose the user to systems thinking, infrastructure, troubleshooting,
automation, and deployment.

## Learning Module

Topics:

-   Linux basics
-   files and permissions
-   processes
-   networking fundamentals
-   HTTP
-   DNS
-   Docker
-   cloud concepts
-   CI/CD concepts

## Simulation

Instead of requiring a paid cloud account, MVP should use a safe
simulated cloud environment.

Example mission:

> "A company's website is unavailable. Investigate the system and
> restore service."

The environment provides:

-   server status
-   application logs
-   CPU metrics
-   network information
-   configuration files
-   simulated services

## Tasks

1.  Navigate a Linux environment.
2.  identify a service problem.
3.  inspect logs.
4.  identify the root cause.
5.  fix the simulated problem.
6.  restart/deploy the application.

## Metrics

-   troubleshooting steps
-   time to first diagnostic action
-   commands used
-   successful fixes
-   hypothesis changes
-   persistence
-   hint usage
-   task completion
-   engagement

------------------------------------------------------------------------

# 13. Day 6: Cybersecurity

## Objective

Evaluate investigation, attention to detail, pattern recognition, and
security reasoning.

## Learning Module

Topics:

-   authentication
-   authorization
-   HTTP basics
-   logs
-   suspicious activity
-   common security mistakes

## Tasks

### Task 1

Identify suspicious login activity.

### Task 2

Find the security mistake in a simulated application.

### Task 3

Analyze logs and identify the likely incident.

All activities must occur inside a controlled sandbox.

The product must not instruct users to attack real systems.

## Metrics

-   correct findings
-   evidence used
-   investigation path
-   time
-   attention to relevant information
-   persistence
-   self-reported interest

------------------------------------------------------------------------

# 14. Day 7: Independent Build

This is the most important day.

The user chooses the domain they want to explore further.

The system presents the top three domains from previous days plus an
option to choose any domain.

## Example Projects

### Software

Build a small Java application.

### Design

Create a three-screen mobile application concept.

### Data

Analyze a dataset and create a dashboard.

### DevOps

Deploy a provided application inside a sandbox.

### Cybersecurity

Investigate a simulated security incident.

### DSA

Solve a structured set of progressively difficult problems.

## Why Day 7 matters

The user is no longer assigned a domain.

Their voluntary choice becomes an additional preference signal.

------------------------------------------------------------------------

# 15. Task Architecture

Every task should follow a standardized structure.

``` text
Task
├── Introduction
├── Learning Material
├── Example
├── Practice
├── Challenge
├── Optional Hint
├── Submission
├── Feedback
└── Reflection
```

Each task should contain:

-   task ID
-   domain
-   difficulty
-   estimated duration
-   learning objectives
-   prerequisite concepts
-   evaluation method
-   hints
-   expected output
-   telemetry configuration

------------------------------------------------------------------------

# 16. Event Tracking System

The platform should use an event-based telemetry system.

Example event:

``` json
{
  "event": "task_started",
  "userId": "anonymous-or-internal-id",
  "sessionId": "session-id",
  "taskId": "java-array-02",
  "timestamp": "2026-08-10T10:30:00Z"
}
```

Possible events:

-   session_started
-   lesson_started
-   lesson_completed
-   task_started
-   task_paused
-   task_resumed
-   task_submitted
-   task_completed
-   task_failed
-   hint_opened
-   hint_completed
-   retry_started
-   code_run
-   code_error
-   design_created
-   design_modified
-   query_executed
-   terminal_command
-   navigation
-   scroll
-   click
-   reflection_submitted
-   day_completed

Do not collect arbitrary keystrokes by default.

Never collect:

-   passwords
-   authentication tokens
-   private messages
-   clipboard contents without explicit purpose
-   unrelated browsing activity
-   data outside the Pathfinder application

------------------------------------------------------------------------

# 17. Mouse Tracking

Mouse telemetry may include:

-   click coordinates relative to the application
-   click timestamp
-   cursor movement summaries
-   hover duration
-   scroll direction
-   scroll amount

The system should preferably store derived metrics rather than
high-frequency raw coordinates.

Example:

``` json
{
  "taskId": "devops-03",
  "clickCount": 37,
  "activeInteractionSeconds": 842,
  "scrollDistance": 1630,
  "retryCount": 4
}
```

Mouse activity must not be interpreted directly as intelligence,
personality, or career aptitude.

------------------------------------------------------------------------

# 18. Eye Tracking

Eye tracking is an optional experimental feature.

## Requirements

-   explicit consent
-   clear webcam permission explanation
-   visible indicator when active
-   easy disable control
-   local processing where technically feasible
-   no raw video storage by default
-   deletion capability

The system may calculate:

-   approximate gaze coordinates
-   time spent in predefined task regions
-   attention distribution
-   calibration quality

The system must not make claims such as:

> "You looked at this section longer, therefore you are more
> intelligent."

Gaze data should only contribute a small amount to
engagement/interaction analysis.

------------------------------------------------------------------------

# 19. Reflection System

After every major task, show a short reflection.

### Questions

**Enjoyment** \> How much did you enjoy this?

1--5

**Difficulty** \> How difficult was this?

1--5

**Curiosity** \> Would you like to learn more about this?

1--5

**Persistence** \> How willing were you to keep going when stuck?

1--5

**Future Interest** \> Would you consider doing this professionally?

1--5

Optional:

> What did you like or dislike?

------------------------------------------------------------------------

# 20. Scoring Model

The recommendation engine should combine multiple evidence categories.

## 20.1 Performance Score

Measures task outcomes.

Possible inputs:

-   accuracy
-   completion
-   quality
-   correctness
-   successful attempts

## 20.2 Learning Velocity Score

Measures improvement relative to the user's own earlier performance.

Example:

``` text
Initial attempt: 42%
Second attempt: 68%
Third attempt: 84%

Learning velocity: High
```

The system should avoid comparing beginners directly against advanced
users.

## 20.3 Engagement Score

Possible signals:

-   active time
-   voluntary exploration
-   task completion
-   persistence
-   retry behaviour
-   optional interaction signals

## 20.4 Preference Score

Based on:

-   enjoyment
-   curiosity
-   willingness to continue
-   professional interest
-   Day 7 choice

------------------------------------------------------------------------

# 21. Recommended Domain Score

A domain score may be calculated as:

``` text
Domain Score =
    30% Performance
  + 25% Learning Velocity
  + 20% Engagement
  + 25% Preference
```

These weights must be configurable.

The exact weighting should be validated through user testing and should
not be presented as scientifically validated unless independently
validated.

------------------------------------------------------------------------

# 22. Confidence Score

Every recommendation should have a confidence indicator.

Example:

``` text
DevOps
Score: 86/100
Confidence: High
```

Confidence should depend on:

-   number of completed tasks
-   quality of collected evidence
-   consistency across signals
-   missing data
-   telemetry quality

If a user skips multiple tasks:

``` text
Confidence: Low
```

The system must not produce overly confident recommendations from
insufficient evidence.

------------------------------------------------------------------------

# 23. Recommendation Logic

Example:

``` text
IF
    high learning velocity
    AND high engagement
    AND high preference
    AND adequate task performance

THEN
    strong candidate domain

IF
    high performance
    BUT low preference

THEN
    "You perform well here, but may not enjoy it."

IF
    low performance
    BUT high learning velocity
    AND high preference

THEN
    "You may have strong growth potential here."

IF
    low performance
    AND low preference
    AND low engagement

THEN
    "Currently appears to be a weaker fit."
```

The recommendation engine must be transparent.

------------------------------------------------------------------------

# 24. Final Career Report

The final report should contain:

## Executive Summary

> "Your seven-day exploration suggests that Cloud & DevOps and Data &
> Analytics currently fit your working style most strongly."

## Top Domains

Display top three domains.

For each:

-   score
-   confidence
-   strengths
-   evidence
-   observed behaviour
-   recommended next step

## Domain Comparison

Example:

  ----------------------------------------------------------------------------
  Domain       Performance     Learning   Engagement   Preference   Confidence
  ---------- ------------- ------------ ------------ ------------ ------------
  Software              63           71           52           44       Medium

  DSA                   55           64           42           38       Medium

  Design                82           89           93           91         High

  Data                  76           84           79           82         High

  DevOps                85           92           90           88         High

  Security              71           77           82           76       Medium
  ----------------------------------------------------------------------------

## Strength Profile

Examples:

-   persistent troubleshooting
-   visual creativity
-   analytical reasoning
-   structured thinking
-   rapid learning
-   attention to detail

## Growth Areas

Examples:

-   algorithmic problem solving
-   debugging patience
-   technical fundamentals
-   communication

## Recommended Exploration Path

Example:

``` text
Primary:
Cloud / DevOps

Secondary:
Data Engineering

Explore:
UI/UX

Improve:
Problem Solving
```

The system should explain why each recommendation was made.

------------------------------------------------------------------------

# 25. User Dashboard

The dashboard should show:

-   current day
-   progress
-   completed domains
-   task history
-   performance
-   learning progress
-   reflections
-   domain radar/profile
-   final report when complete

Avoid showing competitive leaderboards.

This is a personal discovery experience, not an academic ranking system.

------------------------------------------------------------------------

# 26. Admin Dashboard

Administrators should be able to:

-   create domains
-   create lessons
-   create tasks
-   configure difficulty
-   create hints
-   configure scoring
-   view aggregate analytics
-   monitor completion
-   identify broken tasks
-   manage users
-   manage consent settings
-   export anonymized aggregate data

Admin should not have unrestricted access to sensitive raw telemetry.

------------------------------------------------------------------------

# 27. Content Management

Tasks should be data-driven.

Example schema:

``` json
{
  "taskId": "devops-001",
  "domain": "cloud-devops",
  "title": "Find the Broken Service",
  "difficulty": "beginner",
  "estimatedMinutes": 30,
  "learningObjectives": [
    "Read logs",
    "Understand service status",
    "Identify root cause"
  ],
  "evaluation": {
    "type": "simulation",
    "passingScore": 70
  },
  "hints": [
    "Check the application logs",
    "Look for recent configuration changes"
  ]
}
```

This allows new tasks to be added without rebuilding the application.

------------------------------------------------------------------------

# 28. UX Requirements

The interface should feel modern, calm, and focused.

## Visual Direction

-   clean dashboard
-   strong typography
-   subtle animations
-   progress indicators
-   clear task cards
-   minimal distractions
-   dark/light mode
-   accessible contrast
-   responsive design

Avoid making the application look like an exam portal.

The emotional experience should be:

> "I'm exploring."

Not:

> "I'm being judged."

------------------------------------------------------------------------

# 29. Onboarding UX

The first screen should communicate:

> **You don't need to know what career you want yet.**

Then:

> **Spend seven days exploring. We'll help you understand what fits
> you.**

Show:

``` text
Day 1  Software
Day 2  Problem Solving
Day 3  Design
Day 4  Data
Day 5  Cloud & DevOps
Day 6  Cybersecurity
Day 7  Your Choice
```

Then explain data collection and request consent.

------------------------------------------------------------------------

# 30. Privacy & Consent

Privacy is a core product requirement.

## Consent Categories

Users should separately consent to:

1.  Basic application analytics
2.  Interaction telemetry
3.  Optional webcam/gaze estimation
4.  Research/aggregate data usage

Consent should not be bundled into one confusing checkbox.

## Data Minimization

Collect only what is needed.

## Data Retention

Define a configurable retention period.

Example:

-   account data: retained while account exists
-   raw telemetry: short retention
-   aggregated scores: longer retention
-   raw webcam video: never stored by default

## User Controls

Users should be able to:

-   view what data is collected
-   disable optional tracking
-   delete their account
-   request deletion of associated data
-   export their results

------------------------------------------------------------------------

# 31. Security Requirements

-   HTTPS everywhere
-   secure authentication
-   hashed passwords
-   session security
-   role-based access control
-   encrypted sensitive data at rest where appropriate
-   secure API authorization
-   input validation
-   rate limiting
-   audit logging
-   sandboxed code execution
-   no arbitrary code execution on the primary application server

------------------------------------------------------------------------

# 32. Code Execution Sandbox

Coding tasks require strong isolation.

Architecture:

``` text
Browser
   |
   v
Application API
   |
   v
Job Queue
   |
   v
Isolated Execution Worker
   |
   +-- CPU limit
   +-- Memory limit
   +-- Time limit
   +-- Network disabled
   +-- Temporary filesystem
   +-- Container isolation
   |
   v
Result
```

The worker should return:

-   stdout
-   stderr
-   exit code
-   execution time
-   resource usage
-   evaluation result

Never execute submitted code directly inside the web server process.

------------------------------------------------------------------------

# 33. Suggested Technical Architecture

## Frontend

Recommended:

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   component library
-   charting library

## Backend

Recommended:

-   Node.js
-   NestJS or Express
-   TypeScript

Alternative:

-   Spring Boot if the team prefers Java

## Database

-   PostgreSQL

## Cache / Queue

-   Redis

## Object Storage

-   S3-compatible storage

## Analytics

Initial MVP:

-   backend aggregation

Later:

-   Python analytics service
-   feature pipeline
-   recommendation engine

## Deployment

Possible architecture:

``` text
Cloudflare / CDN
        |
     Next.js
        |
    API Gateway
        |
    Backend API
   /    |     \
 DB   Redis   Queue
             |
        Worker Pool
        /    |    \
    Coding  Data  Simulations
```

------------------------------------------------------------------------

# 34. Core Database Entities

## User

``` text
id
email
name
created_at
timezone
status
```

## Consent

``` text
id
user_id
analytics_consent
interaction_consent
gaze_consent
research_consent
created_at
revoked_at
```

## Domain

``` text
id
name
description
icon
active
```

## Lesson

``` text
id
domain_id
title
content
estimated_minutes
order
```

## Task

``` text
id
domain_id
lesson_id
title
description
difficulty
evaluation_type
estimated_minutes
```

## TaskAttempt

``` text
id
user_id
task_id
started_at
completed_at
score
attempt_number
hint_count
```

## Event

``` text
id
user_id
session_id
task_id
event_type
timestamp
metadata
```

## Reflection

``` text
id
user_id
task_id
enjoyment
difficulty
curiosity
future_interest
comment
```

## DomainScore

``` text
id
user_id
domain_id
performance_score
learning_score
engagement_score
preference_score
overall_score
confidence
```

------------------------------------------------------------------------

# 35. API Structure

Example endpoints:

``` text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout

GET    /api/journey
GET    /api/journey/current

GET    /api/domains
GET    /api/domains/:id
GET    /api/tasks/:id

POST   /api/tasks/:id/start
POST   /api/tasks/:id/submit
POST   /api/tasks/:id/hint

POST   /api/events
POST   /api/reflections

GET    /api/profile
GET    /api/results
GET    /api/report

GET    /api/consent
POST   /api/consent
DELETE /api/account
```

Admin:

``` text
GET    /api/admin/users
POST   /api/admin/domains
POST   /api/admin/tasks
PUT    /api/admin/tasks/:id
DELETE /api/admin/tasks/:id

GET    /api/admin/analytics
GET    /api/admin/task-performance
```

------------------------------------------------------------------------

# 36. Analytics Events

Event collection should be asynchronous and lightweight.

Example:

``` json
{
  "eventType": "hint_opened",
  "sessionId": "session-123",
  "taskId": "dsa-002",
  "timestamp": "2026-08-10T12:34:56Z",
  "properties": {
    "hintNumber": 1
  }
}
```

Do not include sensitive user content in generic event metadata.

------------------------------------------------------------------------

# 37. Accessibility

The application should target WCAG 2.2 AA where practical.

Requirements:

-   keyboard navigation
-   semantic HTML
-   visible focus states
-   screen-reader labels
-   sufficient contrast
-   accessible charts
-   reduced motion support
-   captions/transcripts for instructional content
-   avoid colour-only indicators

------------------------------------------------------------------------

# 38. Mobile Strategy

The seven-day platform should be responsive.

However:

-   coding tasks are better on desktop
-   Linux simulation is better on desktop
-   design tasks require larger screens

The system should detect device limitations and communicate them.

Example:

> "This activity works best on a laptop or desktop."

Do not block mobile access to normal lessons and reflections.

------------------------------------------------------------------------

# 39. Notifications

Optional reminders:

> "Your Day 3 exploration is ready."

Users should control reminder settings.

No aggressive engagement loops.

------------------------------------------------------------------------

# 40. Gamification

Use light gamification:

-   journey progress
-   streak for completing the seven-day journey
-   domain discovery badges
-   exploration milestones

Avoid:

-   public leaderboards
-   competitive rankings
-   shame-based messaging
-   "you are worse than 73% of users"

The purpose is self-discovery, not competition.

------------------------------------------------------------------------

# 41. MVP Scope

## Must Have

-   authentication
-   onboarding
-   consent
-   seven-day journey
-   six domains
-   lessons
-   practical tasks
-   task scoring
-   reflections
-   event tracking
-   domain scoring
-   final report
-   privacy controls
-   admin content management

## Should Have

-   coding sandbox
-   simulated DevOps environment
-   SQL sandbox
-   design canvas
-   interactive cybersecurity simulation
-   visual analytics dashboard

## Could Have

-   optional gaze estimation
-   AI-generated feedback
-   personalized learning path
-   advanced behavioural analytics
-   institutional dashboard

## Won't Have in MVP

-   real job placement guarantees
-   personality diagnosis
-   medical/psychological assessment
-   automated hiring decisions
-   public rankings
-   real-world penetration testing
-   raw webcam recording

------------------------------------------------------------------------

# 42. MVP Development Phases

## Phase 1: Foundation

Build:

-   authentication
-   onboarding
-   consent
-   database
-   dashboard
-   journey engine

## Phase 2: Task Engine

Build:

-   lessons
-   tasks
-   submissions
-   hints
-   reflections
-   scoring

## Phase 3: Domain Simulations

Implement:

-   coding environment
-   DSA challenges
-   design task
-   SQL/data task
-   DevOps simulation
-   security simulation

## Phase 4: Analytics

Implement:

-   event pipeline
-   domain scoring
-   learning velocity
-   engagement metrics
-   confidence scoring

## Phase 5: Report

Implement:

-   final results
-   evidence explanations
-   domain comparison
-   recommendations
-   next steps

## Phase 6: Optional Experimental Signals

Implement:

-   mouse interaction summaries
-   optional gaze estimation
-   advanced behavioural metrics

These should come after the core experience works.

------------------------------------------------------------------------

# 43. Success Metrics

## Product Metrics

### Completion Rate

Percentage of users completing all seven days.

Target for initial beta:

> 60%+

### Task Completion

Target:

> 80% of started tasks completed.

### Reflection Completion

Target:

> 85%+

### Report Generation

Target:

> 90% of users who finish Day 7 receive a report.

------------------------------------------------------------------------

# 44. Quality Metrics

The platform should evaluate whether recommendations are useful.

After the report, ask:

> "Did this result feel accurate?"

Then:

1--5 rating.

Also:

> "Did Pathfinder help you understand what to explore next?"

1--5.

Longer-term validation:

-   Did the user continue learning the recommended domain?
-   Did the user complete a course?
-   Did the user build a project?
-   Did the user eventually enter the domain?

These are more meaningful than simply predicting a career from seven
days of activity.

------------------------------------------------------------------------

# 45. Recommendation Validation

Pathfinder should eventually run longitudinal validation.

Example:

``` text
Day 7:
Recommended DevOps

After 3 months:
User continues DevOps learning

After 6 months:
User completes DevOps project

After 12 months:
User obtains internship/job
```

This data can help determine whether the recommendation methodology
actually works.

Until sufficient validation exists, the system should describe
recommendations as exploratory rather than scientifically proven.

------------------------------------------------------------------------

# 46. AI Usage

AI may assist with:

-   explaining concepts
-   generating hints
-   giving code feedback
-   explaining errors
-   summarizing reflections
-   generating report narratives

AI should not independently decide:

> "You should become a cybersecurity engineer."

The recommendation engine should remain evidence-driven and auditable.

AI-generated explanations should reference actual collected evidence.

------------------------------------------------------------------------

# 47. Example Final User Experience

After seven days:

``` text
----------------------------------------
        YOUR PATHFINDER REPORT
----------------------------------------

Your strongest exploration areas:

1. Cloud & DevOps       87
2. Data & Analytics     82
3. UI/UX Design         78

----------------------------------------

YOUR WORKING STYLE

You showed strong persistence during
troubleshooting tasks and improved
quickly after receiving feedback.

----------------------------------------

WHY DEVOPS RANKED HIGH

✓ 91% task completion
✓ High learning velocity
✓ Strong troubleshooting persistence
✓ 4.5/5 average curiosity
✓ Chosen voluntarily on Day 7

Confidence: HIGH

----------------------------------------

YOUR NEXT STEP

Spend the next 30 days exploring:

Linux
Networking
Docker
AWS fundamentals
CI/CD

Suggested project:
Deploy a simple web application.

----------------------------------------

IMPORTANT

This report is an exploration result,
not a guaranteed career prediction.

You are encouraged to test the domain
further before making a career decision.
----------------------------------------
```

------------------------------------------------------------------------

# 48. Ethical Boundaries

Pathfinder must never be marketed as:

-   a psychological diagnostic tool
-   an IQ test
-   a guaranteed career predictor
-   a hiring assessment
-   a mental-health assessment
-   a biometric personality detector

The product should avoid sensitive inferences such as:

-   intelligence
-   mental health
-   personality disorders
-   neurological conditions
-   protected characteristics

Behavioural telemetry should only be used for clearly stated product
purposes.

------------------------------------------------------------------------

# 49. Threat Model

Potential threats:

## Data leakage

Mitigation:

-   encryption
-   access control
-   minimum collection
-   retention policies

## Code execution attack

Mitigation:

-   isolated workers
-   network restrictions
-   CPU/memory limits
-   timeouts

## Telemetry abuse

Mitigation:

-   role-based access
-   aggregated metrics
-   audit logs

## Webcam abuse

Mitigation:

-   explicit permission
-   visible status
-   local processing where possible
-   no raw video storage by default

## Recommendation manipulation

Mitigation:

-   transparent scoring
-   immutable task results
-   anomaly detection
-   auditable recommendation logic

------------------------------------------------------------------------

# 50. Product Risks

## Risk 1: Seven days may be insufficient

Mitigation:

Position results as exploratory signals, not final truth.

## Risk 2: Users may game the system

Mitigation:

Use multiple independent signals and randomize some task variants.

## Risk 3: Beginners may perform poorly because of unfamiliarity

Mitigation:

Measure learning velocity rather than raw performance alone.

## Risk 4: Telemetry creates privacy concerns

Mitigation:

Make telemetry transparent, optional where possible, and minimized.

## Risk 5: Eye tracking produces noisy data

Mitigation:

Keep it optional and low-weight.

## Risk 6: Recommendation bias

Mitigation:

Regularly audit scoring and compare outcomes across different user
groups without making sensitive inferences.

------------------------------------------------------------------------

# 51. Future Versions

## V2

-   personalized learning path
-   AI mentor
-   adaptive task difficulty
-   more domains
-   richer simulations
-   improved report

## V3

-   college dashboard
-   career pathway mapping
-   learning-resource recommendations
-   project recommendations
-   longitudinal tracking

## V4

Potentially:

> "Pathfinder Career Lab"

A platform where students can continuously explore careers through
realistic mini-work environments.

------------------------------------------------------------------------

# 52. Long-Term Product Vision

Pathfinder should eventually move from:

> "Which domain should I choose?"

to:

> "Let me experience what this career actually feels like."

A student should be able to enter a simulated environment and spend
30--90 minutes experiencing:

-   software development
-   cloud engineering
-   data analysis
-   cybersecurity
-   UI/UX
-   AI engineering
-   product management
-   embedded engineering

Then Pathfinder can build a longitudinal profile of:

-   interests
-   strengths
-   learning velocity
-   working preferences
-   skills
-   explored domains

This turns the product into a **career exploration operating system for
students**.

------------------------------------------------------------------------

# 53. Final Product Definition

## Product Name

**Pathfinder**

## Tagline

> **Explore. Learn. Build. Discover your path.**

## Core Promise

> Pathfinder gives students a practical seven-day opportunity to
> experience different technology domains, measures how they learn and
> perform, and produces a transparent exploration report showing which
> areas they may want to pursue further.

## Core Loop

``` text
Learn
  ↓
Try
  ↓
Struggle
  ↓
Adapt
  ↓
Solve / Create
  ↓
Reflect
  ↓
Measure
  ↓
Explore another domain
  ↓
Compare
  ↓
Choose
  ↓
Build
  ↓
Discover
```

## Product Philosophy

Pathfinder does not decide a student's future.

It gives the student enough real experience and evidence to make a
better decision themselves.

------------------------------------------------------------------------

# 54. Definition of Done for MVP

The MVP is complete when a new user can:

1.  Create an account.
2.  Understand the purpose of Pathfinder.
3.  Give or decline optional telemetry consent.
4.  Complete onboarding.
5.  Start Day 1.
6.  Learn a concept.
7.  Complete practical tasks.
8.  Receive feedback.
9.  Submit reflections.
10. Progress through all six domains.
11. Choose a domain on Day 7.
12. Complete a final project.
13. Receive a domain comparison.
14. See evidence supporting recommendations.
15. View confidence levels.
16. Receive next-step recommendations.
17. Export or view their report.
18. Manage privacy settings.
19. Delete their account and associated data.

The admin must be able to:

1.  Create domains.
2.  Create lessons.
3.  Create tasks.
4.  Configure scoring.
5.  Review aggregate task performance.
6.  Monitor journey completion.
7.  Manage content.
8.  Audit recommendation outputs.

------------------------------------------------------------------------

# 55. North Star Metric

> **Percentage of completed users who say Pathfinder gave them a clearer
> idea of what they want to explore next.**

This is more important than raw clicks, session duration, or number of
collected telemetry events.

The product succeeds when a confused student finishes seven days and
says:

> **"I still have a lot to learn, but now I know what I want to try
> next."**
