Feature: Authentication UI
  In order for users to authenticate and gain access to restricted features
  As a
  I want

Scenario: Authentication form
  Given the authentication form
  Then login mode should be selected
  And the email field should exist
  And the email field should receive focus
  And the password field should exist
  And the submit button should be labelled "Login"

Scenario: Login success
  Given the authentication form
  When the email field contains "user@example.com"
  And the password field contains "Password1!"
  And the submit button is clicked
  Then the form should be submitted

Scenario Outline: Email Validation during Login
  Given the authentication form
  When the email field contains "<email>"
  And the password field contains "Val!dPa55word"
  Then the email field should <result> validation
  And the login button should be <state>

  Examples:
  | email            | result | state    | explanation                        |
  |                  | fail   | disabled | blank                              |
  | user             | fail   | disabled | no domain                          |
  | user@            | fail   | disabled | no domain                          |
  | user@example     | fail   | disabled | no TLD                             |
  | example.com      | fail   | disabled | no user                            |
  | @example.com     | fail   | disabled | no user                            |
  | user@example.com | pass   | enabled  | acceptable                         |

Scenario Outline: Password validation
  Given the authentication form
  When the email field contains "valid@example.com"
  And the password field contains "<password>"
  Then the password field should <result> validation
  And the login button should be <state>

  Examples:
  | password     | result | state    | explanation                          |
  |              | fail   | disabled | blank password                       |
  | short        | fail   | disabled | too short                            |
  | almost-      | fail   | disabled | too short                            |
  | password     | fail   | disabled | no capitals                          |
  | Password     | fail   | disabled | no numerals                          |
  | Password1    | fail   | disabled | no non-word characters               |
  | Password1!   | pass   | enabled  | acceptable                           |
  | $Gu3ss!me?   | pass   | enabled  | acceptable                           |
  | h3llo World! | pass   | enabled  | acceptable (embedded space)          |
