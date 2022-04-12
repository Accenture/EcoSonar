package com.ls.checks;

import org.sonar.check.Priority;
import org.sonar.check.Rule;
import org.sonar.plugins.java.api.IssuableSubscriptionVisitor;
import org.sonar.plugins.java.api.tree.ForEachStatement;
import org.sonar.plugins.java.api.tree.Tree;
import org.sonar.plugins.java.api.tree.Tree.Kind;

import java.util.ArrayList;
import java.util.List;

@Rule(
        key = "S53",
        name = "Development",
        description = UseCorrectForLoop.MESSAGERULE,
        priority = Priority.MINOR,
        tags = {"bug"})

public class UseCorrectForLoop extends IssuableSubscriptionVisitor {

    protected static final String MESSAGERULE = "Avoid the use of Foreach with Arrays";
    @Override
    public List<Kind> nodesToVisit() {
        List<Kind> kinds = new ArrayList<>();
        kinds.add(Tree.Kind.FOR_EACH_STATEMENT);
        return kinds;
    }

    @Override
    public void visitNode(Tree tree) {

        ForEachStatement forEachTree = (ForEachStatement) tree;
        if (forEachTree.expression().symbolType().isArray()) {
            reportIssue(tree, MESSAGERULE);
        }
    }
}
