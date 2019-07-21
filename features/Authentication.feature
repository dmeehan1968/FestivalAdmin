Feature: GraphQL Authentication
  As a developer
  I want to use GraphQL to access my AuthUser model

Scenario: AuthUser includes a LoginInput type
  Given the AuthUser model
  Then there is a GraphQL LoginInput type with fields
  | field    | type              |
  | email    | string!           |
  | password | string!           |

Scenario: AuthUser includes a SignupInput type
  Given the AuthUser model
  Then there is a GraphQL SignupInput type with fields
  | field           | type              |
  | email           | string!           |
  | password        | string!           |
  | confirmPassword | string!           |

Scenario: AuthUser includes an AuthSuccess type
  Given the AuthUser model
  Then there is a GraphQL AuthSuccess type with fields
  | field    | type              |
  | token    | string!           |

Scenario: AuthUser defines a login mutation
  Given the AuthUser model
  Then the login mutation accepts LoginInput! and returns AuthSuccess

Scenario: AuthUser defines a signup mutation
  Given the AuthUser model
  Then the signup mutation accepts SignupInput! and returns AuthSuccess

Scenario: AuthUser excludes default mutations
  Given the AuthUser model
  Then the GraphQL excludes mutations:
  | create  |
  | update  |
  | destroy |

Scenario: AuthUser excludes default queries
  Given the AuthUser model
  Then the GraphQL excludes queries:
  | query  |
  
