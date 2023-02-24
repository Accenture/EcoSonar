package com.ls.javachecks;

import org.sonar.check.Priority;
import org.sonar.check.Rule;
import org.sonar.plugins.java.api.IssuableSubscriptionVisitor;
import org.sonar.plugins.java.api.JavaFileScannerContext;
import org.sonar.plugins.java.api.JavaVersion;
import org.sonar.plugins.java.api.tree.NewClassTree;
import org.sonar.plugins.java.api.tree.Tree;
import org.sonar.plugins.java.api.tree.TryStatementTree;

import javax.annotation.ParametersAreNonnullByDefault;
import java.util.Deque;
import java.util.List;
import java.util.LinkedList;
import java.util.Arrays;
import java.util.ArrayList;

@Rule(
        key = "S79",
        name = "Developpement",
        description = FreeResourcesOfAutoCloseableInterface.MESSAGE_RULE,
        priority = Priority.MINOR,
        tags = {"bug"})
public class FreeResourcesOfAutoCloseableInterface extends IssuableSubscriptionVisitor {
    private final Deque<TryStatementTree> withinTry = new LinkedList<>();
    private final Deque<List<Tree>> toReport = new LinkedList<>();

    private static final String JAVA_LANG_AUTOCLOSEABLE = "java.lang.AutoCloseable";
    protected static final String MESSAGE_RULE = "Free resources";

    @Override
    @ParametersAreNonnullByDefault
    public void leaveFile(JavaFileScannerContext context) {
        withinTry.clear();
        toReport.clear();
    }

    @Override
    public List<Tree.Kind> nodesToVisit() {
        return Arrays.asList(Tree.Kind.TRY_STATEMENT, Tree.Kind.NEW_CLASS);
    }

    @Override
    public void visitNode(Tree tree) {
        if (tree.is(Tree.Kind.TRY_STATEMENT)) {
            withinTry.push((TryStatementTree) tree);
            if (withinTry.size() != toReport.size()) {
                toReport.push(new ArrayList<>());
            }
        }
        if (tree.is(Tree.Kind.NEW_CLASS) && ((NewClassTree) tree).symbolType().isSubtypeOf(JAVA_LANG_AUTOCLOSEABLE) && withinStandardTryWithFinally() ) {
            assert toReport.peek() != null;
            toReport.peek().add(tree);
        }
    }

    @Override
    public void leaveNode(Tree tree) {
        if (tree.is(Tree.Kind.TRY_STATEMENT)) {
            List<Tree> secondaryTrees = toReport.pop();
            if (!secondaryTrees.isEmpty()) {
                reportIssue(tree, MESSAGE_RULE);
            }
        }
    }

    private boolean withinStandardTryWithFinally() {
        if (withinTry.isEmpty() || !withinTry.peek().resourceList().isEmpty()) return false;
        assert withinTry.peek() != null;
        return withinTry.peek().finallyBlock() != null;
    }

    public boolean isCompatibleWithJavaVersion(JavaVersion version) {
        return version.isJava7Compatible();
    }
}
