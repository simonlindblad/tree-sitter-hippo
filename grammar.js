module.exports = grammar({
    name: 'hippo',

    extras: $ => [
        /\s/,
        $.comment,
    ],

    rules: {
        // source_file is the start rule of the grammar
        source_file: $ => repeat($._statement),

        // _statement is a helper rule that allows us to define
        // all the top-level statements that are allowed.
        _statement: $ => choice(
            $.assignment,
            $.use,
            $._expression,
        ),

        // assignment is a rule that matches a variable assignment
        assignment: $ => seq(
            field("left", $.identifier),
            '=',
            $._expression
        ),

        use: $ => seq(
            'use',
            $.string_literal,
            optional($._alias)
        ),

        _alias: $ => seq(
            'as',
            $.identifier,
        ),

        // _expression is a helper rule that allows us to define all the expressions that we support
        _expression: $ => choice(
            $._base_expression,
            $.expression_chain
        ),

        // _base_expression is a helper rule that allows us to define the standalone (non-chained) expressions we support.
        _base_expression: $ => choice(
            $.alias,
            $.data_definition,
            $.function,
            $.binary_expression,
            $.identifier,
            $.column_reference,
            $.num_literal,
            $.string_literal,
            $.collection,
            $.function_call
        ),

        collection: $ => seq(
            '[',
                optional($._expression_list),
            ']'
        ),

        function: $ => seq(
            'fn',
            '(',
                optional($._parameter_list),
            ')',
            '{',
                optional(repeat($._statement)),
            '}'
        ),

        // expression_chain is a rule that matches a chain of expressions
        expression_chain: $ => prec.left(1, seq(
            $._base_expression,
            repeat1(seq('|', $.function_call))
        )),

        alias: $ => seq(
            $._base_expression,
            'as',
            $.identifier
        ),

        data_definition: $ => seq(
            $.identifier,
            '{',
                optional($._data_definition_parameter_list),
            '}',
        ),

        _expression_list: $ => seq(
            $._expression,
            repeat(seq(',', $._expression))
        ),

        _data_definition_parameter_list: $ => seq(
            $.data_definition_parameter,
            repeat(seq(',', $.data_definition_parameter))
        ),

        data_definition_parameter: $ => seq(
            $.identifier,
            ':',
            $._expression
        ),

        operator: $ => $.identifier,

        _parameter_list: $ => seq(
            $.parameter,
            repeat(seq(',', $.parameter))
        ),

        binary_expression: $ => choice(
            prec.left(1, seq(
                $._base_expression,
                field('operator', $.or_operator),
                $._base_expression
            )),
            prec.left(2, seq(
                $._base_expression,
                field('operator', $.and_operator),
                $._base_expression
            )),
            prec.left(3, seq(
                $._base_expression,
                field('operator', $.comparison_operator),
                $._base_expression
            )),
            prec.left(4, seq(
                $._base_expression,
                field('operator', $.add_sub_operator),
                $._base_expression
            )),
            prec.left(5, seq(
                $._base_expression,
                field('operator', $.mult_div_operator),
                $._base_expression
            ))
        ),

        as_keyword: $ => 'as',
        use_keyword: $ => 'use',
        or_operator: $ => 'or',
        and_operator: $ => 'and',
        comparison_operator: $ => choice('==', '!=', '<', '>', '<=', '>='),
        add_sub_operator: $ => choice('+', '-'),
        mult_div_operator: $ => choice('*', '/'),


        parameter: $ => $.identifier,

        column_reference: $ => seq(
            field("column_symbol", $.column_symbol),
            $.identifier
        ),

        column_symbol: $ => "@",

        // Any identifier in the language. Needs to start with an alphabetic character.
        identifier: $ => prec(1, /[a-zA-Z][a-zA-Z0-9_]+/),

        // Any numerical literal that's supported in the language
        num_literal: $ => /\d+/,

        // Any string literal that's supported in the language
        string_literal: $ => token(seq(
            '"',
            repeat(/[^"]/),
            '"'
        )),

        // A function call is an identifier followed by a list of arguments
        function_call: $ => seq(
            field("function", $.identifier),
            '(',
                optional($._argument_list),
            ')'
        ),

        // An argument list is a comma-separated list of arguments. This is just a helper
        // rule to make the grammar more readable.
        _argument_list: $ => seq(
            $.argument,
            repeat(seq(',', $.argument))
        ),

        argument: $ => choice(
            $._expression,
            $.assignment
        ),

        comment: $ => /#[^\n]*/,
    }
});

