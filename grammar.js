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
            $._expression,
            $.function_definition,
        ),

        // assignment is a rule that matches a variable assignment
        assignment: $ => seq(
            field("left", $.identifier),
            '=',
            $._expression
        ),

        // _expression is a helper rule that allows us to define all the expressions that we support
        _expression: $ => choice(
            $._base_expression,
            $.expression_chain
        ),

        // _base_expression is a helper rule that allows us to define the standalone (non-chained) expressions we support.
        _base_expression: $ => choice(
            $.data_definition,
            $.binary_expression,
            $.identifier,
            $.column_identifier,
            $.num_literal,
            $.string_literal,
            $.function_call
        ),

        // expression_chain is a rule that matches a chain of expressions
        expression_chain: $ => prec.left(1, seq(
            $._base_expression,
            repeat1(seq('|', $.function_call))
        )),

        data_definition: $ => seq(
            $.identifier,
            '{',
                optional($._data_definition_parameter_list),
            '}',
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

        function_definition: $ => prec(10, seq(
            'fn',
            field('name', $.identifier),
            '(',
                optional($._parameter_list),
            ')',
            '{',
                optional(repeat($._statement)),
            '}'
        )),

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

        or_operator: $ => 'or',
        and_operator: $ => 'and',
        comparison_operator: $ => choice('==', '!=', '<', '>', '<=', '>='),
        add_sub_operator: $ => choice('+', '-'),
        mult_div_operator: $ => choice('*', '/'),


        parameter: $ => $.identifier,

        column_identifier: $ => seq(
            '@',
            $.identifier
        ),

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

