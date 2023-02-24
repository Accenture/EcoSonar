package com.ls.phpchecks;

import org.sonar.check.Priority;
import org.sonar.check.Rule;
import org.sonar.plugins.php.api.tree.Tree;
import org.sonar.plugins.php.api.tree.expression.LiteralTree;
import org.sonar.plugins.php.api.visitors.PHPSubscriptionCheck;

import java.util.Map;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Collections;
import java.util.ArrayList;

@Rule(
        key = AvoidDoubleQuoteCheck.KEY,
        name = AvoidDoubleQuoteCheck.ERROR_MESSAGE,
        description = AvoidDoubleQuoteCheck.ERROR_MESSAGE,
        priority = Priority.MINOR,
        tags = {"eco-design"})

public class AvoidDoubleQuoteCheck extends PHPSubscriptionCheck {

    public static final String ERROR_MESSAGE = "Avoid using double quote (\"), prefer using simple quote (')";
    public static final String KEY = "S66";
    private static final Map<String, Collection<Integer>> linesWithIssuesByFile = new HashMap<>();

    @Override
    public List<Tree.Kind> nodesToVisit() {
        return Collections.singletonList(Tree.Kind.REGULAR_STRING_LITERAL);
    }

    @Override
    public void visitNode(Tree tree) {
        LiteralTree method = (LiteralTree) tree;
        checkIssue(method);
    }

    public void checkIssue(LiteralTree literalTree) {
        if (lineAlreadyHasThisIssue(literalTree)) return;
        if (literalTree.value().indexOf("\"") == 0 && literalTree.value().lastIndexOf("\"") == literalTree.value().length() - 1) {
            repport(literalTree);
        }
    }

    private void repport(LiteralTree literalTree) {
        if (literalTree.token() != null) {

            final String classname = context().getPhpFile().toString();
            final int line = literalTree.token().line();
            linesWithIssuesByFile.computeIfAbsent(classname, k -> new ArrayList<>());
            linesWithIssuesByFile.get(classname).add(line);
        }
        context().newIssue(this, literalTree, ERROR_MESSAGE);

    }

    private boolean lineAlreadyHasThisIssue(LiteralTree literalTree) {
        if (literalTree.token() != null) {
            final String filename = context().getPhpFile().toString();
            final int line = literalTree.token().line();

            return linesWithIssuesByFile.containsKey(filename)
                    && linesWithIssuesByFile.get(filename).contains(line);
        }

        return false;
    }

}
