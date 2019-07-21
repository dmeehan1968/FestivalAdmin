Feature: Authentication via GraphQL
  As a developer
  I want to expose authentication capabilities over GraphQL
  So that client apps can authenticate over the network

Background:
  Given the Sequelize model AuthUser

Scenario: AuthUser supports login credentials
  Then the GraphQL LoginInput type has fields:
  | field    | type              |
  | email    | string!           |
  | password | string!           |

Scenario: AuthUser supports signup credentials
  Then the GraphQL SignupInput type has fields:
  | field           | type              |
  | email           | string!           |
  | password        | string!           |
  | confirmPassword | string!           |

Scenario: AuthUser supports authentication success
  Then the GraphQL AuthSuccess type has fields:
  | field    | type              |
  | token    | string!           |

Scenario: AuthUser supports a login mutation
  Then the GraphQL login mutation accepts LoginInput! and returns AuthSuccess

Scenario: AuthUser supports a signup mutation
  Then the GraphQL signup mutation accepts SignupInput! and returns AuthSuccess

Scenario: AuthUser excludes default mutations
  Then the GraphQL excludes mutations:
  | create  |
  | update  |
  | destroy |

Scenario: AuthUser excludes default queries
  Then the GraphQL excludes queries:
  | query  |

Scenario: GraphQL login resolver calls AuthUser login
  Then the GraphQL login mutation resolver calls model login
  """
  {
    "resolver_args": [
      null,
      {
        "LoginInput": {
          "email": "email@example.com",
          "password": "password"
        }
      },
      null,
      null,
      null
    ],
    "method_args": [
      "email@example.com",
      "password"
    ]
  }
  """

Scenario: GraphQL signup resolver calls AuthUser signup
  Then the GraphQL signup mutation resolver calls model signup
  """
  {
    "resolver_args": [
      null,
      {
        "SignupInput": {
          "email": "email@example.com",
          "password": "password",
          "confirmPassword": "password"
        }
      },
      null,
      null,
      null
    ],
    "method_args": [
      "email@example.com",
      "password",
      "password"
    ]
  }
  """
