# Fluxo - BDD Scenarios (Source of Truth for Testing)

## Feature: Role-Based Dashboard Access

### Scenario: Dispatcher views the Operations Dashboard
Given I am logged in with role "Dispatcher"
And the following orders exist in the database:

| ID | Customer | Tech | Status |
| :--- | :--- | :--- | :--- |
| 01 | Acme | Lautaro | Pending |
| 02 | Globex | Juan | Done |

When I navigate to "/dashboard"
Then I should see a "Data Table" component showing all orders
And I should see both orders "01" and "02"
And I should see a button "Create New Order"

### Scenario: Technician views their Personal Dashboard
Given I am logged in as "Lautaro" (Technician)
And the following orders exist:

| ID | Customer | Tech | Status |
| :--- | :--- | :--- | :--- |
| 01 | Acme | Lautaro | Pending |
| 02 | Globex | Juan | Done |

When I navigate to "/dashboard"
Then I should NOT see a Data Table
But I should see a "Job Card" list
And I should see the order "01"
And I should NOT see the order "02" (assigned to Juan)
And I should NOT see the "Create New Order" button

## Feature: Dynamic Form Execution (RJSF)

### Scenario: Technician starts a "Fiber Installation" job
Given I am a Technician processing an order of type "Fiber Installation"
And the template requires:
* "Optical Power (dBm)" (Number, min: -30, max: -8)
* "Modem Serial" (String, required)

When I open the order details
And I click "Start Job"
Then the status should update to "In Progress"
And I should see a numeric input for "Optical Power"
And I should see a text input for "Modem Serial"

### Scenario: Validation blocks completion on invalid data
Given I am in the "Fiber Installation" form
When I enter "-40" in "Optical Power" (Below min value of -30)
And I click "Complete Order"
Then the system should show an error "Value must be >= -30"
And the order status should remain "In Progress"
And no data should be sent to the backend

### Scenario: Successful completion with Photo Evidence
Given I am filling out the installation form
When I enter "-18" in "Optical Power"
And I enter "SN123456" in "Modem Serial"
And I upload a photo to the "Installation Evidence" field
And I click "Complete Order"
Then the order status should change to "Completed"
And the database should store:

```json
{
"optical_power": -18,
"ont_serial": "SN123456",
"installation_photo": "data:image/..."
}