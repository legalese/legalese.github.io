# Primary Use Cases

## Startup raises external financing

### Startup wants to present a term sheet to an external investor

## Angel investor wants to lead a deal

## Party needs to convert one flavour of contract to another contract

"We're out of strawberry ice cream. How about raspberry?"

"The investment is currently set up as a capped convertible debt agreement. Can we keep all the major provisions, but structure it as a preferred equity deal instead?"

## Startup needs an NDA

## Startup needs an employment agreement

# Secondary Use Cases

## Startup receives definitive documentation, needs it summarized

## Feature Wishlist / High-Level Components

The system has several interacting parts.

## Interpreter Family

Imports external representations of a contract into the canonical DSL syntax.

### Interpreter: XML, JSON, YAML

Reads XML, JSON, or YAML. Constructs canonical DSL syntax.

Spreadsheet needs to be well-formed.

### Interpreter: Google Spreadsheets

Reads a Google Spreadsheet directly using the Google Docs API.

Spreadsheet needs to be well-formed.

### Interpreter: CSV

Same format as for Google Spreadsheets.
