Feature: GraphQL Authentication

Scenario: Login
  Given the AuthUser model
  Then there is a GraphQL LoginInput type with fields
  | field    | type              |
  | email    | string!           |
  | password | string!           |
  And there is a login mutation that accepts LoginInput! and returns AuthSuccess
