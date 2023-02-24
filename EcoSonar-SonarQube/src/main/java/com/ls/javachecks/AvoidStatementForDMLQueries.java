package com.ls.javachecks;

import org.sonar.check.Rule;
import org.sonar.check.Priority;
import org.sonar.plugins.java.api.IssuableSubscriptionVisitor;
import org.sonar.plugins.java.api.semantic.MethodMatchers;
import org.sonar.plugins.java.api.tree.Tree;
import org.sonar.plugins.java.api.tree.MethodInvocationTree;
import org.sonar.plugins.java.api.tree.Arguments;
import org.sonar.plugins.java.api.tree.ExpressionTree;
import org.sonar.plugins.java.api.tree.LiteralTree;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import java.util.Collections;
import java.util.List;

@Rule(key = "SDMLQ1",
        name = "Developpement",
        description = AvoidStatementForDMLQueries.RULE_MESSAGE,
        priority = Priority.MINOR,
        tags = {"bug"})

public class AvoidStatementForDMLQueries extends IssuableSubscriptionVisitor {
    protected static final String RULE_MESSAGE = "Use PreparedStatement instead of Statement";

    private final MethodMatchers executeMethod = MethodMatchers.or(
            MethodMatchers.create().ofSubTypes("java.sql.Statement").names("executeUpdate")
                    .withAnyParameters().build());

    @Override
    public List<Tree.Kind> nodesToVisit() {
        return Collections.singletonList(Tree.Kind.METHOD_INVOCATION);
    }

    @Override
    public void visitNode(Tree tree) {
        MethodInvocationTree methodInvocationTree = (MethodInvocationTree) tree;
        if (!executeMethod.matches(methodInvocationTree))
            return;
        Arguments arguments = methodInvocationTree.arguments();
        if (arguments.isEmpty())
            return;
        ExpressionTree first = arguments.get(0);
        if (first.is(Tree.Kind.STRING_LITERAL))
        {
            LiteralTree literalTree = (LiteralTree) first;
            String str = literalTree.value();
            String regex = "(SELECT|INSERT INTO|UPDATE|DELETE FROM)\\s?.*";
            Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(str);
            if (matcher.find())
                reportIssue(literalTree, "You must not use Statement for a DML query");
        }
    }
}
