package com.ls.checks;

import org.sonar.check.Priority;
import org.sonar.check.Rule;
import org.sonar.plugins.java.api.IssuableSubscriptionVisitor;

import java.util.*;

import org.sonar.plugins.java.api.tree.CompilationUnitTree;
import org.sonar.plugins.java.api.tree.ExpressionTree;
import org.sonar.plugins.java.api.tree.ForStatementTree;
import org.sonar.plugins.java.api.tree.Tree;
import org.sonar.plugins.java.api.tree.Tree.Kind;
import org.sonar.plugins.java.api.tree.ClassTree;
import org.sonar.plugins.java.api.tree.PackageDeclarationTree;
import org.sonar.plugins.java.api.tree.IdentifierTree;
import org.sonar.plugins.java.api.tree.MethodInvocationTree;
import org.sonar.plugins.java.api.tree.BaseTreeVisitor;

@Rule(
        key = "S69",
        name = "Development",
        description =NoFunctionCallWhenDeclaringForLoop.MESSAGERULE,
        priority = Priority.MINOR,
        tags = {"bug"})
public class NoFunctionCallWhenDeclaringForLoop extends IssuableSubscriptionVisitor {

    protected static final String  MESSAGERULE =  "Do not call a function in the declaration of a for-type loop";

    private static final Map<String, Collection<Integer>> linesWithIssuesByClass = new HashMap<>();

    @Override
    public List<Kind> nodesToVisit() {
        return Collections.singletonList(Tree.Kind.FOR_STATEMENT);
    }

    @Override
    public void visitNode(Tree tree) {
        ForStatementTree method = (ForStatementTree) tree;
        MethodInvocationInForStatementVisitor invocationMethodVisitor = new MethodInvocationInForStatementVisitor();
        ExpressionTree condition = method.condition();
        if (null != condition) {
            Objects.requireNonNull(method.condition()).accept(invocationMethodVisitor);
        }
        method.update().accept(invocationMethodVisitor);
        method.initializer().accept(invocationMethodVisitor);
    }

    private void report(Tree tree) {
        if (tree.firstToken() != null) {
            final String classname = getFullyQualifiedNameOfClassOf(tree);
            final int line = Objects.requireNonNull(tree.firstToken()).line();

            if (!linesWithIssuesByClass.containsKey(classname)) {
                linesWithIssuesByClass.put(classname, new ArrayList<>());
            }

            linesWithIssuesByClass.get(classname).add(line);
        }

        reportIssue(tree, MESSAGERULE);
    }



    private String getFullyQualifiedNameOfClassOf(Tree tree) {
        Tree parent = tree.parent();

        while (parent != null) {
            final Tree grandparent = parent.parent();

            if (parent.is(Tree.Kind.CLASS) && grandparent != null && grandparent.is(Tree.Kind.COMPILATION_UNIT)) {
                final String packageName = getPackageName((CompilationUnitTree) grandparent);

                return packageName.isEmpty()
                        ? getClassName((ClassTree) parent)
                        : packageName + '.' + getClassName((ClassTree) parent);
            }

            parent = parent.parent();
        }

        return "";
    }


    private String getPackageName(CompilationUnitTree compilationUnitTree) {
        final PackageDeclarationTree packageDeclarationTree = compilationUnitTree.packageDeclaration();
        if (packageDeclarationTree == null) {
            return "";
        }

        return packageDeclarationTree.packageName().toString();
    }

    private String getClassName(ClassTree classTree) {
        final IdentifierTree simpleName = classTree.simpleName();
        return simpleName == null
                ? ""
                : simpleName.toString();
    }

    private class MethodInvocationInForStatementVisitor extends BaseTreeVisitor {

        @Override
        public void visitMethodInvocation(MethodInvocationTree tree) {
            if (!lineAlreadyHasThisIssue(tree)) {
                report(tree);
                return;
            }
            super.visitMethodInvocation(tree);
        }

        private boolean lineAlreadyHasThisIssue(Tree tree) {
            if (tree.firstToken() != null) {
                final String classname = getFullyQualifiedNameOfClassOf(tree);
                final int line = Objects.requireNonNull(tree.firstToken()).line();

                return linesWithIssuesByClass.containsKey(classname)
                        && linesWithIssuesByClass.get(classname).contains(line);
            }

            return false;
        }
    }
}
