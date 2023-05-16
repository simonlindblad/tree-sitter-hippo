[
  (function_definition
    name: (identifier) @function)

  (comment) @comment

  ; Function Calls
  (function_call
    function: (identifier) @function
    (argument
        (identifier) @variable))

  (function_call
    function: (identifier) @function)

  ; Assignments
  (assignment
    left: (identifier) @variable
    "=" @punctuation.separator.key-value)

  ; Data Definitions
  (data_definition
    (identifier) @type)

  (data_definition_parameter
    (identifier) @variable.parameter)
    

  ; Column Identifiers
  (column_identifier
    "@" @punctuation.special
    (identifier) @variable)

  (alias
    (identifier) @variable)

  ; Binary Expressions
  ((binary_expression operator: (or_operator)) @operator)
  ((binary_expression operator: (and_operator)) @operator)
  ((binary_expression operator: (comparison_operator)) @operator)
  ((binary_expression operator: (add_sub_operator)) @operator)
  ((binary_expression operator: (mult_div_operator)) @operator)

  ; General Identifiers and Literals
  (num_literal) @number
  (string_literal) @string

  "{" @punctuation.bracket
  "}" @punctuation.bracket

  "as" @keyword
  "fn" @keyword
  ":" @punctuation.delimiter
]

