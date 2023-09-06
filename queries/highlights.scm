[
  ; Function Calls
  (function_call
    function: (identifier) @function)

  ; Data Definitions
  (data_definition
    (identifier) @type)

  ; Binary Expressions
  ((binary_expression operator: (or_operator)) @operator)
  ((binary_expression operator: (and_operator)) @operator)
  ((binary_expression operator: (comparison_operator)) @operator)
  ((binary_expression operator: (add_sub_operator)) @operator)
  ((binary_expression operator: (mult_div_operator)) @operator)

  ; General Identifiers and Literals
  (num_literal) @number
  (string_literal) @string

  (identifier) @variable
  (comment) @comment


  "{" @punctuation.bracket
  "}" @punctuation.bracket

  "as" @keyword
  "fn" @keyword
  ":" @punctuation.delimiter
]

