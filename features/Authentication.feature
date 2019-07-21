Feature: GraphQL Authentication
  As a developer
  I want to use GraphQL to access my AuthUser model

Background:
  Given the Sequelize model AuthUser

Scenario: AuthUser includes a LoginInput type
  Then the GraphQL LoginInput type has fields:
  | field    | type              |
  | email    | string!           |
  | password | string!           |

Scenario: AuthUser includes a SignupInput type
  Then the GraphQL SignupInput type has fields:
  | field           | type              |
  | email           | string!           |
  | password        | string!           |
  | confirmPassword | string!           |

Scenario: AuthUser includes an AuthSuccess type
  Then the GraphQL AuthSuccess type has fields:
  | field    | type              |
  | token    | string!           |

Scenario: AuthUser defines a login mutation
  Then the GraphQL login mutation accepts LoginInput! and returns AuthSuccess

Scenario: AuthUser defines a signup mutation
  Then the GraphQL signup mutation accepts SignupInput! and returns AuthSuccess

Scenario: AuthUser excludes default mutations
  Then the GraphQL excludes mutations:
  | create  |
  | update  |
  | destroy |

Scenario: AuthUser excludes default queries
  Then the GraphQL excludes queries:
  | query  |
