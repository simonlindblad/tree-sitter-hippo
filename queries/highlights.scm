[
  ; Function Calls
  (function_call
    function: (identifier) @function)
    
  ; Data Definitions
  (data_definition
    (identifier) @type)

  (data_definition_parameter
    (identifier) @parameter)

  (parameter
    (identifier) @parameter)

  ; Binary Expressions
  (or_operator) @operator
  (and_operator) @operator
  (comparison_operator) @operator
  (add_sub_operator) @operator
  (mult_div_operator) @operator

  (column_symbol) @field
  (column_reference
    (identifier) @field)

  ; General Identifiers and Literals
  (num_literal) @number
  (string_literal) @string

  (identifier) @variable

  (comment) @comment

  (function) @local.scope

  "{" @punctuation.bracket
  "}" @punctuation.bracket
  "[" @punctuation.bracket
  "]" @punctuation.bracket

  "use" @keyword
  "as" @keyword
  "fn" @keyword
  ":" @punctuation.delimiter
]

