package com.ls.phpchecks;

import org.sonar.check.Priority;
import org.sonar.check.Rule;
import org.sonar.plugins.php.api.tree.Tree;
import org.sonar.plugins.php.api.visitors.PHPSubscriptionCheck;

import java.util.Collections;
import java.util.List;

@Rule(
        key = AvoidTryCatchFinallyCheckNOKfailsAllTryStatements.KEY,
        name = AvoidTryCatchFinallyCheckNOKfailsAllTryStatements.ERROR_MESSAGE,
        description = AvoidTryCatchFinallyCheckNOKfailsAllTryStatements.ERROR_MESSAGE,
        priority = Priority.MINOR,
        tags = {"eco-design"})
public class AvoidTryCatchFinallyCheckNOKfailsAllTryStatements extends PHPSubscriptionCheck {

    public static final String ERROR_MESSAGE = "Avoid using try-catch-finally";
    public static final String KEY = "S34";

    @Override
    public List<Tree.Kind> nodesToVisit() {
        return Collections.singletonList(Tree.Kind.TRY_STATEMENT);
    }

    @Override
    public void visitNode(Tree tree) {
        context().newIssue(this, tree, ERROR_MESSAGE);
    }

}