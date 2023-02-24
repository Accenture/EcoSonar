package com.ls.javachecks;

import org.sonar.check.Priority;
import org.sonar.check.Rule;
import org.sonar.plugins.java.api.IssuableSubscriptionVisitor;
import org.sonar.plugins.java.api.tree.ForEachStatement;
import org.sonar.plugins.java.api.tree.Tree;
import org.sonar.plugins.java.api.tree.Tree.Kind;

import java.util.Arrays;
import java.util.List;

@Rule(
        key = "S53",
        name = "Developpement",
        description = UseCorrectForLoop.MESSAGERULE,
        priority = Priority.MINOR,
        tags = {"bug"})
public class UseCorrectForLoop extends IssuableSubscriptionVisitor {

	protected static final String MESSAGERULE = "Avoid the use of Foreach with Arrays";
    @Override
    public List<Kind> nodesToVisit() {
        return Arrays.asList(Tree.Kind.FOR_EACH_STATEMENT);
    }

    @Override
    public void visitNode(Tree tree) {
    	
    	ForEachStatement forEachTree = (ForEachStatement) tree;
    	if (forEachTree.expression().symbolType().isArray()) {
            reportIssue(tree, MESSAGERULE);
        }
    }
}