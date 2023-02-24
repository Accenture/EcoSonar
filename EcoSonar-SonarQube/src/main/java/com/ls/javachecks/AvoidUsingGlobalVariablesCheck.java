package com.ls.javachecks;

import org.sonar.check.Priority;
import org.sonar.check.Rule;
import org.sonar.plugins.java.api.IssuableSubscriptionVisitor;
import org.sonar.plugins.java.api.tree.Tree;
import org.sonar.plugins.java.api.tree.Tree.Kind;
import org.sonar.plugins.java.api.tree.VariableTree;

import java.util.List;
import java.util.Arrays;
import java.util.regex.Pattern;

@Rule(
        key = "D4",
        name = "Developpement",
        description = AvoidUsingGlobalVariablesCheck.MESSAGE_RULE,
        priority = Priority.MINOR,
        tags = {"bug"})
public class AvoidUsingGlobalVariablesCheck extends IssuableSubscriptionVisitor {

	public static final String KEY = "PreferLocalVariablesToGlobalsCheck";
	public static final String MESSAGE_RULE = "Avoid using global variables";
	public static final String GLOBALS_PATTERN = "^.*(static).*$";

	@Override
	public List<Kind> nodesToVisit() {
		return Arrays.asList(Kind.STATIC_INITIALIZER, Kind.VARIABLE, Kind.METHOD);
	}
	@Override
	public void visitNode(Tree tree) {
		Pattern pattern = Pattern.compile(GLOBALS_PATTERN, Pattern.CASE_INSENSITIVE);

		if(tree.is(Kind.STATIC_INITIALIZER)){
			reportIssue(tree, String.format(MESSAGE_RULE, tree));
		}
		if(tree.is(Kind.VARIABLE)){
			int modifiersSize = ((VariableTree) tree).modifiers().modifiers().size();
			for(int i = 0; i < modifiersSize;i++){
				String modifier = ((VariableTree) tree).modifiers().modifiers().get(i).modifier().toString();
				if (pattern.matcher(modifier).matches()) {
					reportIssue(tree, String.format(MESSAGE_RULE, modifier));
				}
			}
		}
	}
}