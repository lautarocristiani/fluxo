# Fluxo - User Stories & Product Definition

## 1. Dashboard & Navigation (Role Based)

### US-01: Dispatcher Operations Dashboard

**As a Dispatcher (Backoffice),**
I want to see a global table of all Work Orders (status, assignee, customer),
So that I can monitor the overall operation efficiency.

#### Acceptance Criteria:
* View a Table with columns: ID, Customer, Service Type, Technician, Status, Date.
* Filter by "Status" (Pending, In Progress, Completed).
* Action button "**Create Order**" is visible only for Dispatchers.

### US-02: Technician "My Work" Dashboard

**As a Field Technician,**
I want to see a simplified list (Cards) of only my assigned orders,
So that I can quickly access my daily route on my mobile device without distractions.

#### Acceptance Criteria:
* View orders as "**Cards**" optimized for mobile view.
* Only show orders where `assignee_id` matches my user.
* Status indicators must be color-coded (Yellow: **Pending**, Blue: **In Progress**, Green: **Done**).

## 2. Order Management (The Core)

### US-03: Dynamic Order Creation (Dispatcher)

**As a Dispatcher,**
I want to create an order selecting a specific "**Service Template**",
So that the technician receives the correct form for that specific job type.

#### Acceptance Criteria:
* When selecting a Template (e.g., "Fiber Install"), the system links its JSON Schema.
* Dispatcher manually selects a Technician from a dropdown.

### US-04: Dynamic Form Execution (Technician)

**As a Field Technician,**
I want to fill out the specific fields required for the job type,
So that I capture accurate technical data.

#### Acceptance Criteria:
* **Critical:** The UI must be generated automatically from the JSON Schema (RJSF).
* Validations (Required fields, Min/Max numbers) must trigger before submission.
* Support for: Text Inputs, Number Inputs, Checkboxes, and Photo Uploads.

### US-05: Workflow Transitions & Validation

**As a System,**
I want to restrict status changes based on rules,
So that data integrity is maintained.

#### Acceptance Criteria:
* An order can only go from **Pending -> In Progress -> Completed**.
* An order cannot be Completed if the form data violates the JSON Schema validation.