package com.ls.checks;

import org.sonar.check.Priority;
import org.sonar.check.Rule;
import org.sonar.plugins.java.api.IssuableSubscriptionVisitor;
import org.sonar.plugins.java.api.tree.LiteralTree;
import org.sonar.plugins.java.api.tree.Tree;
import org.sonar.plugins.java.api.tree.Tree.Kind;

import java.util.ArrayList;
import java.util.List;

@Rule(
        key = "S74",
        name = "Development",
        description = AvoidFullSQLRequest.MESSAGERULE,
        priority = Priority.MINOR,
        tags = {"bug"})
public class AvoidFullSQLRequest  extends IssuableSubscriptionVisitor {

    protected static final String MESSAGERULE = "Don't use the query SELECT * FROM";
    private static final String REGEXPSELECTFROM = "(?i).*select.*\\*.*from.*";

    @Override
    public List<Kind> nodesToVisit() {
        List<Kind> kinds = new ArrayList<>();
        kinds.add(Kind.STRING_LITERAL);
        return kinds;
    }

    @Override
    public void visitNode(Tree tree) {
        boolean isSelectFrom = false;

        if (tree.is(Kind.STRING_LITERAL,Kind.TEXT_BLOCK)) {
            LiteralTree literal = (LiteralTree) tree;
            isSelectFrom = literal.value().matches(REGEXPSELECTFROM);
        }

        if (isSelectFrom) {
            reportIssue(tree, MESSAGERULE);
        }
    }
}
